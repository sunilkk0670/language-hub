import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../pages/levels_page.dart';
import '../pages/language_mastery_paths_page.dart';

class LanguageCard extends StatefulWidget {
  final String languageId;
  final String flag;
  final String name;
  final String nativeScript;
  final Color color;

  const LanguageCard({
    super.key,
    required this.languageId,
    required this.flag,
    required this.name,
    required this.nativeScript,
    required this.color,
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

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.identity()
          ..translate(0, _isHovered ? -10.0 : 0.0),
        child: Card(
          elevation: _isHovered ? 12 : 4,
          shadowColor: widget.color.withOpacity(0.4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  widget.color.withOpacity(0.1),
                  widget.color.withOpacity(0.3),
                ],
              ),
              border: Border.all(
                color: widget.color.withOpacity(_isHovered ? 0.8 : 0.5),
                width: 2,
              ),
            ),
            child: Consumer(
              builder: (context, ref, child) {
                return InkWell(
                  onTap: () {
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
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: widget.color.withOpacity(0.3),
                                blurRadius: 12,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: Text(
                            widget.flag,
                            style: const TextStyle(fontSize: 48),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          widget.name,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade900,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (widget.nativeScript.isNotEmpty) ...[
                          Text(
                            widget.nativeScript,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey.shade700,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
