import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../widgets/chirpolly_logo.dart';
import 'kanji_lessons_page.dart';

class KanjiLevelsPage extends StatelessWidget {
  final String languageId;
  final String languageName;
  final String flag;

  const KanjiLevelsPage({
    super.key,
    required this.languageId,
    required this.languageName,
    required this.flag,
  });

  @override
  Widget build(BuildContext context) {
    final levels = [
      {'id': 'n5', 'name': 'N5 Kanji', 'description': 'The Foundation (100 Kanji)', 'color': Colors.green},
      {'id': 'n4', 'name': 'N4 Kanji', 'description': 'Basic Daily Life (300 Kanji)', 'color': Colors.blue},
      {'id': 'n3', 'name': 'N3 Kanji', 'description': 'Intermediate Mastery (650 Kanji)', 'color': Colors.orange},
      {'id': 'n2', 'name': 'N2 Kanji', 'description': 'Advanced Communication (600 Kanji)', 'color': Colors.deepOrange},
      {'id': 'n1', 'name': 'N1 Kanji', 'description': 'Native Level Fluency (500+ Kanji)', 'color': Colors.purple},
    ];

    final scrollController = ScrollController();
    final focusNode = FocusNode();

    return RawKeyboardListener(
      focusNode: focusNode,
      autofocus: true,
      onKey: (RawKeyEvent event) {
        if (event is RawKeyDownEvent) {
          if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
            scrollController.animateTo(
              scrollController.offset + 100,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOut,
            );
          } else if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
            scrollController.animateTo(
              scrollController.offset - 100,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOut,
            );
          }
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          elevation: 0,
          backgroundColor: Colors.white,
          forceMaterialTransparency: false,
          toolbarHeight: 80,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
          title: MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              child: Container(
                color: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: const ChirPollyLogo(fontSize: 24),
              ),
            ),
          ),
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Kanji Levels',
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Aligned with JLPT Standards',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                controller: scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 24),
                itemCount: levels.length,
                itemBuilder: (context, index) {
                  final level = levels[index];
                  return _buildLevelCard(context, level);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLevelCard(BuildContext context, Map<String, dynamic> level) {
    final color = level['color'] as Color;
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => KanjiLessonsPage(
                languageId: languageId,
                levelId: level['id'],
                levelName: level['name'],
                flag: flag,
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(
                    level['id'].toUpperCase(),
                    style: TextStyle(
                      color: color,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      level['name'],
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      level['description'],
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                color: Colors.grey.shade400,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
