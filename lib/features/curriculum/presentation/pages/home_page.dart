import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../widgets/language_card.dart';
import '../../../auth/presentation/providers/auth_providers.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

// ─── Brand colours ────────────────────────────────────────────────────────
const _kPurple = Color(0xFF6A4CBC); // "Start Learning Now" button purple
const _kTeal   = Color(0xFF4ECDC4); // Polly's wing teal

class _HomePageState extends ConsumerState<HomePage> with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _languagesKey = GlobalKey();

  // ── Existing float ──────────────────────────────────────────────────────
  late AnimationController _parrotController;
  late Animation<double>   _parrotAnimation;

  // ── Entrance bounce ─────────────────────────────────────────────────────
  late AnimationController _entranceController;
  late Animation<double>   _entranceScale;

  // ── Staggered headline ──────────────────────────────────────────────────
  late AnimationController    _staggerController;
  late Animation<double>      _line1Opacity;
  late Animation<Offset>      _line1Slide;
  late Animation<double>      _line2Opacity;
  late Animation<Offset>      _line2Slide;

  // ── Shimmer on "Chirping" ───────────────────────────────────────────────
  late AnimationController _shimmerController;

  // ── Button glow ─────────────────────────────────────────────────────────
  late AnimationController _glowController;
  late Animation<double>   _glowBlur;

  // ── Speech bubble ───────────────────────────────────────────────────────
  late AnimationController _bubbleController;
  late Animation<double>   _bubbleOpacity;
  late Animation<Offset>   _bubbleSlide;
  final ValueNotifier<String> _bubbleTextNotifier = ValueNotifier('');
  bool   _bubbleDone  = false;
  Timer? _typeTimer;
  Timer? _bubbleDelay;
  static const _fullBubbleText = "Hi! I'm Polly.\nReady to chirp? 🦜";

  // (Parallax hover removed — consistent behaviour on all screen sizes)

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

    // ── Float (existing, unchanged) ──────────────────────────────────────
    _parrotController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
    _parrotAnimation = Tween<double>(begin: -10, end: 10).animate(
      CurvedAnimation(parent: _parrotController, curve: Curves.easeInOut),
    );

    // ── Entrance bounce ──────────────────────────────────────────────────
    _entranceController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );
    _entranceScale = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.88, end: 1.04), weight: 60),
      TweenSequenceItem(tween: Tween(begin: 1.04, end: 0.98), weight: 20),
      TweenSequenceItem(tween: Tween(begin: 0.98, end: 1.00), weight: 20),
    ]).animate(CurvedAnimation(parent: _entranceController, curve: Curves.easeOut));
    _entranceController.forward();

    // ── Staggered headline ───────────────────────────────────────────────
    _staggerController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _line1Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.0, 0.5, curve: Curves.easeOut)));
    _line1Slide = Tween<Offset>(begin: const Offset(-0.15, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.0, 0.5, curve: Curves.easeOut)));
    _line2Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.4, 0.9, curve: Curves.easeOut)));
    _line2Slide = Tween<Offset>(begin: const Offset(-0.15, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.4, 0.9, curve: Curves.easeOut)));
    // Start immediately — no delay avoids the invisible-flash on first render
    _staggerController.forward();

    // ── Shimmer ──────────────────────────────────────────────────────────
    _shimmerController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();

    // ── Button glow ──────────────────────────────────────────────────────
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat(reverse: true);
    _glowBlur = Tween<double>(begin: 8, end: 28)
        .animate(CurvedAnimation(parent: _glowController, curve: Curves.easeInOut));

    // ── Speech bubble (delayed) ──────────────────────────────────────────
    _bubbleController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _bubbleOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _bubbleController, curve: Curves.easeOut));
    _bubbleSlide = Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _bubbleController, curve: Curves.easeOut));

    // Start bubble after entrance settles
    _bubbleDelay = Timer(const Duration(milliseconds: 1100), () {
      if (!mounted) return;
      _bubbleController.forward();
      // Typewriter — use ValueNotifier to avoid rebuilding the entire widget tree
      int idx = 0;
      _typeTimer = Timer.periodic(const Duration(milliseconds: 55), (t) {
        if (!mounted) { t.cancel(); return; }
        if (idx < _fullBubbleText.length) {
          _bubbleTextNotifier.value = _fullBubbleText.substring(0, ++idx);
        } else {
          setState(() => _bubbleDone = true);
          t.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _parrotController.dispose();
    _entranceController.dispose();
    _staggerController.dispose();
    _shimmerController.dispose();
    _glowController.dispose();
    _bubbleController.dispose();
    _bubbleTextNotifier.dispose();
    _typeTimer?.cancel();
    _bubbleDelay?.cancel();
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
                          onPressed: () => Navigator.pushNamed(context, '/pricing'),
                          child: Text(
                            'Pricing',
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
                        // AI Tutor button
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/ai-tutor'),
                          child: Text(
                            'AI Tutor',
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
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          stops: [0.0, 0.4, 0.7, 1.0],
          colors: [
            Color(0xFFEDF5FF),
            Color(0xFFF3EAFF),
            Color(0xFFFDF4E3),
            Color(0xFFFFFFFF),
          ],
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final bool isDesktop = constraints.maxWidth > 900;

                // Build left (text) section
                Widget leftSection = Column(
                            crossAxisAlignment: isDesktop
                                ? CrossAxisAlignment.start
                                : CrossAxisAlignment.center,
                            children: [

                              // ── Line 1: "Don't Just Learn." ───────────────
                              Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: FadeTransition(
                                  opacity: _line1Opacity,
                                  child: SlideTransition(
                                    position: _line1Slide,
                                    child: FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: ShaderMask(
                                        shaderCallback: (bounds) =>
                                            const LinearGradient(
                                          colors: [Color(0xFF2E3192), _kPurple],
                                        ).createShader(bounds),
                                        child: Text(
                                          "Don't Just Learn.",
                                          style: TextStyle(
                                            fontSize: isDesktop ? 64 : 42,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                            height: 1.25,
                                            letterSpacing: -0.5,
                                          ),
                                          textAlign: isDesktop
                                              ? TextAlign.start
                                              : TextAlign.center,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),

                              // ── Line 2: "Start [Chirping] with Polly." ─────
                              Padding(
                                padding: const EdgeInsets.only(bottom: 20),
                                child: FadeTransition(
                                  opacity: _line2Opacity,
                                  child: SlideTransition(
                                    position: _line2Slide,
                                    child: FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.baseline,
                                        textBaseline: TextBaseline.alphabetic,
                                        children: [
                                          // "Start "
                                          ShaderMask(
                                            shaderCallback: (b) =>
                                                const LinearGradient(
                                              colors: [
                                                Color(0xFF2E3192),
                                                _kPurple
                                              ],
                                            ).createShader(b),
                                            child: Text(
                                              'Start ',
                                              style: TextStyle(
                                                fontSize: isDesktop ? 64 : 42,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                                height: 1.25,
                                                letterSpacing: -0.5,
                                              ),
                                            ),
                                          ),
                                          // "Chirping" — animated shimmer
                                          AnimatedBuilder(
                                            animation: _shimmerController,
                                            builder: (context, child) {
                                              final t =
                                                  _shimmerController.value;
                                              return ShaderMask(
                                                shaderCallback: (bounds) =>
                                                    LinearGradient(
                                                  begin: Alignment.centerLeft,
                                                  end: Alignment.centerRight,
                                                  colors: const [
                                                    _kPurple,
                                                    _kTeal,
                                                    _kPurple,
                                                  ],
                                                  stops: [
                                                    (t - 0.4).clamp(0.0, 1.0),
                                                    t.clamp(0.0, 1.0),
                                                    (t + 0.4).clamp(0.0, 1.0),
                                                  ],
                                                ).createShader(bounds),
                                                child: Text(
                                                  'Chirping',
                                                  style: TextStyle(
                                                    fontSize:
                                                        isDesktop ? 64 : 42,
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.white,
                                                    height: 1.25,
                                                    letterSpacing: -0.5,
                                                  ),
                                                ),
                                              );
                                            },
                                          ),
                                          // " with Polly."
                                          ShaderMask(
                                            shaderCallback: (b) =>
                                                const LinearGradient(
                                              colors: [
                                                Color(0xFF2E3192),
                                                _kPurple
                                              ],
                                            ).createShader(b),
                                            child: Text(
                                              ' with Polly.',
                                              style: TextStyle(
                                                fontSize: isDesktop ? 64 : 42,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                                height: 1.25,
                                                letterSpacing: -0.5,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),

                              SizedBox(height: isDesktop ? 24 : 12),

                              // ── Subtitle ───────────────────────────────────
                              ShaderMask(
                                shaderCallback: (bounds) =>
                                    const LinearGradient(
                                  colors: [
                                    Color(0xFF2E3192),
                                    Color(0xFF4A90E2)
                                  ],
                                ).createShader(bounds),
                                child: Text(
                                  'Break barriers. Preserve heritage.\nConnect with the world—one conversation at a time.',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    color: Colors.white,
                                    height: 1.5,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  textAlign: isDesktop
                                      ? TextAlign.start
                                      : TextAlign.center,
                                ),
                              ),

                              SizedBox(height: isDesktop ? 48 : 20),

                              // ── CTA Button with glow pulse ─────────────────
                              AnimatedBuilder(
                                animation: _glowBlur,
                                builder: (context, child) {
                                  return Container(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(50),
                                      boxShadow: [
                                        BoxShadow(
                                          color:
                                              _kPurple.withValues(alpha: 0.7),
                                          offset: Offset.zero,
                                          blurRadius: _glowBlur.value,
                                          spreadRadius:
                                              _glowBlur.value * 0.25,
                                        ),
                                      ],
                                    ),
                                    child: ElevatedButton(
                                      onPressed: () => Navigator.pushNamed(
                                          context, '/languages'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: _kPurple,
                                        foregroundColor: Colors.white,
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 48, vertical: 24),
                                        shape: const StadiumBorder(),
                                        elevation: 0,
                                      ),
                                      child: const Text(
                                        'Start Learning Now',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),

                              if (!isDesktop) const SizedBox(height: 16),
                            ],
                          );

                // Build right (parrot) section
                Widget rightSection = ConstrainedBox(
                             constraints: BoxConstraints(
                              maxHeight: isDesktop ? 600 : double.infinity,
                            ),
                            child: Padding(
                              padding: const EdgeInsets.only(right: 20.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [

                                  // Mobile bubble — centred above Polly
                                  if (!isDesktop)
                                    FadeTransition(
                                      opacity: _bubbleOpacity,
                                      child: SlideTransition(
                                        position: _bubbleSlide,
                                        child: _buildBubble(isMobile: true),
                                      ),
                                    ),

                                  if (!isDesktop) const SizedBox(height: 8),

                                  // Parrot: entrance bounce + float + parallax
                                  Stack(
                                    clipBehavior: Clip.none,
                                    alignment: Alignment.center,
                                    children: [
                                      // Desktop bubble — beside Polly
                                      if (isDesktop)
                                        Positioned(
                                          left: -20,
                                          top: 20,
                                          child: FadeTransition(
                                            opacity: _bubbleOpacity,
                                            child: SlideTransition(
                                              position: _bubbleSlide,
                                              child: _buildBubble(
                                                  isMobile: false),
                                            ),
                                          ),
                                        ),

                                      // Bounce entrance wraps float animation
                                      ScaleTransition(
                                        scale: _entranceScale,
                                        child: AnimatedBuilder(
                                          animation: _parrotAnimation,
                                          builder: (context, child) {
                                            return Transform.translate(
                                              offset: Offset(
                                                  0, _parrotAnimation.value),
                                              child: child,
                                            );
                                          },
                                          child: ConstrainedBox(
                                            constraints: BoxConstraints(
                                              maxHeight: isDesktop ? 480 : 320,
                                            ),
                                            child: Image.asset(
                                              'assets/images/parrot_transparent.png',
                                              fit: BoxFit.contain,
                                              errorBuilder: (context, error,
                                                  stackTrace) {
                                                return const SizedBox(
                                                  height: 200,
                                                  child: Center(
                                                    child: Icon(
                                                      Icons.image_not_supported,
                                                      size: 64,
                                                      color: Colors.black26,
                                                    ),
                                                  ),
                                                );
                                              },
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  const SizedBox(height: 4),
                                  Text(
                                    'Meet Polly',
                                    style: TextStyle(
                                      fontSize: isDesktop ? 15 : 13,
                                      fontStyle: FontStyle.italic,
                                      color: Colors.grey.shade500,
                                      letterSpacing: 0.3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                // Assemble layout
                return Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1200),
                    child: isDesktop
                        ? Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Expanded(flex: 3, child: leftSection),
                              const SizedBox(width: 20),
                              Expanded(flex: 2, child: rightSection),
                            ],
                          )
                        : Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              leftSection,
                              rightSection,
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

  // ── Glassmorphic speech bubble ───────────────────────────────────────────
  Widget _buildBubble({required bool isMobile}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          constraints: BoxConstraints(maxWidth: isMobile ? 220 : 200),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.55),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.7),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: _kPurple.withValues(alpha: 0.12),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: isMobile
                ? CrossAxisAlignment.center
                : CrossAxisAlignment.start,
            children: [
              // Decorative dot-tail indicator
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _dot(6, _kPurple.withValues(alpha: 0.7)),
                  const SizedBox(width: 3),
                  _dot(4, _kTeal.withValues(alpha: 0.6)),
                  const SizedBox(width: 3),
                  _dot(3, _kPurple.withValues(alpha: 0.4)),
                ],
              ),
              const SizedBox(height: 6),
              ValueListenableBuilder<String>(
                valueListenable: _bubbleTextNotifier,
                builder: (context, text, _) => Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      text,
                      style: TextStyle(
                        fontSize: isMobile ? 12 : 13,
                        color: const Color(0xFF2E3192),
                        fontWeight: FontWeight.w600,
                        height: 1.4,
                      ),
                      textAlign:
                          isMobile ? TextAlign.center : TextAlign.left,
                    ),
                    if (!_bubbleDone)
                      const Text(
                        '|',
                        style: TextStyle(
                          fontSize: 13,
                          color: _kPurple,
                          fontWeight: FontWeight.bold,
                        ),
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

  Widget _dot(double size, Color color) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      );

  Widget _buildLanguagesSection(List<QueryDocumentSnapshot> languages) {
    if (languages.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      key: _languagesKey,
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFF080808),
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
              color: Colors.grey.shade400,
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

  Widget _buildDynamicGradientText(String text, {required double startOffset, required double endOffset, double fontSize = 36}) {
    return AnimatedBuilder(
      animation: _scrollController,
      builder: (context, child) {
        final offset = _scrollController.hasClients ? _scrollController.offset : 0.0;
        final progress = ((offset - startOffset) / (endOffset - startOffset)).clamp(0.0, 1.0);
        
        final List<Color> colors = [
          const Color(0xFF4ECDC4), // Teal
          const Color(0xFF2E3192), // Deep Blue
          const Color(0xFF6A4CBC), // Purple
          const Color(0xFFFF6B6B), // Coral
          const Color(0xFFFFA726), // Orange
          const Color(0xFF4ECDC4), // Teal
        ];

        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment(-2.0 + (progress * 4), -1.0), 
              end: Alignment(0.0 + (progress * 4), 1.0),
              colors: colors,
            ).createShader(bounds);
          },
          child: Text(
            text,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        );
      },
    );
  }

  Widget _buildFeaturesSection() {
    return AnimatedBuilder(
      animation: _scrollController,
      builder: (context, child) {
        final offset = _scrollController.hasClients ? _scrollController.offset : 0.0;
        final progress = ((offset - 300) / 400).clamp(0.0, 1.0);
        
        return Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Color.lerp(Colors.white, const Color(0xFF080808), progress),
          ),
          padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1200),
              child: Column(
                children: [
                  _buildDynamicGradientText(
                    'What Makes ChirPolly Different',
                    startOffset: 300,
                    endOffset: 900,
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
                            progress: progress,
                          ),
                          _buildFeatureCard(
                            icon: '🌍',
                            title: '11 Languages',
                            description: 'English, French, Spanish, Korean, Japanese, German, Sanskrit, Hindi, Portuguese, Chinese & Italian',
                            isDesktop: isDesktop,
                            progress: progress,
                          ),
                          _buildFeatureCard(
                            icon: '📚',
                            title: 'Structured A1 to B1 Courses',
                            description: 'Progressive learning from beginner to intermediate',
                            isDesktop: isDesktop,
                            progress: progress,
                          ),
                          _buildFeatureCard(
                            icon: '💬',
                            title: '33,000 Vocabulary Words',
                            description: '3,000 words per language for comprehensive mastery',
                            isDesktop: isDesktop,
                            progress: progress,
                          ),
                          _buildFeatureCard(
                            icon: '💎',
                            title: 'Japanese Kanji Mastery',
                            description: 'Premium Edition: Complete Jōyō Kanji curriculum with mnemonics, stroke counts, and integrated mastery tracking.',
                            isDesktop: isDesktop,
                            progress: progress,
                          ),
                          _buildFeatureCard(
                            icon: '📱',
                            title: 'Web & Mobile',
                            description: 'Seamless experience across all your devices',
                            isDesktop: isDesktop,
                            progress: progress,
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
      },
    );
  }

  Widget _buildFeatureCard({
    required String icon,
    required String title,
    required String description,
    required bool isDesktop,
    double progress = 0.0,
  }) {
    final bgColor = Color.lerp(Colors.white, const Color(0xFF151515), progress)!;
    final titleColor = Color.lerp(const Color(0xFF2E3192), Colors.white, progress)!;
    final descColor = Color.lerp(Colors.grey.shade700, Colors.grey.shade400, progress)!;
    final borderColor = Color.lerp(
      const Color(0xFF6A4CBC).withOpacity(0.1),
      Colors.white.withOpacity(0.1),
      progress,
    )!;

    return Container(
      width: isDesktop ? 350 : double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: borderColor,
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
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: titleColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: descColor,
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
      decoration: const BoxDecoration(
        color: Color(0xFF080808),
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
                _buildDynamicGradientText('🎯 The Liar Game', startOffset: 1200, endOffset: 1800, fontSize: 32),
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
    return AnimatedBuilder(
      animation: _scrollController,
      builder: (context, child) {
        final offset = _scrollController.hasClients ? _scrollController.offset : 0.0;
        final progress = ((offset - 1600) / 400).clamp(0.0, 1.0);
        
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
          decoration: BoxDecoration(
            color: Color.lerp(const Color(0xFF080808), Colors.white, progress),
          ),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 900),
              child: Column(
                children: [
                  _buildDynamicGradientText('About ChirPolly', startOffset: 1800, endOffset: 2400),
                  const SizedBox(height: 32),
                  Text(
                    'ChirPolly is a language learning platform founded by Sunil Kumar Krishnan, a technology entrepreneur passionate about breaking language barriers and preserving cultural heritage. We believe everyone deserves a voice in the global conversation.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Color.lerp(Colors.grey.shade400, Colors.grey.shade800, progress),
                      height: 1.6,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Our mission: Make language learning simple, beautiful, and culturally rooted. ChirPolly works seamlessly across web and mobile, offering structured courses from beginner (A1) to intermediate (B1) levels.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Color.lerp(Colors.grey.shade400, Colors.grey.shade800, progress),
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
                            color: Color.lerp(Colors.white, Colors.grey.shade900, progress),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '11 major languages • 33,000+ vocabulary words • A1 to B1 levels • Web & Mobile',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color.lerp(Colors.grey.shade400, Colors.grey.shade700, progress),
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
      },
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
              _buildFooterLink('Contact Us', '/contact'),
            ],
          ),
          const SizedBox(height: 32),

          // ── Social Share ─────────────────────────────────────────────
          _buildShareSection(),

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

  Widget _buildShareSection() {
    const shareText = 'Check out ChirPolly! https://chirpolly.com';
    const shareSubject = 'Learn languages with Polly!';

    return Column(
      children: [
        // Section title
        Text(
          'Share ChirPolly',
          style: TextStyle(
            color: Colors.white.withOpacity(0.9),
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 16),

        // Platform icon buttons
        Wrap(
          spacing: 16,
          runSpacing: 12,
          alignment: WrapAlignment.center,
          children: [
            _buildShareIconButton(
              iconWidget: const FaIcon(FontAwesomeIcons.whatsapp, color: Colors.white, size: 22),
              label: 'WhatsApp',
              color: const Color(0xFF25D366),
              onTap: () {
                launchUrl(
                  Uri.parse('https://wa.me/?text=${Uri.encodeComponent(shareText)}'),
                  webOnlyWindowName: '_blank',
                );
              },
            ),
            _buildShareIconButton(
              iconWidget: const Icon(Icons.email_rounded, color: Colors.white, size: 24),
              label: 'Email',
              color: const Color(0xFFEA4335),
              onTap: () {
                launchUrl(
                  Uri.parse(
                    'mailto:?subject=${Uri.encodeComponent(shareSubject)}&body=${Uri.encodeComponent(shareText)}',
                  ),
                );
              },
            ),
            _buildShareIconButton(
              iconWidget: const FaIcon(FontAwesomeIcons.linkedinIn, color: Colors.white, size: 22),
              label: 'LinkedIn',
              color: const Color(0xFF0A66C2),
              onTap: () {
                launchUrl(
                  Uri.parse('https://www.linkedin.com/sharing/share-offsite/?url=${Uri.encodeComponent('https://chirpolly.com')}'),
                  webOnlyWindowName: '_blank',
                );
              },
            ),
            _buildShareIconButton(
              iconWidget: const FaIcon(FontAwesomeIcons.pinterest, color: Colors.white, size: 22),
              label: 'Pinterest',
              color: const Color(0xFFE60023),
              onTap: () {
                launchUrl(
                  Uri.parse('https://pinterest.com/pin/create/button/?url=${Uri.encodeComponent('https://chirpolly.com')}&description=${Uri.encodeComponent(shareText)}'),
                  webOnlyWindowName: '_blank',
                );
              },
            ),
          ],
        ),

        const SizedBox(height: 20),

        // System / generic share button
        ElevatedButton.icon(
          onPressed: () async {
            try {
              await Share.share(shareText, subject: shareSubject);
            } catch (_) {
              // Fallback for browsers without Web Share API
              launchUrl(
                Uri.parse('mailto:?subject=${Uri.encodeComponent(shareSubject)}&body=${Uri.encodeComponent(shareText)}'),
              );
            }
          },
          icon: const Icon(Icons.share_rounded, size: 18),
          label: const Text(
            'Share',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6A4CBC),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
            shape: const StadiumBorder(),
            elevation: 0,
          ),
        ),
      ],
    );
  }

  Widget _buildShareIconButton({
    required Widget iconWidget,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Tooltip(
      message: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(50),
        child: Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.4),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(child: iconWidget),
        ),
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
              leading: Icon(Icons.psychology_rounded, color: Colors.grey.shade700),
              title: const Text('AI Tutor'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/ai-tutor');
              },
            ),
            ListTile(
              leading: Icon(Icons.payments, color: Colors.grey.shade700),
              title: const Text('Pricing'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/pricing');
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
