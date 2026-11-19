import 'dart:async';
import 'dart:html' as html;
import 'tts_script_detector.dart';

class WebTtsService {
  static Future<void> speak(String text, String languageCode) async {
    try {
      // Cancel any ongoing speech first
      html.window.speechSynthesis?.cancel();

      // Clean markdown symbols to avoid reading "asterisk", etc.
      final cleanText = TtsScriptDetector.cleanMarkdown(text);

      final utterance = html.SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageCode;
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      html.window.speechSynthesis?.speak(utterance);
    } catch (e) {
      // ignore: avoid_print
      print('Web TTS Error: $e');
    }
  }

  /// Speaks text with multilingual voice switching.
  static Future<void> speakMultilingual(
    String text,
    String targetLangCode,
    String fallbackLang,
  ) async {
    try {
      html.window.speechSynthesis?.cancel();

      // Voices are often empty on the first call in Chrome. Wait briefly.
      await _waitForVoices();

      final cleanText = TtsScriptDetector.cleanMarkdown(text);
      final isMissing = !_isVoiceAvailable(targetLangCode);
      final segments = TtsScriptDetector.splitIntoLanguageSegments(
        cleanText,
        targetLangCode,
        isVoiceMissing: isMissing,
      );

      if (segments.isEmpty) return;

      // Chain utterances sequentially using onEnd callbacks
      await _speakSegmentsSequentially(segments, targetLangCode, fallbackLang);
    } catch (e) {
      // ignore: avoid_print
      print('Web TTS Multilingual Error: $e');
    }
  }

  /// Waits up to 1 second for speechSynthesis voices to be loaded.
  static Future<void> _waitForVoices() async {
    if (html.window.speechSynthesis == null) return;
    for (int i = 0; i < 10; i++) {
      final voices = html.window.speechSynthesis!.getVoices();
      if (voices.isNotEmpty) return;
      await Future.delayed(const Duration(milliseconds: 100));
    }
  }

  static Future<void> _speakSegmentsSequentially(
    List<TtsSegment> segments,
    String targetLangCode,
    String fallbackLang,
  ) async {
    for (int i = 0; i < segments.length; i++) {
      final segment = segments[i];

      if (segment.isTargetLanguage && !_isVoiceAvailable(targetLangCode)) {
        continue; // Silence Rule: skip target-language audio if no native voice
      }

      if (i > 0 && segments[i - 1].isTargetLanguage != segment.isTargetLanguage) {
        await Future.delayed(const Duration(milliseconds: 600));
      }

      final langCode = segment.isTargetLanguage ? targetLangCode : fallbackLang;
      await _speakAndWait(segment.text, langCode);
    }
  }

  static Future<void> _speakAndWait(String text, String langCode) {
    final completer = Completer<void>();
    try {
      final utterance = html.SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.8;
      utterance.onEnd.first.then((_) {
        if (!completer.isCompleted) completer.complete();
      });
      utterance.onError.first.then((_) {
        if (!completer.isCompleted) completer.complete();
      });
      html.window.speechSynthesis?.speak(utterance);
      Future.delayed(const Duration(seconds: 30), () {
        if (!completer.isCompleted) completer.complete();
      });
    } catch (e) {
      if (!completer.isCompleted) completer.complete();
    }
    return completer.future;
  }

  static bool _isVoiceAvailable(String langCode) {
    try {
      final voices = html.window.speechSynthesis?.getVoices() ?? [];
      if (voices.isEmpty) return false;
      final normalizedCode = langCode.toLowerCase().replaceAll('_', '-');
      return voices.any((v) {
        final vCode = v.lang?.toLowerCase().replaceAll('_', '-') ?? '';
        return vCode == normalizedCode || vCode.startsWith('$normalizedCode-');
      });
    } catch (e) {
      return false;
    }
  }

  static void stop() => html.window.speechSynthesis?.cancel();
}
