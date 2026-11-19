class TtsSegment {
  final String text;
  final bool isTargetLanguage;

  const TtsSegment({required this.text, required this.isTargetLanguage});
}

class TtsScriptDetector {
  /// Set of language codes that use non-Latin scripts.
  static const Set<String> nonLatinLanguageCodes = {
    'hi-IN', // Hindi (Devanagari)
    'sa-IN', // Sanskrit (Devanagari)
    'pa-IN', // Punjabi (Gurmukhi)
    'ja-JP', // Japanese (Hiragana, Katakana, Kanji)
    'ko-KR', // Korean (Hangul)
    'zh-CN', // Chinese (Simplified / Hanzi)
    'zh-TW', // Chinese (Traditional / Hanzi)
    'ar-SA', // Arabic
  };

  /// Returns true if the language code uses a non-Latin script.
  static bool isNonLatinLanguage(String langCode) {
    return nonLatinLanguageCodes.contains(langCode);
  }

  /// Checks if a character code belongs to non-Latin Unicode blocks.
  static bool isNonLatinChar(int code) {
    return (code >= 0x0900 && code <= 0x097F) || // Devanagari (Hindi, Sanskrit)
        (code >= 0x0A00 && code <= 0x0A7F) || // Gurmukhi (Punjabi)
        (code >= 0x3040 && code <= 0x309F) || // Hiragana (Japanese)
        (code >= 0x30A0 && code <= 0x30FF) || // Katakana (Japanese)
        (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs / Kanji / Hanzi
        (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables (Korean)
        (code >= 0x0600 && code <= 0x06FF);   // Arabic
  }

  /// Checks if a character code is whitespace, punctuation, or ASCII symbol.
  static bool isNeutralChar(int code) {
    return (code >= 0 && code <= 64) ||
        (code >= 91 && code <= 96) ||
        (code >= 123 && code <= 127);
  }

  /// Checks if a string contains any non-Latin Unicode characters.
  static bool containsNonLatin(String text) {
    for (int i = 0; i < text.length; i++) {
      if (isNonLatinChar(text.codeUnitAt(i))) return true;
    }
    return false;
  }

  /// Strips markdown symbols, asterisks, brackets, and filters out non-supported symbols,
  /// preserving all Latin (including Latin Extended), Devanagari, Gurmukhi, Japanese, Chinese,
  /// Korean, and Arabic characters.
  static String cleanMarkdown(String text) {
    var cleaned = text
        .replaceAll(RegExp(r'\*\*|__'), '')
        .replaceAll(RegExp(r'\*|_'), '')
        .replaceAll(RegExp(r'#+\s'), '')
        .replaceAll(RegExp(r'\[(.*?)\]\(.*?\)'), r'$1')
        .replaceAll(RegExp(r'[`~]'), '')
        .replaceAll(RegExp(r'>\s'), '');

    final buffer = StringBuffer();
    for (int i = 0; i < cleaned.length; i++) {
      final code = cleaned.codeUnitAt(i);
      if ((code >= 0 && code <= 126) ||
          (code >= 0x0100 && code <= 0x024F) || // Latin Extended (Spanish, French, German, Italian, Portuguese)
          (code >= 0x0900 && code <= 0x097F) || // Devanagari
          (code >= 0x0A00 && code <= 0x0A7F) || // Gurmukhi
          (code >= 0x3040 && code <= 0x309F) || // Hiragana
          (code >= 0x30A0 && code <= 0x30FF) || // Katakana
          (code >= 0x4E00 && code <= 0x9FFF) || // Kanji / Hanzi
          (code >= 0xAC00 && code <= 0xD7AF) || // Hangul
          (code >= 0x0600 && code <= 0x06FF)) { // Arabic
        buffer.write(cleaned[i]);
      } else {
        buffer.write(' ');
      }
    }
    return buffer.toString().replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  /// Heuristic to detect if a text fragment is English.
  static bool looksLikeEnglish(String text) {
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

  /// Splits text into segments tagged as target or fallback language.
  static List<TtsSegment> splitIntoLanguageSegments(
    String text,
    String targetLangCode, {
    required bool isVoiceMissing,
  }) {
    final segments = <TtsSegment>[];
    if (text.trim().isEmpty) return segments;

    final isNonLatin = isNonLatinLanguage(targetLangCode);

    if (isNonLatin) {
      splitHolisticallyNonLatin(text, segments, isVoiceMissing: isVoiceMissing);
    } else {
      splitByParentheses(text, segments);
    }

    segments.removeWhere((s) => s.text.trim().isEmpty);
    return segments;
  }

  /// Line-based holistic splitting for Non-Latin scripts (Hindi, Sanskrit, Japanese, Korean, Chinese).
  static void splitHolisticallyNonLatin(
    String text,
    List<TtsSegment> segments, {
    required bool isVoiceMissing,
  }) {
    final lines = text.split('\n');
    for (var line in lines) {
      if (line.trim().isEmpty) continue;

      final hasNonLatin = containsNonLatin(line);

      if (hasNonLatin) {
        if (isVoiceMissing) {
          // Silence rule: Line has non-Latin script but voice is missing -> skip whole line
          continue;
        } else {
          // Native voice exists: split line by script for native-accented switches
          splitByScriptWithParens(line, segments);
        }
      } else {
        // Pure Latin line: check if it's longer English explanation or short transliteration
        if (line.trim().length > 15 || line.split(' ').length > 3) {
          segments.add(TtsSegment(text: line, isTargetLanguage: false));
        } else {
          segments.add(TtsSegment(text: line, isTargetLanguage: true));
        }
      }
    }
  }

  /// Splits a line by parentheses and script switches.
  static void splitByScriptWithParens(String text, List<TtsSegment> segments) {
    if (text.isEmpty) return;
    final parenRegex = RegExp(r'\(([^)]+)\)');
    int lastEnd = 0;
    for (final match in parenRegex.allMatches(text)) {
      if (match.start > lastEnd) {
        splitByScriptBasic(text.substring(lastEnd, match.start), segments);
      }
      final parenContent = match.group(0)!;
      final contentOnly = match.group(1)!;
      if (looksLikeEnglish(contentOnly) && contentOnly.split(' ').length > 4) {
        segments.add(TtsSegment(text: parenContent, isTargetLanguage: false));
      } else {
        segments.add(TtsSegment(text: parenContent, isTargetLanguage: true));
      }
      lastEnd = match.end;
    }
    if (lastEnd < text.length) {
      splitByScriptBasic(text.substring(lastEnd), segments);
    }
  }

  /// Splits contiguous text by Latin vs non-Latin character transitions.
  static void splitByScriptBasic(String text, List<TtsSegment> segments) {
    if (text.isEmpty) return;
    final buffer = StringBuffer();
    bool? currentIsNonLatin;

    for (int i = 0; i < text.length; i++) {
      final code = text.codeUnitAt(i);
      if (isNeutralChar(code)) {
        buffer.write(text[i]);
        continue;
      }
      final charIsNonLatin = isNonLatinChar(code);
      if (currentIsNonLatin != null && charIsNonLatin != currentIsNonLatin) {
        final content = buffer.toString().trim();
        if (content.isNotEmpty) {
          segments.add(TtsSegment(text: content, isTargetLanguage: currentIsNonLatin));
        }
        buffer.clear();
      }
      currentIsNonLatin = charIsNonLatin;
      buffer.write(text[i]);
    }
    final remaining = buffer.toString().trim();
    if (remaining.isNotEmpty) {
      segments.add(TtsSegment(text: remaining, isTargetLanguage: currentIsNonLatin ?? true));
    }
  }

  /// Splits Latin-script languages by parenthetical translations.
  static void splitByParentheses(String text, List<TtsSegment> segments) {
    final parenRegex = RegExp(r'\(([^)]+)\)');
    int lastEnd = 0;
    for (final match in parenRegex.allMatches(text)) {
      if (match.start > lastEnd) {
        final before = text.substring(lastEnd, match.start).trim();
        if (before.isNotEmpty) {
          segments.add(TtsSegment(text: before, isTargetLanguage: true));
        }
      }
      final parenContent = match.group(1)!;
      if (looksLikeEnglish(parenContent)) {
        segments.add(TtsSegment(text: parenContent, isTargetLanguage: false));
      } else {
        segments.add(TtsSegment(text: parenContent, isTargetLanguage: true));
      }
      lastEnd = match.end;
    }
    if (lastEnd < text.length) {
      final remaining = text.substring(lastEnd).trim();
      if (remaining.isNotEmpty) {
        segments.add(TtsSegment(text: remaining, isTargetLanguage: true));
      }
    }
    if (segments.isEmpty) {
      segments.add(TtsSegment(text: text, isTargetLanguage: true));
    }
  }
}
