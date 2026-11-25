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
import '../widgets/polly_ai_companion_card.dart';
import '../../../auth/presentation/providers/auth_providers.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

// ─── Brand colours ────────────────────────────────────────────────────────
const _kPurple = Color(0xFF6366F1); // Royal Indigo (premium material 3 brand color)
const _kTeal   = Color(0xFF14B8A6); // Neon Turquoise / Teal
const _kCoral  = Color(0xFFF43F5E); // Sunset Warm Coral

class _HomePageState extends ConsumerState<HomePage> with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _languagesKey = GlobalKey();

  // ── Firestore Cached Query Stream ──────────────────────────────────────────
  late final Stream<QuerySnapshot> _languagesStream;

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

  // ── Gradient background animation ─────────────────────────────────────────
  late AnimationController _gradientController;
  late Animation<double>   _gradientShift;

  // ── Floating decorative elements ───────────────────────────────────────────
  late AnimationController _floatController1;
  late AnimationController _floatController2;
  late AnimationController _floatController3;
  late Animation<Offset> _floatOffset1;
  late Animation<Offset> _floatOffset2;
  late Animation<Offset> _floatOffset3;

  // ── Scroll-triggered animations ───────────────────────────────────────────
  // (Parallax hover removed — consistent behaviour on all screen sizes)

  @override
  void initState() {
    super.initState();

    // Cache the Firestore collection stream to prevent inline re-fetching on build
    _languagesStream = FirebaseFirestore.instance
        .collection('languages')
        .where('enabled', isEqualTo: true)
        .snapshots();

    // ── Staggered headline with spring physics ────────────────────────────
    _staggerController = AnimationController(
      duration: const Duration(milliseconds: 1600),
      vsync: this,
    );
    // Opacity should use a smooth ease curve, not elastic, to prevent clamping issues
    _line1Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.1, 0.5, curve: Curves.easeOut)));
    _line1Slide = Tween<Offset>(begin: const Offset(-0.2, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.1, 0.7, curve: Curves.elasticOut)));
          
    _line2Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.3, 0.7, curve: Curves.easeOut)));
    _line2Slide = Tween<Offset>(begin: const Offset(-0.2, 0), end: Offset.zero).animate(
      CurvedAnimation(parent: _staggerController,
          curve: const Interval(0.3, 0.9, curve: Curves.elasticOut)));
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

    // ── Gradient background animation ───────────────────────────────────────
    _gradientController = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat();
    _gradientShift = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _gradientController, curve: Curves.linear),
    );

    // ── Floating decorative elements ─────────────────────────────────────────
    _floatController1 = AnimationController(
      duration: const Duration(seconds: 6),
      vsync: this,
    )..repeat(reverse: true);
    _floatOffset1 = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(0, -20),
    ).animate(CurvedAnimation(parent: _floatController1, curve: Curves.easeInOut));

    _floatController2 = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat(reverse: true);
    _floatOffset2 = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(0, -25),
    ).animate(CurvedAnimation(parent: _floatController2, curve: Curves.easeInOut));

    _floatController3 = AnimationController(
      duration: const Duration(seconds: 7),
      vsync: this,
    )..repeat(reverse: true);
    _floatOffset3 = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(0, -15),
    ).animate(CurvedAnimation(parent: _floatController3, curve: Curves.easeInOut));
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Precache assets to prevent any flash or flickers during animations
    precacheImage(const AssetImage('assets/images/parrot_transparent.png'), context);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _staggerController.dispose();
    _shimmerController.dispose();
    _glowController.dispose();
    _gradientController.dispose();
    _floatController1.dispose();
    _floatController2.dispose();
    _floatController3.dispose();
    super.dispose();
  }

  double _getScrollProgress(double startOffset, double endOffset) {
    if (!_scrollController.hasClients) return 0.0;
    final offset = _scrollController.offset;
    return ((offset - startOffset) / (endOffset - startOffset)).clamp(0.0, 1.0);
  }


  Widget _buildFloatingShape({
    required double size,
    required Color color,
    required Animation<Offset> animation,
    required Offset position,
    double opacity = 0.15,
  }) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Positioned(
          left: position.dx,
          top: position.dy + animation.value.dy,
          child: RepaintBoundary(
            child: Opacity(
              opacity: opacity,
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      color.withValues(alpha: 0.6),
                      color.withValues(alpha: 0.25),
                      color.withValues(alpha: 0.0),
                    ],
                    stops: const [0.0, 0.5, 1.0],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNavButton(String text, VoidCallback onPressed) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Colors.transparent,
        ),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(8),
          splashColor: _kPurple.withValues(alpha: 0.1),
          hoverColor: _kPurple.withValues(alpha: 0.05),
          child: Text(
            text,
            style: TextStyle(
              color: Colors.grey.shade800,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
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
        backgroundColor: const Color(0xFFF8FAFC),
        extendBodyBehindAppBar: true,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(96),
          child: LayoutBuilder(
            builder: (context, constraints) {
              // Check if we're on mobile (width < 600px)
              final isMobile = MediaQuery.of(context).size.width < 600;
              
              return AppBar(
                elevation: 0,
                scrolledUnderElevation: 0,
                backgroundColor: Colors.transparent,
                surfaceTintColor: Colors.transparent,
                toolbarHeight: 96,
                centerTitle: false,
                automaticallyImplyLeading: false,
                flexibleSpace: ClipRect(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.80),
                        border: Border(
                          bottom: BorderSide(
                            color: const Color(0xFFE2E8F0).withValues(alpha: 0.9),
                            width: 1,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
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
                        _buildNavButton('Languages', () => Navigator.pushNamed(context, '/languages')),
                        const SizedBox(width: 16),
                        _buildNavButton('Pricing', () => Navigator.pushNamed(context, '/pricing')),
                        const SizedBox(width: 16),
                        _buildNavButton('About', () => Navigator.pushNamed(context, '/about')),
                        const SizedBox(width: 16),
                        // AI Tutor button
                        _buildNavButton('AI Tutor', () => Navigator.pushNamed(context, '/ai-tutor')),
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
                              // User is not logged in - show high-contrast visible login button
                              return OutlinedButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/login');
                                },
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: _kPurple,
                                  backgroundColor: _kPurple.withValues(alpha: 0.06),
                                  side: BorderSide(
                                    color: _kPurple.withValues(alpha: 0.45),
                                    width: 1.5,
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 20,
                                    vertical: 10,
                                  ),
                                  shape: const StadiumBorder(),
                                ),
                                child: const Text(
                                  'Login',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
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
        body: SingleChildScrollView(
          controller: _scrollController,
          child: Column(
            children: [
              _buildHeroSection(),
              _buildFeaturesSection(),
              _buildLanguagesSection(),
              _buildLiarGameSection(),
              _buildAboutSection(),
              _buildCTASection(context),
              _buildFooter(),
            ],
          ),
        ),
      ),
    );
  }



  Widget _buildHeroSection() {
    return AnimatedBuilder(
      animation: _gradientController,
      builder: (context, child) {
        final t = _gradientShift.value;
        return Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              stops: const [0.0, 0.3, 0.6, 1.0],
              colors: [
                Color.lerp(const Color(0xFFEEF2FF), const Color(0xFFE0E7FF), t)!, // Indigo Mesh
                Color.lerp(const Color(0xFFFAF5FF), const Color(0xFFF3E8FF), t)!, // Violet Mesh
                Color.lerp(const Color(0xFFFDF2F8), const Color(0xFFFCE7F3), t)!, // Rose Mesh
                Color.lerp(const Color(0xFFF0FDFA), const Color(0xFFCCFBF1), t)!, // Teal Mesh
              ],
            ),
          ),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final bool isDesktop = constraints.maxWidth > 900;
              return Stack(
                children: [
                  // Beautiful, organic glowing glassmorphic mesh orbs floating in background
                  if (constraints.maxWidth > 600) ...[
                    _buildFloatingShape(
                      size: 320,
                      color: _kPurple,
                      animation: _floatOffset1,
                      position: const Offset(-60, 40),
                      opacity: 0.28,
                    ),
                    _buildFloatingShape(
                      size: 260,
                      color: _kTeal,
                      animation: _floatOffset2,
                      position: Offset(constraints.maxWidth - 200, 60),
                      opacity: 0.25,
                    ),
                    _buildFloatingShape(
                      size: 220,
                      color: _kCoral,
                      animation: _floatOffset3,
                      position: const Offset(40, 240),
                      opacity: 0.22,
                    ),
                  ],
                  Column(
                    children: [
                      SizedBox(height: isDesktop ? 112 : 104),
                      Builder(builder: (context) {
                 // Build left (text/CTA) section
                 final Widget leftSection = Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
                        child: Column(
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

                              // ── High-Fidelity Custom Animated CTA Button ─────────
                              _CTAButton(
                                onPressed: () => Navigator.pushNamed(context, '/languages'),
                                glowBlur: _glowBlur,
                              ),
                              if (!isDesktop) const SizedBox(height: 16),
                            ],
                          ),
                        );

                // Build right (Language Matrix + Polly AI Companion) section
                final Widget rightSection = Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _LanguageMatrix(isDesktop: isDesktop),
                    Transform.translate(
                      offset: Offset(0, isDesktop ? -16 : 0),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: PollyAICompanionCard(
                          onTap: () => Navigator.pushNamed(context, '/ai-tutor'),
                        ),
                      ),
                    ),
                  ],
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
                  const SizedBox(height: 56),
                ],
              ),
              // Smooth gradient fade into the #F8FAFC body canvas
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: 72,
                child: IgnorePointer(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          const Color(0xFFF8FAFC).withValues(alpha: 0.0),
                          const Color(0xFFF8FAFC),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  },
  );
}




  Widget _buildLanguagesSkeletonLoader() {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
      ),
      padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 24),
      child: Column(
        children: [
          // Skeleton Title
          Container(
            width: 300,
            height: 48,
            decoration: BoxDecoration(
              color: const Color(0xFFE2E8F0).withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(24),
            ),
          ),
          const SizedBox(height: 16),
          // Skeleton Subtitle
          Container(
            width: 450,
            height: 20,
            decoration: BoxDecoration(
              color: const Color(0xFFE2E8F0).withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          const SizedBox(height: 60),

          // Skeleton Grid of Cards
          Container(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final width = constraints.maxWidth;
                final crossAxisCount = width < 600 ? 1 : (width < 900 ? 2 : 3);
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
                  itemCount: 3,
                  itemBuilder: (context, index) {
                    return AnimatedBuilder(
                      animation: _shimmerController,
                      builder: (context, child) {
                        final val = _shimmerController.value;
                        return Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Colors.white,
                                Color.lerp(Colors.white, const Color(0xFFF1F5F9), val)!,
                                Colors.white,
                              ],
                              stops: const [0.0, 0.5, 1.0],
                            ),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFFE2E8F0),
                              width: 1,
                            ),
                          ),
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 64,
                                height: 64,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE2E8F0).withValues(alpha: 0.7),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Container(
                                width: 120,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE2E8F0).withValues(alpha: 0.7),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                width: 80,
                                height: 16,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFE2E8F0).withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguagesSection() {
    return StreamBuilder<QuerySnapshot>(
      stream: _languagesStream,
      builder: (context, snapshot) {
        final languages = snapshot.data?.docs ?? [];
        if (languages.isEmpty && snapshot.connectionState == ConnectionState.waiting) {
          return _buildLanguagesSkeletonLoader();
        }
        if (languages.isEmpty) {
          return const SizedBox.shrink();
        }

        return Container(
          key: _languagesKey,
          width: double.infinity,
          decoration: const BoxDecoration(
            color: Color(0xFFF8FAFC),
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
                      color: const Color(0xFF6A4CBC).withValues(alpha: 0.2),
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
              const Text(
                'Explore our growing collection of comprehensive language courses.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  color: Color(0xFF475569),
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
                        
                        return AnimatedBuilder(
                          animation: _scrollController,
                          builder: (context, child) {
                            final progress = _getScrollProgress(600, 900);
                            final cardProgress = ((progress - (index * 0.15)) / 0.3).clamp(0.0, 1.0);
                            final opacity = Curves.easeOut.transform(cardProgress);
                            final slide = Offset(0, 30 * (1 - cardProgress));
                            return Opacity(
                              opacity: opacity,
                              child: Transform.translate(
                                offset: slide,
                                child: child,
                              ),
                            );
                          },
                          child: LanguageCard(
                            languageId: languageDoc.id,
                            flag: languageData['flag'] ?? '🌍',
                            name: languageData['name'] ?? 'Unknown',
                            nativeScript: languageData['nativeScript'] ?? languageData['nativeName'] ?? '',
                            color: LanguageCard.getLanguageColor(languageData['name'] ?? 'Unknown'),
                          ),
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
                        color: const Color(0xFF6A4CBC).withValues(alpha: 0.2),
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
                          color: const Color(0xFF6A4CBC).withValues(alpha: 0.5),
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
      },
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
    const features = [
      (
        icon: Icons.sports_esports_rounded,
        accent: _kCoral,
        title: 'Unique Liar Game Challenge',
        description: 'Test your learning with our signature game-based assessment',
      ),
      (
        icon: Icons.public_rounded,
        accent: _kTeal,
        title: '11 Languages',
        description: 'English, French, Spanish, Korean, Japanese, German, Sanskrit, Hindi, Portuguese, Chinese & Italian',
      ),
      (
        icon: Icons.menu_book_rounded,
        accent: _kPurple,
        title: 'Structured A1 to B1 Courses',
        description: 'Progressive learning from beginner to intermediate',
      ),
      (
        icon: Icons.forum_rounded,
        accent: _kTeal,
        title: '33,000 Vocabulary Words',
        description: '3,000 words per language for comprehensive mastery',
      ),
      (
        icon: Icons.auto_awesome_rounded,
        accent: _kPurple,
        title: 'Japanese Kanji Mastery',
        description: 'Premium Edition: Complete Jōyō Kanji curriculum with mnemonics, stroke counts, and integrated mastery tracking.',
      ),
      (
        icon: Icons.devices_rounded,
        accent: _kCoral,
        title: 'Web & Mobile',
        description: 'Seamless experience across all your devices',
      ),
    ];

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
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
              const SizedBox(height: 12),
              const Text(
                'Crafted for real retention, cultural depth, and effortless daily practice.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Color(0xFF475569),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 48),
              LayoutBuilder(
                builder: (context, constraints) {
                  final width = constraints.maxWidth;
                  final crossAxisCount = width > 960 ? 3 : (width > 640 ? 2 : 1);

                  if (crossAxisCount == 1) {
                    return Column(
                      children: features
                          .map(
                            (f) => Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: _buildFeatureCard(
                                icon: f.icon,
                                accentColor: f.accent,
                                title: f.title,
                                description: f.description,
                              ),
                            ),
                          )
                          .toList(),
                    );
                  }

                  final List<Widget> rows = [];
                  for (var i = 0; i < features.length; i += crossAxisCount) {
                    final rowItems = features.skip(i).take(crossAxisCount).toList();
                    rows.add(
                      Padding(
                        padding: EdgeInsets.only(
                          bottom: i + crossAxisCount < features.length ? 24 : 0,
                        ),
                        child: IntrinsicHeight(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              for (var j = 0; j < rowItems.length; j++) ...[
                                if (j > 0) const SizedBox(width: 24),
                                Expanded(
                                  child: _buildFeatureCard(
                                    icon: rowItems[j].icon,
                                    accentColor: rowItems[j].accent,
                                    title: rowItems[j].title,
                                    description: rowItems[j].description,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    );
                  }
                  return Column(children: rows);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required Color accentColor,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.04),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(
          color: const Color(0xFFE2E8F0),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: accentColor.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(
                color: accentColor.withValues(alpha: 0.22),
                width: 1,
              ),
            ),
            child: Icon(
              icon,
              color: accentColor,
              size: 26,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14.5,
              color: Color(0xFF475569),
              height: 1.55,
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
        color: Color(0xFFF8FAFC),
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: Container(
            padding: const EdgeInsets.all(36),
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
                  color: const Color(0xFF6A4CBC).withValues(alpha: 0.22),
                  blurRadius: 30,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.sports_esports_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 14),
                    _buildDynamicGradientText(
                      'The Liar Game',
                      startOffset: 1200,
                      endOffset: 1800,
                      fontSize: 32,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'Our innovative learning verification system. Instead of passive multiple choice, you actively hunt for the "liar" - the one incorrect translation hidden among correct ones. This neurological approach strengthens pattern recognition and genuine language understanding.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withValues(alpha: 0.95),
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
      decoration: const BoxDecoration(
        color: Color(0xFFF8FAFC),
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
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF8FAFC),
            Color(0xFFEEF2FF),
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
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 768;
        
        return Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF0D0E2B), // Deepest Midnight
                const Color(0xFF15163D), // Deep Midnight Blue
                const Color(0xFF2E3192), // Logo Blue
                const Color(0xFF4A348F), // Indigo transition
                const Color(0xFF6648B1), // Logo Purple
              ],
              stops: const [0.0, 0.2, 0.5, 0.8, 1.0],
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, -10),
              ),
            ],
          ),
          child: Column(
            children: [
              // Top decorative wave
              Container(
                height: 4,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      _kTeal.withOpacity(0.6),
                      _kPurple.withOpacity(0.6),
                      Colors.pink.withOpacity(0.6),
                    ],
                  ),
                ),
              ),
              
              Padding(
                padding: EdgeInsets.symmetric(
                  vertical: isMobile ? 32 : 48,
                  horizontal: isMobile ? 24 : 48,
                ),
                child: isMobile ? _buildMobileFooterLayout() : _buildDesktopFooterLayout(),
              ),
              
              // Bottom copyright section
              Container(
                padding: EdgeInsets.symmetric(
                  vertical: isMobile ? 16 : 20,
                  horizontal: isMobile ? 24 : 48,
                ),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: Colors.white.withOpacity(0.1),
                      width: 1,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Text(
                        '© 2026 ChirPolly. All rights reserved.',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.5),
                          fontSize: isMobile ? 10 : 11,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                    if (!isMobile) ...[
                      Row(
                        children: [
                          _buildBottomLink('Privacy', '/privacy'),
                          _buildBottomLink('Terms', '/terms'),
                          _buildBottomLink('Cookies', '/cookies'),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDesktopFooterLayout() {
    return Column(
      children: [
        // Main content grid
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Brand column
            Expanded(
              flex: 2,
              child: _buildBrandColumn(),
            ),
            
            const SizedBox(width: 48),
            
            // Quick Links column
            Expanded(
              flex: 1,
              child: _buildLinksColumn(),
            ),
            
            const SizedBox(width: 48),
            
            // Legal column
            Expanded(
              flex: 1,
              child: _buildLegalColumn(),
            ),
            
            const SizedBox(width: 48),
            
            // Social column
            Expanded(
              flex: 1,
              child: _buildSocialColumn(),
            ),
          ],
        ),
        
        const SizedBox(height: 40),
        
        // Bottom share section
        _buildEnhancedShareSection(),
      ],
    );
  }

  Widget _buildMobileFooterLayout() {
    return Column(
      children: [
        _buildBrandColumn(),
        const SizedBox(height: 32),
        _buildLinksColumn(),
        const SizedBox(height: 32),
        _buildLegalColumn(),
        const SizedBox(height: 32),
        _buildSocialColumn(),
        const SizedBox(height: 32),
        _buildEnhancedShareSection(),
      ],
    );
  }

  Widget _buildBrandColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Logo and brand name
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [_kPurple, _kTeal],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Image.asset(
                'assets/images/parrot_transparent.png',
                height: 32,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.pets,
                    color: Colors.white,
                    size: 24,
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'ChirPolly',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 16),
        
        Text(
          'Learn languages the fun way with Polly, your AI-powered language companion.',
          style: TextStyle(
            color: Colors.white.withOpacity(0.5),
            fontSize: 13,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildLinksColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Links',
          style: TextStyle(
            color: Colors.white.withOpacity(0.9),
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 16),
        _buildFooterLink('All Languages', '/languages'),
        const SizedBox(height: 8),
        _buildFooterLink('Pricing Plans', '/pricing'),
        const SizedBox(height: 8),
        _buildFooterLink('AI Tutor', '/ai-tutor'),
        const SizedBox(height: 8),
        _buildFooterLink('About Us', '/about'),
      ],
    );
  }

  Widget _buildLegalColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Legal',
          style: TextStyle(
            color: Colors.white.withOpacity(0.9),
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 16),
        _buildFooterLink('Terms of Service', '/terms'),
        const SizedBox(height: 8),
        _buildFooterLink('Privacy Policy', '/privacy'),
        const SizedBox(height: 8),
        _buildFooterLink('Refund Policy', '/refund'),
        const SizedBox(height: 8),
        _buildFooterLink('Contact Us', '/contact'),
      ],
    );
  }

  Widget _buildSocialColumn() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Follow Us',
          style: TextStyle(
            color: Colors.white.withOpacity(0.9),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            _buildSocialIcon(
              icon: FontAwesomeIcons.linkedinIn,
              color: const Color(0xFF0A66C2),
              url: 'https://www.linkedin.com/company/chirpolly/',
            ),
            const SizedBox(width: 16),
            _buildSocialIcon(
              icon: FontAwesomeIcons.pinterest,
              color: const Color(0xFFE60023),
              url: 'https://pinterest.com/chirpolly',
            ),
            const SizedBox(width: 16),
            _buildSocialIcon(
              icon: FontAwesomeIcons.facebook,
              color: const Color(0xFF1877F2),
              url: 'https://facebook.com/chirpolly',
            ),
            const SizedBox(width: 16),
            _buildSocialIcon(
              icon: FontAwesomeIcons.instagram,
              color: Colors.white,
              url: 'https://www.instagram.com/chirpolly_app',
              gradient: const LinearGradient(
                colors: [
                  Color(0xFFF09433),
                  Color(0xFFE6683C),
                  Color(0xFFDC2743),
                  Color(0xFFCC2366),
                  Color(0xFFBC1888),
                ],
                begin: Alignment.bottomLeft,
                end: Alignment.topRight,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSocialIcon({
    required FaIconData icon,
    required Color color,
    required String url,
    Gradient? gradient,
  }) {
    return Tooltip(
      message: url.split('//').last.split('/').first,
      child: InkWell(
        onTap: () => launchUrl(
          Uri.parse(url),
          mode: LaunchMode.externalApplication,
          webOnlyWindowName: '_blank',
        ),
        borderRadius: BorderRadius.circular(4),
        child: gradient != null
            ? ShaderMask(
                shaderCallback: (bounds) => gradient.createShader(bounds),
                child: FaIcon(
                  icon,
                  color: Colors.white,
                  size: 24,
                ),
              )
            : FaIcon(
                icon,
                color: color,
                size: 24,
              ),
      ),
    );
  }

  Widget _buildBottomLink(String title, String route) {
    return Padding(
      padding: const EdgeInsets.only(left: 16),
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, route),
        borderRadius: BorderRadius.circular(4),
        child: Text(
          title,
          style: TextStyle(
            color: Colors.white.withOpacity(0.6),
            fontSize: 11,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
    );
  }

  Widget _buildEnhancedShareSection() {
    const shareText = 'Check out ChirPolly! https://chirpolly.com';
    const shareSubject = 'Learn languages with Polly!';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.share_rounded,
                color: _kTeal,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'Share ChirPolly',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 20),
          
          // Compact centered row of share buttons
          Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              _buildModernShareButton(
                icon: FontAwesomeIcons.whatsapp,
                label: 'WhatsApp',
                color: const Color(0xFF25D366),
                onTap: () => launchUrl(
                  Uri.parse('https://wa.me/?text=${Uri.encodeComponent(shareText)}'),
                  webOnlyWindowName: '_blank',
                ),
              ),
              _buildModernShareButton(
                icon: Icons.email_rounded,
                label: 'Email',
                color: const Color(0xFFEA4335),
                onTap: () => launchUrl(
                  Uri.parse(
                    'mailto:?subject=${Uri.encodeComponent(shareSubject)}&body=${Uri.encodeComponent(shareText)}',
                  ),
                ),
              ),
              _buildModernShareButton(
                icon: Icons.share_rounded,
                label: 'More Options',
                color: _kPurple,
                onTap: () async {
                  try {
                    await Share.share(shareText, subject: shareSubject);
                  } catch (_) {
                    launchUrl(
                      Uri.parse('mailto:?subject=${Uri.encodeComponent(shareSubject)}&body=${Uri.encodeComponent(shareText)}'),
                    );
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildModernShareButton({
    required dynamic icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          border: Border.all(
            color: color.withOpacity(0.3),
            width: 1,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon is FaIconData)
              FaIcon(
                icon,
                color: color,
                size: 16,
              )
            else
              Icon(
                icon,
                color: color,
                size: 16,
              ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooterLink(String title, String route) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, route),
        borderRadius: BorderRadius.circular(6),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Text(
            title,
            style: TextStyle(
              color: Colors.white.withOpacity(0.7),
              fontSize: 14,
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
      ),
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

class _CTAButton extends StatefulWidget {
  final VoidCallback onPressed;
  final Animation<double> glowBlur;

  const _CTAButton({
    required this.onPressed,
    required this.glowBlur,
  });

  @override
  _CTAButtonState createState() => _CTAButtonState();
}

class _CTAButtonState extends State<_CTAButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    const double borderThickness = 2.0;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: AnimatedScale(
        scale: _isHovered ? 1.05 : 1.0,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutBack,
        child: AnimatedBuilder(
          animation: widget.glowBlur,
          builder: (context, child) {
            final blurVal = widget.glowBlur.value;
            return Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(50),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6366F1).withValues(alpha: _isHovered ? 0.6 : 0.4),
                    blurRadius: blurVal * 1.2,
                    spreadRadius: _isHovered ? 4 : 2,
                  ),
                  BoxShadow(
                    color: const Color(0xFFF43F5E).withValues(alpha: _isHovered ? 0.4 : 0.25),
                    blurRadius: blurVal * 0.6,
                    spreadRadius: _isHovered ? 2 : 0,
                  ),
                ],
              ),
              child: child,
            );
          },
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFFF43F5E), // Sunset Pink/Coral
                  Color(0xFF6366F1), // Royal Indigo
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(50),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.5),
                width: borderThickness,
              ),
            ),
            child: ElevatedButton(
              onPressed: widget.onPressed,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 24),
                shape: const StadiumBorder(),
                elevation: 0,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Start Learning Now',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(width: 8),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    transform: Matrix4.translationValues(_isHovered ? 4.0 : 0.0, 0.0, 0.0),
                    child: const Icon(
                      Icons.arrow_forward_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Floating Language Matrix Components ─────────────────────────────────────

class _FloatingLanguageChip extends StatefulWidget {
  final String label;
  final Alignment alignment;
  final Color textColor;
  final Duration animationDuration;
  final double animationOffset;

  const _FloatingLanguageChip({
    required this.label,
    required this.alignment,
    required this.textColor,
    required this.animationDuration,
    required this.animationOffset,
  });

  @override
  State<_FloatingLanguageChip> createState() => _FloatingLanguageChipState();
}

class _FloatingLanguageChipState extends State<_FloatingLanguageChip> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.animationDuration,
    );
    
    // Smooth sine-wave translation of ±7 pixels
    _animation = Tween<double>(begin: -7.0, end: 7.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );

    // Stagger the start time/phase using the offset
    _controller.forward(from: widget.animationOffset);
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chip = MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: AnimatedScale(
        scale: _isHovered ? 1.05 : 1.0,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutCubic,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            // Crisp, semi-transparent background (no BackdropFilter)
            color: Colors.white.withValues(alpha: _isHovered ? 0.95 : 0.85),
            // Sharp border
            border: Border.all(
              color: widget.textColor.withValues(alpha: _isHovered ? 0.9 : 0.4),
              width: 1.5,
            ),
            boxShadow: [
              // Soft, localized glow when hovered
              BoxShadow(
                color: _isHovered 
                    ? widget.textColor.withValues(alpha: 0.35)
                    : Colors.black.withValues(alpha: 0.03),
                blurRadius: _isHovered ? 18.0 : 6.0,
                spreadRadius: _isHovered ? 2.0 : 0.0,
                offset: _isHovered ? Offset.zero : const Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Custom localized color dot matching the language tag
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.textColor,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                widget.label,
                style: TextStyle(
                  color: Colors.grey.shade900,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );

    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: chip,
    );
  }
}

class _LanguageMatrix extends StatelessWidget {
  final bool isDesktop;

  const _LanguageMatrix({required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    // 6 languages with Kanji and Devanagari support as mandated
    final List<_LanguageConfig> languages = [
      _LanguageConfig(
        label: 'Español',
        alignment: const Alignment(-0.8, -0.6),
        textColor: const Color(0xFFEF4444), // Coral Red
        duration: const Duration(seconds: 3),
        offset: 0.0,
      ),
      _LanguageConfig(
        label: 'Français',
        alignment: const Alignment(0.7, -0.4),
        textColor: const Color(0xFF3B82F6), // Premium Blue
        duration: const Duration(milliseconds: 3200),
        offset: 0.2,
      ),
      _LanguageConfig(
        label: 'Deutsch',
        alignment: const Alignment(-0.25, -0.1),
        textColor: const Color(0xFFF59E0B), // Warm Amber
        duration: const Duration(milliseconds: 2800),
        offset: 0.45,
      ),
      _LanguageConfig(
        label: '日本語', // Kanji support
        alignment: const Alignment(0.75, 0.2),
        textColor: const Color(0xFFEC4899), // Sakura Pink
        duration: const Duration(milliseconds: 3500),
        offset: 0.6,
      ),
      _LanguageConfig(
        label: 'हिन्दी', // Devanagari support
        alignment: const Alignment(-0.7, 0.5),
        textColor: const Color(0xFF10B981), // Teal/Green
        duration: const Duration(milliseconds: 3000),
        offset: 0.75,
      ),
      _LanguageConfig(
        label: 'Italiano',
        alignment: const Alignment(0.25, 0.8),
        textColor: const Color(0xFF8B5CF6), // Royal Iris/Purple
        duration: const Duration(milliseconds: 3300),
        offset: 0.35,
      ),
    ];

    if (isDesktop) {
      return RepaintBoundary(
        child: SizedBox(
          height: 360,
          child: Stack(
            children: languages.map((config) {
              return Align(
                alignment: config.alignment,
                child: _FloatingLanguageChip(
                  label: config.label,
                  alignment: config.alignment,
                  textColor: config.textColor,
                  animationDuration: config.duration,
                  animationOffset: config.offset,
                ),
              );
            }).toList(),
          ),
        ),
      );
    } else {
      // Mobile & Tablet view: Wrap layout to avoid stack overflow/clipping
      return RepaintBoundary(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Wrap(
            spacing: 12,
            runSpacing: 16,
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: languages.map((config) {
              return _FloatingLanguageChip(
                label: config.label,
                alignment: config.alignment,
                textColor: config.textColor,
                animationDuration: config.duration,
                animationOffset: config.offset,
              );
            }).toList(),
          ),
        ),
      );
    }
  }
}

class _LanguageConfig {
  final String label;
  final Alignment alignment;
  final Color textColor;
  final Duration duration;
  final double offset;

  const _LanguageConfig({
    required this.label,
    required this.alignment,
    required this.textColor,
    required this.duration,
    required this.offset,
  });
}
