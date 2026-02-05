import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../widgets/language_card.dart';
import '../widgets/chirpolly_logo.dart';

class AllLanguagesPage extends StatefulWidget {
  const AllLanguagesPage({super.key});

  @override
  State<AllLanguagesPage> createState() => _AllLanguagesPageState();
}

class _AllLanguagesPageState extends State<AllLanguagesPage> {
  final ScrollController _scrollController = ScrollController();
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    // Request focus when the page loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white.withOpacity(0.8),
        surfaceTintColor: Colors.transparent,
        toolbarHeight: 100, // Increased height for better fit
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: CircleAvatar(
            backgroundColor: Color(0xFF6A4CBC).withOpacity(0.1),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF6A4CBC)),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
        title: Center(
          child: Padding(
            padding: const EdgeInsets.only(right: 56.0), // Balanced with leading
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () {
                  Navigator.of(context).pushNamedAndRemoveUntil('/home', (route) => false);
                },
                child: Container(
                  color: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: const ChirPollyLogo(fontSize: 28),
                ),
              ),
            ),
          ),
        ),
      ),
      body: Focus(
        focusNode: _focusNode,
        autofocus: true,
        onKeyEvent: (FocusNode node, KeyEvent event) {
          if (event is KeyDownEvent) {
            const scrollAmount = 100.0;
            const pageScrollAmount = 500.0;
            
            if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
              _scrollController.animateTo(
                _scrollController.offset + scrollAmount,
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            } else if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
              _scrollController.animateTo(
                _scrollController.offset - scrollAmount,
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            } else if (event.logicalKey == LogicalKeyboardKey.pageDown) {
              _scrollController.animateTo(
                _scrollController.offset + pageScrollAmount,
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            } else if (event.logicalKey == LogicalKeyboardKey.pageUp) {
              _scrollController.animateTo(
                _scrollController.offset - pageScrollAmount,
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            } else if (event.logicalKey == LogicalKeyboardKey.home) {
              _scrollController.animateTo(
                0,
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            } else if (event.logicalKey == LogicalKeyboardKey.end) {
              _scrollController.animateTo(
                _scrollController.position.maxScrollExtent,
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeOut,
              );
              return KeyEventResult.handled;
            }
          }
          return KeyEventResult.ignored;
        },
        child: Stack(
          children: [
            // Vibrant Background
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xFFF3E5F5), // Light Purple
                    const Color(0xFFE1F5FE), // Light Blue
                    const Color(0xFFFFF3E0), // Light Orange
                  ],
                ),
              ),
            ),
            // Subtle Patterns or Decorative Elements
            Positioned(
              top: -50,
              right: -50,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  color: const Color(0xFF6A4CBC).withValues(alpha: 0.05),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            
            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('languages')
                  .where('enabled', isEqualTo: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 64, color: Colors.red),
                        const SizedBox(height: 16),
                        Text('Error loading languages', style: TextStyle(color: Colors.grey.shade800)),
                      ],
                    ),
                  );
                }

                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator(color: Color(0xFF6A4CBC)));
                }

                final languages = snapshot.data?.docs ?? [];

                if (languages.isEmpty) {
                  return const Center(
                    child: Text('No languages available yet.', style: TextStyle(fontSize: 18)),
                  );
                }

                return Scrollbar(
                  controller: _scrollController,
                  thumbVisibility: true,
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
                    child: Center(
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 1200),
                        child: Column(
                          children: [
                            // Header Section
                            ShaderMask(
                              shaderCallback: (bounds) => const LinearGradient(
                                colors: [Color(0xFF2E3192), Color(0xFF6A4CBC)],
                              ).createShader(bounds),
                              child: const Text(
                                'Master Your Next Language',
                                style: TextStyle(
                                  fontSize: 48,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  letterSpacing: -1.0,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.5),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                'Explore all 2026 courses with native-speaker audio and AI guidance.',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey.shade800,
                                  fontWeight: FontWeight.w500,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            const SizedBox(height: 80),
                            
                            // Grid Section
                            LayoutBuilder(
                              builder: (context, constraints) {
                                final width = constraints.maxWidth;
                                int crossAxisCount;
                                double childAspectRatio;
                                
                                if (width < 600) {
                                  crossAxisCount = 1;
                                  childAspectRatio = 1.1;
                                } else if (width < 1000) {
                                  crossAxisCount = 2;
                                  childAspectRatio = 1.35;
                                } else {
                                  crossAxisCount = 3;
                                  childAspectRatio = 1.4;
                                }

                                return GridView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: crossAxisCount,
                                    crossAxisSpacing: 32,
                                    mainAxisSpacing: 32,
                                    childAspectRatio: childAspectRatio,
                                  ),
                                  itemCount: languages.length,
                                  itemBuilder: (context, index) {
                                    final languageDoc = languages[index];
                                    final languageData = languageDoc.data() as Map<String, dynamic>;
                                    
                                    return LanguageCard(
                                      languageId: languageDoc.id,
                                      flag: languageData['flag'] ?? '🌍',
                                      name: languageData['name'] ?? 'Unknown',
                                      nativeScript: languageData['nativeScript'] ?? languageData['nativeName'] ?? '',
                                      color: LanguageCard.getLanguageColor(languageData['name'] ?? 'Unknown'),
                                    );
                                  },
                                );
                              },
                            ),
                            const SizedBox(height: 80),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
