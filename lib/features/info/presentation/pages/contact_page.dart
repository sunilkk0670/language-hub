import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactPage extends StatefulWidget {
  const ContactPage({super.key});

  @override
  State<ContactPage> createState() => _ContactPageState();
}

class _ContactPageState extends State<ContactPage>
    with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final FocusNode _focusNode = FocusNode();

  // Entrance animation for content cards
  late AnimationController _entranceController;
  late Animation<double> _card1Opacity;
  late Animation<Offset> _card1Slide;
  late Animation<double> _card2Opacity;
  late Animation<Offset> _card2Slide;
  late Animation<double> _card3Opacity;
  late Animation<Offset> _card3Slide;

  // Subtle continuous glow on the email icon
  late AnimationController _glowController;
  late Animation<double> _glowBlur;

  // Email hover state
  bool _emailHovered = false;

  static const _kPurple = Color(0xFF6A4CBC);
  static const _kBlue = Color(0xFF2E3192);
  static const _kTeal = Color(0xFF4ECDC4);

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });

    // Card entrance stagger
    _entranceController = AnimationController(
      duration: const Duration(milliseconds: 1400),
      vsync: this,
    );

    _card1Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.0, 0.45, curve: Curves.easeOut)));
    _card1Slide =
        Tween<Offset>(begin: const Offset(0, 0.18), end: Offset.zero).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.0, 0.45, curve: Curves.easeOut)));

    _card2Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.28, 0.72, curve: Curves.easeOut)));
    _card2Slide =
        Tween<Offset>(begin: const Offset(0, 0.18), end: Offset.zero).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.28, 0.72, curve: Curves.easeOut)));

    _card3Opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.56, 1.0, curve: Curves.easeOut)));
    _card3Slide =
        Tween<Offset>(begin: const Offset(0, 0.18), end: Offset.zero).animate(
      CurvedAnimation(
          parent: _entranceController,
          curve: const Interval(0.56, 1.0, curve: Curves.easeOut)));

    _entranceController.forward();

    // Email icon glow
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 2200),
      vsync: this,
    )..repeat(reverse: true);
    _glowBlur = Tween<double>(begin: 6, end: 22)
        .animate(CurvedAnimation(parent: _glowController, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _focusNode.dispose();
    _entranceController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  Future<void> _launchEmail() async {
    final uri = Uri(
      scheme: 'mailto',
      path: 'info@chirpolly.com',
      query: 'subject=ChirPolly%20Support%20Enquiry',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _copyEmail() async {
    await Clipboard.setData(const ClipboardData(text: 'info@chirpolly.com'));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Email copied to clipboard!',
            style: GoogleFonts.inter(color: Colors.white),
          ),
          backgroundColor: _kPurple,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Focus(
        focusNode: _focusNode,
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
            }
          }
          return KeyEventResult.ignored;
        },
        child: CustomScrollView(
          controller: _scrollController,
          slivers: [
            _buildSliverAppBar(context),
            SliverToBoxAdapter(child: _buildHeroBlurb()),
            SliverToBoxAdapter(child: _buildContent()),
            SliverToBoxAdapter(child: _buildFooter(context)),
          ],
        ),
      ),
    );
  }

  // ────────────────────────────────────────────────────────────
  //  App bar
  // ────────────────────────────────────────────────────────────

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 220.0,
      floating: false,
      pinned: true,
      elevation: 0,
      backgroundColor: _kPurple,
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          'Contact Us',
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            color: Colors.white,
            fontSize: 24,
          ),
        ),
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF0D0E2B),
                Color(0xFF2E3192),
                Color(0xFF6A4CBC),
              ],
            ),
          ),
          child: Stack(
            children: [
              // Parrot watermark (top-right)
              Positioned(
                right: -20,
                bottom: -20,
                child: Opacity(
                  opacity: 0.15,
                  child: Image.asset(
                    'assets/images/parrot_transparent.png',
                    height: 200,
                    errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                  ),
                ),
              ),
              // Subtle dot / bubble decoration (top-left)
              Positioned(
                left: -40,
                top: -40,
                child: Opacity(
                  opacity: 0.08,
                  child: Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _kTeal,
                    ),
                  ),
                ),
              ),
              // Headline overlay
              Align(
                alignment: Alignment.bottomLeft,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 72),
                  child: Text(
                    'We\'re here to help 🦜',
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      color: Colors.white.withValues(alpha: 0.75),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
        onPressed: () => Navigator.of(context).pop(),
      ),
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Short hero blurb below the app bar
  // ────────────────────────────────────────────────────────────

  Widget _buildHeroBlurb() {
    return FadeTransition(
      opacity: _card1Opacity,
      child: SlideTransition(
        position: _card1Slide,
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                const Color(0xFFF3E5F5).withValues(alpha: 0.45),
                Colors.white,
              ],
            ),
          ),
          padding: const EdgeInsets.fromLTRB(24, 40, 24, 0),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 720),
              child: Column(
                children: [
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [_kBlue, _kPurple],
                    ).createShader(bounds),
                    child: Text(
                      'Get in touch with our support team',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white, // masked
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Have a question about your account, a technical issue, or need help accessing curriculum? '
                    'We\'re happy to help — just send us an email and we\'ll get back to you as quickly as we can.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      height: 1.65,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Main content area
  // ────────────────────────────────────────────────────────────

  Widget _buildContent() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: Column(
            children: [
              // ── Email card ────────────────────────────────────
              FadeTransition(
                opacity: _card2Opacity,
                child: SlideTransition(
                  position: _card2Slide,
                  child: _buildEmailCard(),
                ),
              ),
              const SizedBox(height: 24),
              // ── Response time card ────────────────────────────
              FadeTransition(
                opacity: _card3Opacity,
                child: SlideTransition(
                  position: _card3Slide,
                  child: _buildInfoCard(
                    icon: Icons.schedule_rounded,
                    iconColor: _kTeal,
                    title: 'Response Time',
                    body:
                        'We aim to respond to all enquiries within 24–48 hours, Monday to Friday. '
                        'While we do our best to reply sooner, please allow up to two business days during busy periods.',
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // ── What to include card ──────────────────────────
              FadeTransition(
                opacity: _card3Opacity,
                child: SlideTransition(
                  position: _card3Slide,
                  child: _buildTipsCard(),
                ),
              ),
              const SizedBox(height: 60),
            ],
          ),
        ),
      ),
    );
  }

  // ── Email card with glow + hover + copy button ─────────────

  Widget _buildEmailCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF0D0E2B),
            Color(0xFF2E3192),
            Color(0xFF6A4CBC),
          ],
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: _kPurple.withValues(alpha: 0.35),
            blurRadius: 30,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Glowing mail icon
              AnimatedBuilder(
                animation: _glowBlur,
                builder: (context, child) => Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withValues(alpha: 0.12),
                    boxShadow: [
                      BoxShadow(
                        color: _kTeal.withValues(alpha: 0.6),
                        blurRadius: _glowBlur.value,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.mail_outline_rounded,
                    color: Colors.white,
                    size: 28,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Text(
                'Email Support',
                style: GoogleFonts.outfit(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Glassmorphism email pill
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
              child: MouseRegion(
                onEnter: (_) => setState(() => _emailHovered = true),
                onExit: (_) => setState(() => _emailHovered = false),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 16),
                  decoration: BoxDecoration(
                    color: Colors.white
                        .withValues(alpha: _emailHovered ? 0.22 : 0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Colors.white.withValues(
                          alpha: _emailHovered ? 0.5 : 0.25),
                      width: 1.5,
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: _launchEmail,
                          child: Text(
                            'info@chirpolly.com',
                            style: GoogleFonts.inter(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: 0.3,
                              decoration: _emailHovered
                                  ? TextDecoration.underline
                                  : TextDecoration.none,
                              decorationColor: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      // Copy button
                      Tooltip(
                        message: 'Copy email address',
                        child: InkWell(
                          onTap: _copyEmail,
                          borderRadius: BorderRadius.circular(8),
                          child: Padding(
                            padding: const EdgeInsets.all(6),
                            child: Icon(
                              Icons.copy_rounded,
                              color: Colors.white.withValues(alpha: 0.7),
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          // "Open email client" CTA
          ElevatedButton.icon(
            onPressed: _launchEmail,
            icon: const Icon(Icons.open_in_new_rounded, size: 18),
            label: Text(
              'Open Email Client',
              style: GoogleFonts.outfit(
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: _kPurple,
              padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }

  // ── Generic info card ──────────────────────────────────────

  Widget _buildInfoCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String body,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(color: Colors.grey.shade100, width: 1.5),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 26),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF2E3192),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  body,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    height: 1.65,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Tips card ──────────────────────────────────────────────

  Widget _buildTipsCard() {
    final tips = [
      ('Account issues', 'Login problems, password resets, or subscription queries.'),
      ('Technical issues', 'Bugs, crashes, audio not playing, or page errors.'),
      ('Curriculum access',
          'Missing lessons, module unlocking, or content questions.'),
      ('Feedback & ideas', 'Suggestions to improve ChirPolly — we love hearing from you!'),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(color: Colors.grey.shade100, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF6A4CBC).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.help_outline_rounded,
                  color: Color(0xFF6A4CBC),
                  size: 26,
                ),
              ),
              const SizedBox(width: 20),
              Text(
                'What to include in your email',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF2E3192),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...tips.map((tip) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 5),
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          colors: [_kBlue, _kPurple],
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: '${tip.$1}: ',
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: Colors.grey.shade800,
                              ),
                            ),
                            TextSpan(
                              text: tip.$2,
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                height: 1.5,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  // ────────────────────────────────────────────────────────────
  //  Footer (consistent with the rest of the app)
  // ────────────────────────────────────────────────────────────

  Widget _buildFooter(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF15163D),
            Color(0xFF2E3192),
            Color(0xFF4A348F),
            Color(0xFF6A4CBC),
          ],
        ),
      ),
      child: Column(
        children: [
          Text(
            'ChirPolly — Where every voice finds its language.',
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(
              fontSize: 16,
              fontStyle: FontStyle.italic,
              color: Colors.white.withValues(alpha: 0.85),
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 20),
          Divider(color: Colors.white.withValues(alpha: 0.15), height: 1),
          const SizedBox(height: 20),
          Text(
            '© ${DateTime.now().year} ChirPolly. All rights reserved.',
            style: GoogleFonts.inter(
              color: Colors.white.withValues(alpha: 0.55),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
