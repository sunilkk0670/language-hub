import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../pages/levels_page.dart';
import '../pages/language_mastery_paths_page.dart';
import '../providers/curriculum_provider.dart';

class LanguageCard extends StatefulWidget {
  final String languageId;
  final String flag;
  final String name;
  final String nativeScript;
  final Color color;
  final List<String>? metadataTags;

  const LanguageCard({
    super.key,
    required this.languageId,
    required this.flag,
    required this.name,
    required this.nativeScript,
    required this.color,
    this.metadataTags,
  });

  @override
  State<LanguageCard> createState() => _LanguageCardState();

  static Color getLanguageColor(String language) {
    switch (language.toLowerCase()) {
      case 'japanese': return Colors.red;
      case 'french': return Colors.blue;
      case 'spanish': return Colors.orange;
      case 'german': return Colors.amber;
      case 'chinese': return Colors.red;
      case 'korean': return Colors.purple;
      case 'italian': return Colors.green;
      case 'hindi': return Colors.orange;
      case 'punjabi': return Colors.orange.shade800;
      case 'sanskrit': return Colors.deepOrange;
      default: return Colors.blue;
    }
  }
}

class _LanguageCardState extends State<LanguageCard> {
  bool _isHovered = false;

  List<String> get _resolvedTags {
    if (widget.metadataTags != null && widget.metadataTags!.isNotEmpty) {
      return widget.metadataTags!;
    }
    final isJapanese = widget.languageId.toLowerCase() == 'japanese' ||
        widget.name.toLowerCase() == 'japanese';
    return [
      'A1–B1',
      '3,000 Words',
      if (isJapanese) 'Kanji',
    ];
  }

  @override
  Widget build(BuildContext context) {
    final tags = _resolvedTags;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutCubic,
        transform: Matrix4.translationValues(0.0, _isHovered ? -6.0 : 0.0, 0.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _isHovered
                ? widget.color.withValues(alpha: 0.6)
                : const Color(0xFFE2E8F0),
            width: _isHovered ? 1.5 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: _isHovered
                  ? widget.color.withValues(alpha: 0.14)
                  : const Color(0xFF0F172A).withValues(alpha: 0.04),
              blurRadius: _isHovered ? 24 : 12,
              offset: Offset(0, _isHovered ? 10 : 4),
            ),
          ],
        ),
        child: Consumer(
          builder: (context, ref, child) {
            return Material(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(20),
              child: InkWell(
                onTap: () {
                  // Update the selected language provider
                  ref.read(selectedLanguageProvider.notifier).state = widget.name;

                  if (widget.languageId.toLowerCase() == 'japanese') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => LanguageMasteryPathsPage(
                          languageId: widget.languageId,
                          languageName: widget.name,
                          flag: widget.flag,
                        ),
                      ),
                    );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => LevelsPage(
                          languageId: widget.languageId,
                          languageName: widget.name,
                          flag: widget.flag,
                        ),
                      ),
                    );
                  }
                },
                borderRadius: BorderRadius.circular(20),
                child: Padding(
                  padding: const EdgeInsets.all(22),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: widget.color.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: widget.color.withValues(alpha: 0.2),
                            width: 1,
                          ),
                        ),
                        child: Text(
                          widget.flag,
                          style: const TextStyle(fontSize: 40),
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        widget.name,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      if (widget.nativeScript.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          widget.nativeScript,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 15,
                            color: Color(0xFF475569),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        alignment: WrapAlignment.center,
                        children: tags.map((tag) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: const Color(0xFFE2E8F0),
                                width: 1,
                              ),
                            ),
                            child: Text(
                              tag,
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w600,
                                color: widget.color.withValues(alpha: 0.9),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
