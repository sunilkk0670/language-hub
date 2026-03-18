import 'dart:async';
import 'dart:html' as html;

class WebTtsService {
  static int _activeSpeechId = 0;

  static Future<void> speak(String text, String languageCode) async {
    try {
      // Cancel any ongoing speech first (Immediate)
      html.window.speechSynthesis?.cancel();

      // Wait for voices to load (especially important in Chrome)
      await _waitForVoices();

      // excessive asterisks or markdown symbols can cause TTS to say "asterisk"
      final cleanText = _cleanMarkdown(text);

      final utterance = html.SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageCode;
      utterance.rate = 0.8; // Slightly faster than 0.75 for better flow
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      final voice = _getBestVoice(languageCode);
      if (voice != null) {
        utterance.voice = voice;
      }
      
      html.window.speechSynthesis?.speak(utterance);
    } catch (e) {
      // TTS Error: $e
    }
  }

  /// Speaks text with multilingual voice switching.
  static Future<void> speakMultilingual(
    String text,
    String targetLangCode,
    String fallbackLang,
  ) async {
    try {
      final mySpeechId = ++_activeSpeechId;
      html.window.speechSynthesis?.cancel();
      
      // Voices are often empty on the first call in Chrome.
      // Wait briefly for voices to populate if they're missing.
      await _waitForVoices();

      final cleanText = _cleanMarkdown(text);
      final segments = _splitIntoLanguageSegments(cleanText, targetLangCode);

      if (segments.isEmpty) return;

      // Chain utterances sequentially using onEnd callbacks
      await _speakSegmentsSequentially(segments, targetLangCode, fallbackLang, mySpeechId);
    } catch (e) {
      // TTS Multilingual Error: $e
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

  /// Splits text into segments tagged as 'target' or 'fallback' (English).
  static List<_TtsSegment> _splitIntoLanguageSegments(
    String text,
    String targetLangCode,
  ) {
    final segments = <_TtsSegment>[];
    if (text.trim().isEmpty) return segments;

    final isNonLatin = _isNonLatinLanguage(targetLangCode);
    final isVoiceMissing = !_isVoiceAvailable(targetLangCode);

    if (isNonLatin) {
      // For non-Latin scripts: use holistic line-based splitting
      _splitHolisticallyNonLatin(text, segments, isVoiceMissing);
    } else {
      // For Latin-script languages: detect English in parentheses
      _splitByParentheses(text, segments);
    }

    segments.removeWhere((s) => s.text.trim().isEmpty);
    return segments;
  }

  /// For Non-Latin languages, we split by line. If a line contains non-Latin
  /// script (like Punjabi/Hindi) AND the voice is missing, we skip the WHOLE line
  /// to avoid "American accent" on embedded English words in a Punjabi sentence.
  static void _splitHolisticallyNonLatin(String text, List<_TtsSegment> segments, bool isVoiceMissing) {
    final lines = text.split('\n');
    for (var line in lines) {
      if (line.trim().isEmpty) continue;

      final hasNonLatin = _containsNonLatin(line);
      
      if (hasNonLatin) {
        if (isVoiceMissing) {
          // SILENCE RULE: Line has Punjabi script but no voice? Skip whole line.
          continue;
        } else {
          // Voice exists: split line by script for native-accented switches
          _splitByScriptWithParens(line, segments);
        }
      } else {
        // Pure Latin line: check if it's long English or short transliteration
        if (line.trim().length > 15 || line.split(' ').length > 3) {
          segments.add(_TtsSegment(text: line, isTargetLanguage: false));
        } else {
          segments.add(_TtsSegment(text: line, isTargetLanguage: true));
        }
      }
    }
  }

  static bool _containsNonLatin(String text) {
    for (int i = 0; i < text.length; i++) {
      if (_isNonLatinChar(text.codeUnitAt(i))) return true;
    }
    return false;
  }

  static bool _isNonLatinLanguage(String langCode) {
    const nonLatinCodes = {
      'hi-IN', 'pa-IN', 'sa-IN', 'ja-JP', 'ko-KR', 'zh-CN',
    };
    return nonLatinCodes.contains(langCode);
  }

  static void _splitByScriptWithParens(String text, List<_TtsSegment> segments) {
    if (text.isEmpty) return;
    final parenRegex = RegExp(r'\(([^)]+)\)');
    int lastEnd = 0;
    for (final match in parenRegex.allMatches(text)) {
      if (match.start > lastEnd) {
        _splitByScriptBasic(text.substring(lastEnd, match.start), segments);
      }
      final parenContent = match.group(0)!;
      final contentOnly = match.group(1)!;
      if (_looksLikeEnglish(contentOnly) && contentOnly.split(' ').length > 4) {
        segments.add(_TtsSegment(text: parenContent, isTargetLanguage: false));
      } else {
        segments.add(_TtsSegment(text: parenContent, isTargetLanguage: true));
      }
      lastEnd = match.end;
    }
    if (lastEnd < text.length) {
      _splitByScriptBasic(text.substring(lastEnd), segments);
    }
  }

  static void _splitByScriptBasic(String text, List<_TtsSegment> segments) {
    if (text.isEmpty) return;
    final buffer = StringBuffer();
    bool? currentIsNonLatin;
    
    for (int i = 0; i < text.length; i++) {
      final code = text.codeUnitAt(i);
      if (_isNeutralChar(code)) {
        buffer.write(text[i]);
        continue;
      }
      final charIsNonLatin = _isNonLatinChar(code);
      if (currentIsNonLatin != null && charIsNonLatin != currentIsNonLatin) {
        final content = buffer.toString().trim();
        if (content.isNotEmpty) {
          segments.add(_TtsSegment(text: content, isTargetLanguage: currentIsNonLatin));
        }
        buffer.clear();
      }
      currentIsNonLatin = charIsNonLatin;
      buffer.write(text[i]);
    }
    final remaining = buffer.toString().trim();
    if (remaining.isNotEmpty) {
      segments.add(_TtsSegment(text: remaining, isTargetLanguage: currentIsNonLatin ?? true));
    }
  }

  static void _splitByParentheses(String text, List<_TtsSegment> segments) {
    final parenRegex = RegExp(r'\(([^)]+)\)');
    int lastEnd = 0;
    for (final match in parenRegex.allMatches(text)) {
      if (match.start > lastEnd) {
        final before = text.substring(lastEnd, match.start).trim();
        if (before.isNotEmpty) {
          segments.add(_TtsSegment(text: before, isTargetLanguage: true));
        }
      }
      final parenContent = match.group(1)!;
      if (_looksLikeEnglish(parenContent)) {
        segments.add(_TtsSegment(text: parenContent, isTargetLanguage: false));
      } else {
        segments.add(_TtsSegment(text: parenContent, isTargetLanguage: true));
      }
      lastEnd = match.end;
    }
    if (lastEnd < text.length) {
      final remaining = text.substring(lastEnd).trim();
      if (remaining.isNotEmpty) {
        segments.add(_TtsSegment(text: remaining, isTargetLanguage: true));
      }
    }
    if (segments.isEmpty) {
      segments.add(_TtsSegment(text: text, isTargetLanguage: true));
    }
  }

  static bool _looksLikeEnglish(String text) {
    if (text.isEmpty) return false;
    int asciiAlpha = 0;
    int totalAlpha = 0;
    for (int i = 0; i < text.length; i++) {
      final code = text.codeUnitAt(i);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        asciiAlpha++;
        totalAlpha++;
      } else if (code > 127) {
        totalAlpha++;
      }
    }
    if (totalAlpha == 0) return false;
    return asciiAlpha / totalAlpha > 0.6;
  }

  static bool _isNonLatinChar(int code) {
    return (code >= 0x0900 && code <= 0x097F) || // Devanagari
        (code >= 0x0A00 && code <= 0x0A7F) || // Gurmukhi
        (code >= 0x3040 && code <= 0x309F) || // Hiragana
        (code >= 0x30A0 && code <= 0x30FF) || // Katakana
        (code >= 0x4E00 && code <= 0x9FFF) || // Kanji
        (code >= 0xAC00 && code <= 0xD7AF) || // Hangul
        (code >= 0x0600 && code <= 0x06FF);   // Arabic
  }

  static bool _isNeutralChar(int code) {
    return (code >= 0 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 127);
  }

  static Future<void> _speakSegmentsSequentially(
    List<_TtsSegment> segments,
    String targetLangCode,
    String fallbackLang,
    int mySpeechId,
  ) async {
    for (int i = 0; i < segments.length; i++) {
      if (mySpeechId != _activeSpeechId) return; // Abort if a new speech was triggered

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
      
      final voice = _getBestVoice(langCode);
      if (voice != null) {
        utterance.voice = voice;
      }
      utterance.onEnd.first.then((_) { if (!completer.isCompleted) completer.complete(); });
      utterance.onError.first.then((_) { if (!completer.isCompleted) completer.complete(); });
      html.window.speechSynthesis?.speak(utterance);
      Future.delayed(const Duration(seconds: 30), () { if (!completer.isCompleted) completer.complete(); });
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
        final vLang = v.lang;
        if (vLang == null) return false;
        final vCode = vLang.toLowerCase().replaceAll('_', '-');
        return vCode == normalizedCode || vCode.startsWith('$normalizedCode-');
      });
    } catch (e) { return false; }
  }

  static String _cleanMarkdown(String text) {
    var cleaned = text.replaceAll(RegExp(r'\*\*|__'), '').replaceAll(RegExp(r'\*|_'), '')
        .replaceAll(RegExp(r'#+\s'), '').replaceAll(RegExp(r'\[(.*?)\]\(.*?\)'), r'$1')
        .replaceAll(RegExp(r'[`~]'), '').replaceAll(RegExp(r'>\s'), '');
    final buffer = StringBuffer();
    for (int i = 0; i < cleaned.length; i++) {
        final code = cleaned.codeUnitAt(i);
        if ((code >= 0 && code <= 126) || (code >= 0x0900 && code <= 0x097F) || (code >= 0x0A00 && code <= 0x0A7F) ||
            (code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF) || (code >= 0x4E00 && code <= 0x9FFF) ||
            (code >= 0xAC00 && code <= 0xD7AF) || (code >= 0x0600 && code <= 0x06FF) || (code >= 0x0100 && code <= 0x024F)) {
            buffer.write(cleaned[i]);
        } else { buffer.write(' '); }
    }
    return buffer.toString().replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  static html.SpeechSynthesisVoice? _getBestVoice(String langCode) {
    try {
      final voices = html.window.speechSynthesis?.getVoices() ?? [];
      if (voices.isEmpty) return null;

      final normalizedCode = langCode.toLowerCase().replaceAll('_', '-');
      final candidates = voices.where((v) {
        final vLang = v.lang?.toLowerCase().replaceAll('_', '-') ?? '';
        return vLang == normalizedCode || vLang.startsWith('$normalizedCode-');
      }).toList();

      if (candidates.isEmpty) return null;

      if (normalizedCode == 'ja-jp') {
        for (final v in candidates) {
          final name = v.name?.toLowerCase() ?? '';
          if (name.contains('female') || name.contains('google 日本語') || 
              name.contains('ayumi') || name.contains('haruka')) {
            return v;
          }
        }
      }

      for (final v in candidates) {
        if (v.name?.toLowerCase().contains('female') == true) return v;
      }

      return candidates.first;
    } catch (e) {
      return null;
    }
  }

  static void stop() => html.window.speechSynthesis?.cancel();
}

class _TtsSegment {
  final String text;
  final bool isTargetLanguage;
  _TtsSegment({required this.text, required this.isTargetLanguage});
}
