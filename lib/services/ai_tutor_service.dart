import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_vertexai/firebase_vertexai.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/chat_message.dart';
import '../models/ai_tutor_response.dart';
import '../models/ai_usage_tracker.dart';

class AITutorService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  bool _initialized = false;

  /// Initialize Vertex AI model with function calling and grounding
  Future<void> initialize() async {
    if (_initialized) return;

    // Ensure user is authenticated (required for Vertex AI)
    if (FirebaseAuth.instance.currentUser == null) {
      try {
        await FirebaseAuth.instance.signInAnonymously();
      } catch (e) {
        print('Error signing in anonymously for AI: $e');
      }
    }
    
    _initialized = true;
  }

  /// Get contextualized AI response
  Future<AITutorResponse> getResponse({
    required String userId,
    required String targetLanguage,
    required String nativeLanguage,
    required String userMessage,
    List<ChatMessage>? conversationHistory,
  }) async {
    if (!_initialized) await initialize();

    // Check rate limit
    await _checkRateLimit(userId);

    // Fetch user progress
    final progress = await _getUserProgress(userId, targetLanguage);

    // Build system instruction with context
    final systemInstruction = _buildSystemInstruction(
      targetLanguage: targetLanguage,
      nativeLanguage: nativeLanguage,
      cefrLevel: progress['level'] ?? 'A1',
      currentModule: progress['currentModule'] ?? 1,
    );

    // Create model dynamically to ensure system instruction matches current language
    final vertexAI = FirebaseVertexAI.instance;
    final model = vertexAI.generativeModel(
      model: 'gemini-2.5-flash',
      generationConfig: GenerationConfig(
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
      ),
      systemInstruction: Content.system(systemInstruction),
      tools: [
        Tool(functionDeclarations: [
          _getVocabularyFunction(),
          _getKanjiFunction(),
          _getModuleInfoFunction(),
        ]),
      ],
    );

    // Create chat with history
    final chat = model.startChat(
      history: _convertHistory(conversationHistory),
    );

    // Send message
    final response = await chat.sendMessage(
      Content.text('$systemInstruction\n\nUser: $userMessage'),
    );

    // Handle function calls if present
    if (response.functionCalls != null && response.functionCalls!.isNotEmpty) {
      final functionResults = await _executeFunctionCalls(response.functionCalls!.toList());
      
      // Send function results back to model
      final functionResponse = await chat.sendMessage(
        Content.functionResponses(
          response.functionCalls!.map((call) {
            return FunctionResponse(
              call.name,
              functionResults[call.name] ?? {},
            );
          }).toList(),
        ),
      );
      
      return AITutorResponse(
        content: functionResponse.text ?? '',
        functionCallResult: functionResults,
      );
    }

    return AITutorResponse(content: response.text ?? '');
  }

  /// Build context-aware system instruction
  String _buildSystemInstruction({
    required String targetLanguage,
    required String nativeLanguage,
    required String cefrLevel,
    required int currentModule,
  }) {
    return '''
You are a friendly and patient language tutor for $targetLanguage.

Student Profile:
- Target language: $targetLanguage
- Native language: $nativeLanguage
- Current level: $cefrLevel (CEFR)
- Current module: Module $currentModule (out of 30)

Guidelines:
1. CRITICAL: You MUST respond in $targetLanguage only. Do not use other languages unless explicitly asked.
2. Respond primarily in $targetLanguage with $nativeLanguage explanations when needed
2. Adjust vocabulary and grammar complexity to $cefrLevel level
3. Use vocabulary from modules 1-$currentModule only
4. Correct mistakes gently with explanations
5. Provide cultural context when relevant
6. Use markdown formatting (bold, italics, lists, code blocks for vocabulary)
7. Keep responses concise (max 200 words unless asked for more)
8. Be encouraging and make learning fun!

Available Functions:
- getVocabulary: Fetch words from specific modules
- getKanji: Get Kanji details for Japanese
- getModuleInfo: Get module themes and topics

Use these functions when the student asks about specific vocabulary or topics.
''';
  }

  /// Function declaration for vocabulary lookup
  FunctionDeclaration _getVocabularyFunction() {
    return FunctionDeclaration(
      'getVocabulary',
      'Fetch vocabulary words from user\'s curriculum',
      Schema.object(
        properties: {
          'languageCode': Schema.string(
            description: 'Language code (e.g., "spanish", "japanese")',
          ),
          'moduleNumber': Schema.integer(
            description: 'Module number (1-30)',
          ),
          'level': Schema.string(
            description: 'CEFR level (a1, a2, b1)',
          ),
        },
        requiredProperties: ['languageCode', 'level', 'moduleNumber'],
      ),
    );
  }

  /// Function declaration for Kanji lookup
  FunctionDeclaration _getKanjiFunction() {
    return FunctionDeclaration(
      'getKanji',
      'Get detailed information about a specific Kanji character',
      Schema.object(
        properties: {
          'kanji': Schema.string(
            description: 'The Kanji character to look up',
          ),
        },
        requiredProperties: ['kanji'],
      ),
    );
  }

  /// Function declaration for module info
  FunctionDeclaration _getModuleInfoFunction() {
    return FunctionDeclaration(
      'getModuleInfo',
      'Get information about a specific module\'s theme and topics',
      Schema.object(
        properties: {
          'languageCode': Schema.string(
            description: 'Language code',
          ),
          'level': Schema.string(
            description: 'CEFR level (a1, a2, b1)',
          ),
          'moduleNumber': Schema.integer(
            description: 'Module number (1-30)',
          ),
        },
        requiredProperties: ['languageCode', 'level', 'moduleNumber'],
      ),
    );
  }

  /// Execute function calls and return results
  Future<Map<String, dynamic>> _executeFunctionCalls(
    List<FunctionCall> calls,
  ) async {
    final results = <String, dynamic>{};

    for (final call in calls) {
      switch (call.name) {
        case 'getVocabulary':
          results['getVocabulary'] = await _fetchVocabulary(call.args);
          break;
        case 'getKanji':
          results['getKanji'] = await _fetchKanji(call.args);
          break;
        case 'getModuleInfo':
          results['getModuleInfo'] = await _fetchModuleInfo(call.args);
          break;
      }
    }

    return results;
  }

  /// Fetch vocabulary from Firestore
  Future<Map<String, dynamic>> _fetchVocabulary(Map<String, dynamic> args) async {
    try {
      final languageCode = args['languageCode'] as String;
      final level = args['level'] as String;
      final moduleNumber = args['moduleNumber'] as int;

      final moduleId = '${languageCode}_${level}_m${moduleNumber.toString().padLeft(2, '0')}';
      
      final moduleDoc = await _firestore
          .collection('languages')
          .doc(languageCode)
          .collection('levels')
          .doc(level)
          .collection('modules')
          .doc(moduleId)
          .get();

      if (!moduleDoc.exists) {
        return {'error': 'Module not found'};
      }

      final data = moduleDoc.data()!;
      final lessons = data['lessons'] as List<dynamic>? ?? [];
      
      // Extract vocabulary from lessons
      final vocabulary = <Map<String, dynamic>>[];
      for (final lesson in lessons) {
        final words = lesson['words'] as List<dynamic>? ?? [];
        for (final word in words) {
          vocabulary.add({
            'word': word['word'],
            'translation': word['translation'],
            'example': word['example'],
          });
        }
      }

      return {
        'module': moduleNumber,
        'theme': data['theme'] ?? 'Unknown',
        'vocabulary': vocabulary.take(10).toList(), // Limit to 10 words
      };
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  /// Fetch Kanji data from Firestore
  Future<Map<String, dynamic>> _fetchKanji(Map<String, dynamic> args) async {
    try {
      final kanji = args['kanji'] as String;

      // Search across all lessons in mastery_modules/japanese_kanji/lessons
      final lessonsSnapshot = await _firestore
          .collection('mastery_modules')
          .doc('japanese_kanji')
          .collection('lessons')
          .get();

      // Search through each lesson's kanji_data array
      for (final lessonDoc in lessonsSnapshot.docs) {
        final kanjiDataList = lessonDoc.data()['kanji_data'] as List?;
        if (kanjiDataList == null) continue;

        // Find the matching Kanji character
        for (final kanjiItem in kanjiDataList) {
          if (kanjiItem['character'] == kanji) {
            // Return the Kanji data in the expected format
            return {
              'kanji': kanji,
              'meaning': kanjiItem['meaning'],
              'on_yomi': kanjiItem['on_yomi'],
              'kun_yomi': kanjiItem['kun_yomi'],
              'stroke_count': kanjiItem['stroke_count'],
              'mnemonic': kanjiItem['mnemonic'],
              'jlpt_level': lessonDoc.data()['level'],
              'lesson_name': lessonDoc.data()['name'],
            };
          }
        }
      }

      return {'error': 'Kanji not found in database'};
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  /// Fetch module information
  Future<Map<String, dynamic>> _fetchModuleInfo(Map<String, dynamic> args) async {
    try {
      final languageCode = args['languageCode'] as String;
      final level = args['level'] as String;
      final moduleNumber = args['moduleNumber'] as int;

      final moduleId = '${languageCode}_${level}_m${moduleNumber.toString().padLeft(2, '0')}';
      
      final moduleDoc = await _firestore
          .collection('languages')
          .doc(languageCode)
          .collection('levels')
          .doc(level)
          .collection('modules')
          .doc(moduleId)
          .get();

      if (!moduleDoc.exists) {
        return {'error': 'Module not found'};
      }

      final data = moduleDoc.data()!;
      return {
        'module': moduleNumber,
        'theme': data['theme'] ?? 'Unknown',
        'description': data['description'] ?? 'No description available',
        'wordCount': (data['lessons'] as List?)?.length ?? 0,
      };
    } catch (e) {
      return {'error': e.toString()};
    }
  }

  /// Get user progress from Firestore
  Future<Map<String, dynamic>> _getUserProgress(
    String userId,
    String targetLanguage,
  ) async {
    if (userId == 'guest') {
      return {'level': 'a1', 'currentModule': 1};
    }

    try {
      final progressDoc = await _firestore
          .collection('users')
          .doc(userId)
          .collection('progress')
          .doc(targetLanguage)
          .get();

      if (!progressDoc.exists) {
        return {'level': 'a1', 'currentModule': 1};
      }

      final data = progressDoc.data()!;
      return {
        'level': data['level'] ?? 'a1',
        'currentModule': data['currentModule'] ?? 1,
      };
    } catch (e) {
      return {'level': 'a1', 'currentModule': 1};
    }
  }

  /// Convert chat history to Vertex AI format
  List<Content> _convertHistory(List<ChatMessage>? messages) {
    if (messages == null || messages.isEmpty) return [];

    return messages.map((msg) {
      return Content(
        msg.isUser ? 'user' : 'model',
        [TextPart(msg.content)],
      );
    }).toList();
  }

  /// Check and enforce rate limiting
  Future<void> _checkRateLimit(String userId) async {
    // Skip rate limiting for guest users (or handle locally if needed)
    if (userId == 'guest') return;

    final today = DateTime.now().toIso8601String().split('T')[0];
    
    final usageDoc = await _firestore
        .collection('users')
        .doc(userId)
        .collection('ai_usage')
        .doc(today)
        .get();

    final usage = usageDoc.exists
        ? AIUsageTracker.fromJson(usageDoc.data()!)
        : AIUsageTracker(
            userId: userId,
            date: DateTime.now(),
            requestCount: 0,
          );

    if (usage.requestCount >= usage.dailyLimit) {
      throw Exception(
        'Daily AI request limit reached (${usage.dailyLimit} requests). '
        'Limit resets at midnight UTC.',
      );
    }

    // Increment counter
    await _firestore
        .collection('users')
        .doc(userId)
        .collection('ai_usage')
        .doc(today)
        .set({
      'userId': userId,
      'date': today,
      'requestCount': FieldValue.increment(1),
      'dailyLimit': 50,
    }, SetOptions(merge: true));
  }

  /// Get remaining requests for today
  Future<int> getRemainingRequests(String userId) async {
    if (userId == 'guest') return 50;

    final today = DateTime.now().toIso8601String().split('T')[0];
    
    final usageDoc = await _firestore
        .collection('users')
        .doc(userId)
        .collection('ai_usage')
        .doc(today)
        .get();

    if (!usageDoc.exists) return 50;

    final usage = AIUsageTracker.fromJson(usageDoc.data()!);
    return usage.dailyLimit - usage.requestCount;
  }
}
