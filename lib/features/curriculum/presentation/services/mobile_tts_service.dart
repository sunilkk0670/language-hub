import 'dart:async';
import 'package:flutter_tts/flutter_tts.dart';
import 'tts_script_detector.dart';

class WebTtsService {
  static final FlutterTts _flutterTts = FlutterTts();
  static bool _configured = false;

  static void _ensureConfigured() {
    if (_configured) return;
    _flutterTts.awaitSpeakCompletion(true);
    _flutterTts.setSpeechRate(0.5);
    _flutterTts.setPitch(1.0);
    _flutterTts.setVolume(1.0);
    _configured = true;
  }

  static Future<void> speak(String text, String languageCode) async {
    try {
      _ensureConfigured();
      await _flutterTts.stop();

      final cleanText = TtsScriptDetector.cleanMarkdown(text);
      if (cleanText.isEmpty) return;

      await _flutterTts.setLanguage(languageCode);
      await _flutterTts.speak(cleanText);
    } catch (e) {
      // ignore: avoid_print
      print('Mobile TTS Error: $e');
    }
  }

  /// Speaks text with multilingual voice switching for all 11 supported languages.
  static Future<void> speakMultilingual(
    String text,
    String targetLangCode,
    String fallbackLang,
  ) async {
    try {
      _ensureConfigured();
      await _flutterTts.stop();

      final cleanText = TtsScriptDetector.cleanMarkdown(text);
      if (cleanText.isEmpty) return;

      final isAvailable = await _isVoiceAvailable(targetLangCode);
      final segments = TtsScriptDetector.splitIntoLanguageSegments(
        cleanText,
        targetLangCode,
        isVoiceMissing: !isAvailable,
      );

      if (segments.isEmpty) return;

      for (int i = 0; i < segments.length; i++) {
        final segment = segments[i];

        if (segment.isTargetLanguage && !isAvailable) {
          // Silence rule: Skip target language audio if no native voice installed
          continue;
        }

        if (i > 0 && segments[i - 1].isTargetLanguage != segment.isTargetLanguage) {
          await Future.delayed(const Duration(milliseconds: 600));
        }

        final langCode = segment.isTargetLanguage ? targetLangCode : fallbackLang;
        await _flutterTts.setLanguage(langCode);
        await _flutterTts.speak(segment.text);
      }
    } catch (e) {
      // ignore: avoid_print
      print('Mobile TTS Multilingual Error: $e');
    }
  }

  static Future<bool> _isVoiceAvailable(String langCode) async {
    try {
      final res = await _flutterTts.isLanguageAvailable(langCode);
      if (res is bool) return res;
      if (res is int) return res == 1;
      return true;
    } catch (_) {
      return true; // Fallback to attempting speak if check fails
    }
  }

  static Future<void> stop() async {
    try {
      await _flutterTts.stop();
    } catch (e) {
      // ignore: avoid_print
      print('Mobile TTS Stop Error: $e');
    }
  }
}
