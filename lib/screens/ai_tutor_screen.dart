import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/subscription/presentation/providers/subscription_providers.dart';
import '../models/chat_message.dart';
import '../services/ai_tutor_service.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/typing_indicator.dart';
import '../widgets/quick_action_buttons.dart';
import '../widgets/ai_tutor_limit_badge.dart';

class AITutorScreen extends ConsumerStatefulWidget {
  final String targetLanguage;
  final String nativeLanguage;
  final String userId;
  final String userTier; // Added to know the tier

  const AITutorScreen({
    required this.targetLanguage,
    required this.nativeLanguage,
    required this.userId,
    this.userTier = 'free', // Default to free
    super.key,
  });

  @override
  ConsumerState<AITutorScreen> createState() => _AITutorScreenState();
}

class _AITutorScreenState extends ConsumerState<AITutorScreen> {
  final List<ChatMessage> _messages = [];
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final AITutorService _aiService = AITutorService();
  
  bool _isLoading = false;
  int _remainingRequests = 50;
  bool _initialized = false;
  
  // Available languages for the dropdown
  static const List<String> _availableLanguages = [
    'English', 'Spanish', 'Japanese', 'French', 'German', 'Chinese',
    'Korean', 'Italian', 'Hindi', 'Sanskrit', 'Portuguese',
  ];
  
  // Language code mapping for TTS
  static const Map<String, String> _languageCodes = {
    'English': 'en-US',
    'Spanish': 'es-ES',
    'Japanese': 'ja-JP',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Chinese': 'zh-CN',
    'Korean': 'ko-KR',
    'Italian': 'it-IT',
    'Hindi': 'hi-IN',
    'Sanskrit': 'sa-IN',
    'Portuguese': 'pt-PT',
  };
  
  // Currently selected language (local state)
  late String _selectedLanguage;



  @override
  void initState() {
    super.initState();
    _selectedLanguage = widget.targetLanguage;
    _initializeService();
    _loadRemainingRequests();
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _initializeService() async {
    try {
      await _aiService.initialize();
      setState(() {
        _initialized = true;
      });
      
      // Add welcome message
      setState(() {
        _messages.add(ChatMessage(
          id: DateTime.now().toString(),
          content: 'Hello! I\'m your AI tutor for **$_selectedLanguage**. '
              'Ask me anything about grammar, vocabulary, or culture! 🌟',
          isUser: false,
          timestamp: DateTime.now(),
        ));
      });
    } catch (e) {
      _showErrorDialog('Failed to initialize AI tutor: $e');
    }
  }

  Future<void> _loadRemainingRequests() async {
    try {
      final limit = ref.read(aiTutorLimitProvider(widget.userTier));
      final remaining = await _aiService.getRemainingRequests(widget.userId, limit);
      setState(() {
        _remainingRequests = remaining;
      });
    } catch (e) {
      debugPrint('Failed to load remaining requests: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Text('AI Tutor - '),
            // Language dropdown
            DropdownButton<String>(
              value: _selectedLanguage,
              underline: const SizedBox(),
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
              icon: const Icon(Icons.arrow_drop_down, color: Colors.black87),
              items: _availableLanguages.map((lang) {
                return DropdownMenuItem(
                  value: lang,
                  child: Text(lang),
                );
              }).toList(),
              onChanged: (newLang) {
                if (newLang != null && newLang != _selectedLanguage) {
                  setState(() {
                    _selectedLanguage = newLang;
                    _messages.clear();
                    _messages.add(ChatMessage(
                      id: DateTime.now().toString(),
                      content: 'Hello! I\'m your AI tutor for **$newLang**. '
                          'Ask me anything about grammar, vocabulary, or culture! 🌟',
                      isUser: false,
                      timestamp: DateTime.now(),
                    ));
                  });
                }
              },
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: AiTutorLimitBadge(
              remaining: _remainingRequests,
              total: ref.watch(aiTutorLimitProvider(widget.userTier)),
            ),
          ),
        ],
        elevation: 0,
      ),
      body: Column(
        children: [
          // Quick action buttons
          QuickActionButtons(
            onAction: _handleQuickAction,
          ),

          // Message list
          Expanded(
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.psychology_rounded,
                          size: 64,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _initialized
                              ? 'Start a conversation!'
                              : 'Initializing AI tutor...',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        if (!_initialized)
                          const Padding(
                            padding: EdgeInsets.only(top: 16),
                            child: CircularProgressIndicator(),
                          ),
                      ],
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(8),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      return ChatBubble(
                        message: _messages[index],
                        languageCode: _languageCodes[_selectedLanguage],
                      );
                    },
                  ),
          ),

          // Typing indicator
          if (_isLoading) const TypingIndicator(),

          // Input field
          _buildInputField(),
        ],
      ),
    );
  }

  Widget _buildInputField() {
    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                decoration: InputDecoration(
                  hintText: 'Ask me anything about $_selectedLanguage...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                maxLines: null,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
                enabled: _initialized && !_isLoading,
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: (_initialized && !_isLoading) ? _sendMessage : null,
              icon: const Icon(Icons.send_rounded),
            ),
          ],
        ),
      ),
    );
  }

  void _handleQuickAction(String query) {
    _textController.text = query;
    _sendMessage();
  }

  Future<void> _sendMessage() async {
    if (_textController.text.trim().isEmpty || !_initialized) return;

    final userMessage = _textController.text.trim();
    _textController.clear();

    setState(() {
      _messages.add(ChatMessage(
        id: DateTime.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: DateTime.now(),
      ));
      _isLoading = true;
    });

    _scrollToBottom();

    try {
      final limit = ref.read(aiTutorLimitProvider(widget.userTier));
      final response = await _aiService.getResponse(
        userId: widget.userId,
        targetLanguage: _selectedLanguage,
        nativeLanguage: widget.nativeLanguage,
        userMessage: userMessage,
        conversationHistory: _messages.where((m) => !m.isLoading).toList(),
        dailyLimit: limit,
      );

      setState(() {
        _messages.add(ChatMessage(
          id: DateTime.now().toString(),
          content: response.content,
          isUser: false,
          timestamp: DateTime.now(),
        ));
        _remainingRequests--;
      });
    } catch (e) {
      // Handle errors (rate limit, network, etc.)
      final errorMessage = e.toString();
      
      if (errorMessage.contains('Daily AI request limit reached')) {
        final limit = ref.read(aiTutorLimitProvider(widget.userTier));
        _showErrorDialog(
          'You\'ve reached your daily limit of $limit AI requests. '
          'Your limit will reset at midnight UTC. '
          'Come back tomorrow to continue learning! 🌙',
        );
      } else {
        _showErrorDialog('Error: $errorMessage');
      }
      
      // Remove the user message if there was an error
      setState(() {
        _messages.removeLast();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
