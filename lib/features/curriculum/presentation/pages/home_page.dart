import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../widgets/language_card.dart';
import '../../../auth/presentation/providers/auth_providers.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _languagesKey = GlobalKey();
  late AnimationController _parrotController;
  late Animation<double> _parrotAnimation;

  void _scrollToSection(GlobalKey key) {
    final context = key.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _parrotController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
    
    _parrotAnimation = Tween<double>(begin: -10, end: 10).animate(
      CurvedAnimation(parent: _parrotController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _parrotController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Focus(
      autofocus: true,
      onKeyEvent: (node, event) {
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
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: LayoutBuilder(
            builder: (context, constraints) {
              // Check if we're on mobile (width < 600px)
              final isMobile = MediaQuery.of(context).size.width < 600;
              
              return AppBar(
                elevation: 0,
                backgroundColor: Colors.white,
                surfaceTintColor: Colors.white,
                toolbarHeight: 110,
                centerTitle: false,
                automaticallyImplyLeading: false,
                title: Padding(
                  padding: const EdgeInsets.only(left: 16.0),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxHeight: isMobile ? 60 : 90,
                    ),
                    child: MouseRegion(
                      cursor: SystemMouseCursors.click,
                      child: GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () {
                          if (ModalRoute.of(context)?.settings.name != '/home') {
                            Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
                          } else {
                            _scrollController.animateTo(0, duration: const Duration(milliseconds: 500), curve: Curves.easeInOut);
                          }
                        },
                        child: Container(
                          color: Colors.transparent,
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  // Parrot mascot image
                                  Image.asset(
                                    'assets/images/parrot_transparent.png',
                                    height: isMobile ? 32.0 : 48.0,
                                    errorBuilder: (context, error, stackTrace) {
                                      return SizedBox(
                                        width: isMobile ? 32 : 48,
                                        height: isMobile ? 32 : 48,
                                      );
                                    },
                                  ),
                                  SizedBox(width: isMobile ? 8.0 : 20.0),
                                  // ChirPolly colorful text
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      _buildBrandLetter('C', Colors.blue.shade600, isMobile),
                                      _buildBrandLetter('h', Colors.red.shade500, isMobile),
                                      _buildBrandLetter('i', Colors.orange.shade600, isMobile),
                                      _buildBrandLetter('r', Colors.amber.shade700, isMobile),
                                      _buildBrandLetter('P', Colors.green.shade600, isMobile),
                                      _buildBrandLetter('o', Colors.teal.shade600, isMobile),
                                      _buildBrandLetter('l', Colors.purple.shade600, isMobile),
                                      _buildBrandLetter('l', Colors.pink.shade600, isMobile),
                                      _buildBrandLetter('y', Colors.deepPurple.shade600, isMobile),
                                    ],
                                  ),
                                ],
                              ),
                              if (!isMobile) ...[
                                ShaderMask(
                                  shaderCallback: (bounds) => const LinearGradient(
                                    colors: [Color(0xFF6A4CBC), Color(0xFF2E3192), Color(0xFFFF6B6B)],
                                  ).createShader(bounds),
                                  child: const Text(
                                    'Every voice. Every language. One world !',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                actions: isMobile
                    ? [
                        // Mobile: Show hamburger menu
                        Builder(
                          builder: (context) => IconButton(
                            icon: Icon(Icons.menu, color: Colors.grey.shade800),
                            onPressed: () => Scaffold.of(context).openEndDrawer(),
                          ),
                        ),
                        const SizedBox(width: 8),
                      ]
                    : [
                        // Desktop: Show navigation buttons
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/languages'),
                          child: Text(
                            'Languages',
                            style: TextStyle(
                              color: Colors.grey.shade800,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/about'),
                          child: Text(
                            'About',
                            style: TextStyle(
                              color: Colors.grey.shade800,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Login/Logout button
                        Consumer(
                          builder: (context, ref, child) {
                            final currentUser = ref.watch(currentUserProvider);
                            
                            if (currentUser != null) {
                              // User is logged in - show logout button
                              return PopupMenuButton<String>(
                                offset: const Offset(0, 50),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [const Color(0xFF6A4CBC).withValues(alpha: 0.3), Colors.transparent],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.account_circle,
                                        color: const Color(0xFF6A4CBC),
                                        size: 20,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        currentUser.email.split('@')[0],
                                        style: const TextStyle(
                                          color: Color(0xFF6A4CBC),
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Icon(
                                        Icons.arrow_drop_down,
                                        color: const Color(0xFF6A4CBC),
                                        size: 20,
                                      ),
                                    ],
                                  ),
                                ),
                                itemBuilder: (context) => [
                                  PopupMenuItem<String>(
                                    value: 'logout',
                                    child: Row(
                                      children: [
                                        Icon(Icons.logout, size: 18, color: Colors.grey.shade700),
                                        const SizedBox(width: 8),
                                        const Text('Sign Out'),
                                      ],
                                    ),
                                  ),
                                  PopupMenuItem<String>(
                                    value: 'delete_account',
                                    child: Row(
                                      children: [
                                        Icon(Icons.person_remove_outlined, size: 18, color: Colors.red.shade400),
                                        const SizedBox(width: 8),
                                        Text(
                                          'Delete Account',
                                          style: TextStyle(color: Colors.red.shade400),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                onSelected: (value) async {
                                  if (value == 'logout') {
                                    await ref.read(authControllerProvider.notifier).signOut();
                                  } else if (value == 'delete_account') {
                                    _showDeleteAccountConfirmation(context, ref);
                                  }
                                },
                              );
                            } else {
                              // User is not logged in - show login button
                              return TextButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/login');
                                },
                                child: Text(
                                  'Login',
                                  style: TextStyle(
                                    color: Colors.grey.shade800,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              );
                            }
                          },
                        ),
                        const SizedBox(width: 32),
                      ],
              );
            },
          ),
        ),
        endDrawer: MediaQuery.of(context).size.width < 600
            ? _buildMobileDrawer(context)
            : null,
        body: StreamBuilder<QuerySnapshot>(
          stream: FirebaseFirestore.instance
              .collection('languages')
              .where('enabled', isEqualTo: true)
              .snapshots(),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return _buildErrorState();
            }

            if (snapshot.connectionState == ConnectionState.waiting) {
              return _buildLoadingState();
            }

            final languages = snapshot.data?.docs ?? [];

            return SingleChildScrollView(
              controller: _scrollController,
              child: Column(
                children: [
                  _buildHeroSection(languages),
                  _buildFeaturesSection(),
                  _buildLanguagesSection(languages),
                  _buildLiarGameSection(),
                  _buildAboutSection(),
                  _buildCTASection(context),
                  _buildFooter(),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red.shade300),
          const SizedBox(height: 16),
          Text('Error loading languages', style: TextStyle(color: Colors.grey.shade700)),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: CircularProgressIndicator(color: Colors.blue.shade600),
    );
  }

  Widget _buildHeroSection(List<QueryDocumentSnapshot> languages) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          stops: const [0.0, 0.4, 0.7, 1.0],
          colors: [
            const Color(0xFFEDF5FF), // Extremely light blue
            const Color(0xFFF3EAFF), // Extremely light lavender
            const Color(0xFFFDF4E3), // Extremely light gold transition
            const Color(0xFFFFFFFF), // Pure white fade
          ],
        ),
      ),
      child: Column(
        children: [
          // Content
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
            child: LayoutBuilder(
              builder: (context, constraints) {
                // Responsive Breakpoint
                bool isDesktop = constraints.maxWidth > 900;

                return Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1200),
                    child: Flex(
                      direction: isDesktop ? Axis.horizontal : Axis.vertical,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Left Text Section (Flex 3)
                        Expanded(
                          flex: isDesktop ? 3 : 0,
                          child: Column(
                            crossAxisAlignment: isDesktop
                                ? CrossAxisAlignment.start
                                : CrossAxisAlignment.center,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(bottom: 20),
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: ShaderMask(
                                    shaderCallback: (bounds) => const LinearGradient(
                                      colors: [Color(0xFF2E3192), Color(0xFF6A4CBC)],
                                    ).createShader(bounds),
                                    child: Text(
                                      'Don\'t Just Learn.\nStart Chirping.',
                                      style: TextStyle(
                                        fontSize: isDesktop ? 64 : 42,
                                        fontWeight: FontWeight.bold, // Bold
                                        color: Colors.white,
                                        height: 1.25,
                                        letterSpacing: -0.5, // Tight letter spacing
                                      ),
                                      textAlign: isDesktop
                                          ? TextAlign.start
                                          : TextAlign.center,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                              ShaderMask(
                                shaderCallback: (bounds) => const LinearGradient(
                                  colors: [Color(0xFF2E3192), Color(0xFF4A90E2)],
                                ).createShader(bounds),
                                child: Text(
                                  'Break barriers. Preserve heritage.\nConnect with the world—one conversation at a time.',
                                  style: TextStyle(
                                    fontSize: 18, // Size 18
                                    color: Colors.white,
                                    height: 1.5, // Line height 1.5
                                    fontWeight: FontWeight.w600,
                                  ),
                                  textAlign: isDesktop
                                      ? TextAlign.start
                                      : TextAlign.center,
                                ),
                              ),
                              const SizedBox(height: 48),
                              
                              // CTA Button
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(50),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF6A4CBC).withValues(alpha: 0.3),
                                      offset: const Offset(0, 4),
                                      blurRadius: 10,
                                    ),
                                  ],
                                ),
                                child: ElevatedButton(
                                  onPressed: () => Navigator.pushNamed(context, '/languages'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF6A4CBC), // Solid Purple
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 48, vertical: 24),
                                    shape: const StadiumBorder(), // Fully rounded
                                    elevation: 0, // Using Container shadow instead for specific look
                                  ),
                                  child: const Text(
                                    'Start Learning Now',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                              if (!isDesktop) const SizedBox(height: 40),
                            ],
                          ),
                        ),
                        
                        // Right Image Section (Flex 2)
                        if (isDesktop) const SizedBox(width: 20),
                        
                        Expanded( // Changed from Flexible to Expanded for strict 3:2 ratio implementation in flex
                          flex: isDesktop ? 2 : 0,
                          child: ConstrainedBox(
                            constraints: BoxConstraints(
                              maxHeight: isDesktop ? 600 : 400,
                            ),
                            child: Padding(
                              padding: const EdgeInsets.only(right: 20.0), // Slight padding to right
                              child: AnimatedBuilder(
                                animation: _parrotAnimation,
                                builder: (context, child) {
                                  return Transform.translate(
                                    offset: Offset(0, _parrotAnimation.value),
                                    child: child,
                                  );
                                },
                                child: Image.asset(
                                  'assets/images/parrot_transparent.png',
                                  fit: BoxFit.contain,
                                  errorBuilder: (context, error, stackTrace) {
                                    return const SizedBox(
                                      height: 200,
                                      child: Center(
                                        child: Icon(Icons.image_not_supported,
                                            size: 64, color: Colors.black26),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildLanguagesSection(List<QueryDocumentSnapshot> languages) {
    if (languages.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      key: _languagesKey,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFFF3EAFF).withValues(alpha: 0.1), // Very light lavender
            const Color(0xFFEDF5FF).withValues(alpha: 0.1), // Very light blue
          ],
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFFFF6B6B), // Sunset Coral
                  Color(0xFF6A4CBC), // ChirPolly Purple
                  Color(0xFF4ECDC4), // Coastal Teal
                ],
              ),
              borderRadius: BorderRadius.circular(40),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6A4CBC).withValues(alpha: 0.25),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: const Text(
              'Choose Your Language',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Explore our growing collection of comprehensive language courses.',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade800,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 60),

          // Grid
          Container(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final width = constraints.maxWidth;
                final crossAxisCount = width < 600 ? 1 : (width < 900 ? 2 : 3);
                // Lower ratio = taller cards. Mobile needs height for Flag + Name + Native Name.
                // 0.9 ensures plenty of room for 2-3 lines of text.
                final childAspectRatio = width < 600 ? 0.9 : 1.3;

                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    crossAxisSpacing: 24,
                    mainAxisSpacing: 24,
                    childAspectRatio: childAspectRatio,
                  ),
                  itemCount: languages.length > 3 ? 3 : languages.length,
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
          ),
          const SizedBox(height: 48),
          // View All Languages Button
          if (languages.length > 3)
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(50),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6A4CBC).withOpacity(0.2),
                    offset: const Offset(0, 4),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, '/languages'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF6A4CBC),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 20,
                  ),
                  shape: StadiumBorder(
                    side: BorderSide(
                      color: const Color(0xFF6A4CBC).withOpacity(0.5),
                      width: 2,
                    ),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'View All Languages',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFeaturesSection() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white,
            const Color(0xFFF3E5F5).withOpacity(0.2),
          ],
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: Column(
            children: [
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [Color(0xFF6A4CBC), Color(0xFF2E3192)],
                ).createShader(bounds),
                child: const Text(
                  'What Makes ChirPolly Different',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 48),
              LayoutBuilder(
                builder: (context, constraints) {
                  final isDesktop = constraints.maxWidth > 900;
                  return Wrap(
                    spacing: 24,
                    runSpacing: 24,
                    alignment: WrapAlignment.center,
                    children: [
                      _buildFeatureCard(
                        icon: '🎮',
                        title: 'Unique Liar Game Challenge',
                        description: 'Test your learning with our signature game-based assessment',
                        isDesktop: isDesktop,
                      ),
                      _buildFeatureCard(
                        icon: '🌍',
                        title: '11 Languages',
                        description: 'English, French, Spanish, Korean, Japanese, German, Sanskrit, Hindi, Portuguese, Chinese & Italian',
                        isDesktop: isDesktop,
                      ),
                      _buildFeatureCard(
                        icon: '📚',
                        title: 'Structured A1 to B1 Courses',
                        description: 'Progressive learning from beginner to intermediate',
                        isDesktop: isDesktop,
                      ),
                      _buildFeatureCard(
                        icon: '💬',
                        title: '33,000 Vocabulary Words',
                        description: '3,000 words per language for comprehensive mastery',
                        isDesktop: isDesktop,
                      ),
                      _buildFeatureCard(
                        icon: '💎',
                        title: 'Japanese Kanji Mastery',
                        description: 'Premium Edition: Complete Jōyō Kanji curriculum with mnemonics, stroke counts, and integrated mastery tracking.',
                        isDesktop: isDesktop,
                      ),
                      _buildFeatureCard(
                        icon: '📱',
                        title: 'Web & Mobile',
                        description: 'Seamless experience across all your devices',
                        isDesktop: isDesktop,
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard({
    required String icon,
    required String title,
    required String description,
    required bool isDesktop,
  }) {
    return Container(
      width: isDesktop ? 350 : double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: const Color(0xFF6A4CBC).withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            icon,
            style: const TextStyle(fontSize: 40),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF2E3192),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade700,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiarGameSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF6A4CBC).withOpacity(0.1),
            const Color(0xFF2E3192).withOpacity(0.1),
          ],
        ),
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF6A4CBC),
                  Color(0xFF2E3192),
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6A4CBC).withOpacity(0.3),
                  blurRadius: 30,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                const Text(
                  '🎯 The Liar Game',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Text(
                  'Our innovative learning verification system. Instead of passive multiple choice, you actively hunt for the "liar" - the one incorrect translation hidden among correct ones. This neurological approach strengthens pattern recognition and genuine language understanding.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.95),
                    height: 1.6,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAboutSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      color: Colors.white,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Column(
            children: [
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [Color(0xFF6A4CBC), Color(0xFF2E3192)],
                ).createShader(bounds),
                child: const Text(
                  'About ChirPolly',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'ChirPolly is a language learning platform founded by Sunil Kumar Krishnan, a technology entrepreneur passionate about breaking language barriers and preserving cultural heritage. We believe everyone deserves a voice in the global conversation.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey.shade800,
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Text(
                'Our mission: Make language learning simple, beautiful, and culturally rooted. ChirPolly works seamlessly across web and mobile, offering structured courses from beginner (A1) to intermediate (B1) levels.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey.shade800,
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3E5F5).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF6A4CBC).withOpacity(0.2),
                    width: 1,
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      'Current Status: Live',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade900,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '11 major languages • 33,000+ vocabulary words • A1 to B1 levels • Web & Mobile',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade700,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCTASection(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white,
            const Color(0xFFE1F5FE).withOpacity(0.3),
          ],
        ),
      ),
      child: Center(
        child: Column(
          children: [
            ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [Color(0xFF6A4CBC), Color(0xFF2E3192)],
              ).createShader(bounds),
              child: const Text(
                'Ready to Start Your Language Journey?',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(50),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF6A4CBC).withValues(alpha: 0.3),
                        offset: const Offset(0, 4),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/login'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6A4CBC),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 40,
                        vertical: 20,
                      ),
                      shape: const StadiumBorder(),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Sign Up Free',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF6A4CBC),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 40,
                      vertical: 20,
                    ),
                    shape: const StadiumBorder(),
                    side: const BorderSide(
                      color: Color(0xFF6A4CBC),
                      width: 2,
                    ),
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF0D0E2B), // Deepest Midnight
            Color(0xFF15163D), // Deep Midnight Blue
            Color(0xFF2E3192), // Logo Blue
            Color(0xFF4A348F), // Indigo transition
            Color(0xFF6648B1), // Logo Purple
          ],
          stops: [0.0, 0.2, 0.5, 0.8, 1.0],
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      child: Column(
        children: [
          const Text(
            'ChirPolly',
            style: TextStyle(
              color: Colors.white,
              fontSize: 26,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'By Hrishikesh Innovations LLP',
            style: TextStyle(
              color: Colors.white.withOpacity(0.6),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 24,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              _buildFooterLink('Terms of Service', '/terms'),
              _buildFooterLink('Privacy Policy', '/privacy'),
              _buildFooterLink('Refund Policy', '/refund'),
            ],
          ),
          const SizedBox(height: 32),
          Divider(color: Colors.white.withOpacity(0.15), height: 1),
          const SizedBox(height: 20),
          Text(
            '© 2026 ChirPolly. All rights reserved.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooterLink(String title, String route) {
    return TextButton(
      onPressed: () => Navigator.pushNamed(context, route),
      style: TextButton.styleFrom(
        foregroundColor: Colors.grey.shade300,
        textStyle: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w500,
        ),
      ),
      child: Text(title),
    );
  }

  Widget _buildBrandLetter(String char, Color color, [bool isMobile = false]) {
    return Text(
      char,
      style: TextStyle(
        fontSize: isMobile ? 20.0 : 28.0,
        fontWeight: FontWeight.bold,
        color: color,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildMobileDrawer(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                children: [
                  Image.asset(
                    'assets/images/parrot_transparent.png',
                    height: 32.0,
                    errorBuilder: (context, error, stackTrace) {
                      return const SizedBox(width: 32, height: 32);
                    },
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'ChirPolly',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6A4CBC),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.language, color: Colors.grey.shade700),
              title: const Text('Languages'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/languages');
              },
            ),
            ListTile(
              leading: Icon(Icons.info_outline, color: Colors.grey.shade700),
              title: const Text('About'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/about');
              },
            ),
            const Divider(),
            Consumer(
              builder: (context, ref, child) {
                final currentUser = ref.watch(currentUserProvider);
                
                if (currentUser != null) {
                  // User is logged in
                  return Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.account_circle, color: Color(0xFF6A4CBC)),
                        title: Text(
                          currentUser.email.split('@')[0],
                          style: const TextStyle(
                            color: Color(0xFF6A4CBC),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      ListTile(
                        leading: Icon(Icons.logout, color: Colors.grey.shade700),
                        title: const Text('Sign Out'),
                        onTap: () async {
                          Navigator.pop(context);
                          await ref.read(authControllerProvider.notifier).signOut();
                        },
                      ),
                      ListTile(
                        leading: Icon(Icons.person_remove_outlined, color: Colors.red.shade400),
                        title: Text(
                          'Delete Account',
                          style: TextStyle(color: Colors.red.shade400),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          _showDeleteAccountConfirmation(context, ref);
                        },
                      ),
                    ],
                  );
                } else {
                  // User is not logged in
                  return ListTile(
                    leading: Icon(Icons.login, color: Colors.grey.shade700),
                    title: const Text('Login'),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/login');
                    },
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteAccountConfirmation(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text(
          'This action is permanent and will delete all your progress and data. '
          'For security reasons, you may need to log in again before this action can be completed.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context); // Close dialog
              await ref.read(authControllerProvider.notifier).deleteAccount();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red.shade400,
              foregroundColor: Colors.white,
            ),
            child: const Text('Delete Permanently'),
          ),
        ],
      ),
    );
  }
}
