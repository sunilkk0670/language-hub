import 'package:flutter/material.dart';

/// Glassmorphic preview card for Polly, the AI language companion,
/// featuring a 2D vector avatar, pulsing online status dot, and
/// interactive sample prompts.
class PollyAICompanionCard extends StatefulWidget {
  final VoidCallback? onTap;

  const PollyAICompanionCard({
    super.key,
    this.onTap,
  });

  @override
  State<PollyAICompanionCard> createState() => _PollyAICompanionCardState();
}

class _PollyAICompanionCardState extends State<PollyAICompanionCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Animation<double> _pulseScale;
  late final Animation<double> _pulseOpacity;

  bool _isHovered = false;
  int _promptIndex = 0;

  static const _kIndigo = Color(0xFF6366F1);
  static const _kTeal = Color(0xFF14B8A6);
  static const _kCoral = Color(0xFFF43F5E);

  static const List<({String language, String prompt})> _samplePrompts = [
    (language: 'Español', prompt: 'Polly: Ready to practice Español?'),
    (language: '日本語', prompt: 'Polly: Let’s review 3 new Kanji today!'),
    (language: 'हिन्दी', prompt: 'Polly: Try a quick हिन्दी greeting!'),
    (language: 'Français', prompt: 'Polly: Bonjour! Ready for a 2-min chat?'),
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _pulseScale = Tween<double>(begin: 0.9, end: 1.35).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    _pulseOpacity = Tween<double>(begin: 0.65, end: 0.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _cyclePrompt() {
    setState(() {
      _promptIndex = (_promptIndex + 1) % _samplePrompts.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    final currentPrompt = _samplePrompts[_promptIndex];

    return RepaintBoundary(
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          onTap: widget.onTap ?? () => Navigator.pushNamed(context, '/ai-tutor'),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutCubic,
            constraints: const BoxConstraints(maxWidth: 380),
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: _isHovered ? 0.92 : 0.82),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: _isHovered
                    ? _kIndigo.withValues(alpha: 0.45)
                    : Colors.white.withValues(alpha: 0.9),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: _kIndigo.withValues(alpha: _isHovered ? 0.16 : 0.08),
                  blurRadius: _isHovered ? 24 : 16,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // 2D Vector Polly Avatar + Pulsing Online Dot
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            _kIndigo.withValues(alpha: 0.14),
                            _kTeal.withValues(alpha: 0.16),
                          ],
                        ),
                        border: Border.all(
                          color: _kIndigo.withValues(alpha: 0.2),
                          width: 1,
                        ),
                      ),
                      child: const CustomPaint(
                        painter: _PollyVectorAvatarPainter(
                          indigo: _kIndigo,
                          teal: _kTeal,
                          coral: _kCoral,
                        ),
                      ),
                    ),
                    Positioned(
                      right: -1,
                      bottom: -1,
                      child: RepaintBoundary(
                        child: SizedBox(
                          width: 16,
                          height: 16,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              AnimatedBuilder(
                                animation: _pulseController,
                                builder: (context, child) {
                                  return Transform.scale(
                                    scale: _pulseScale.value,
                                    child: Opacity(
                                      opacity: _pulseOpacity.value,
                                      child: Container(
                                        width: 12,
                                        height: 12,
                                        decoration: const BoxDecoration(
                                          color: _kTeal,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                              Container(
                                width: 9,
                                height: 9,
                                decoration: BoxDecoration(
                                  color: _kTeal,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white,
                                    width: 1.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 14),
                // Companion Header + Interactive Prompt
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 7,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: _kIndigo.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'POLLY AI',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: _kIndigo,
                                letterSpacing: 0.6,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Online',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 5),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 250),
                        child: Text(
                          currentPrompt.prompt,
                          key: ValueKey(currentPrompt.prompt),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                // Interactive Mic Action Button (crisp vector icon)
                Tooltip(
                  message: 'Switch prompt or chat with Polly',
                  child: InkWell(
                    onTap: _cyclePrompt,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [_kIndigo, _kTeal],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _kIndigo.withValues(alpha: 0.25),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.mic_rounded,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Clean 2D vector illustration of Polly the parrot mascot.
class _PollyVectorAvatarPainter extends CustomPainter {
  final Color indigo;
  final Color teal;
  final Color coral;

  const _PollyVectorAvatarPainter({
    required this.indigo,
    required this.teal,
    required this.coral,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Crest / feather tuft
    final crestPaint = Paint()
      ..color = coral
      ..style = PaintingStyle.fill;
    final crestPath = Path()
      ..moveTo(w * 0.44, h * 0.24)
      ..quadraticBezierTo(w * 0.36, h * 0.10, w * 0.50, h * 0.14)
      ..quadraticBezierTo(w * 0.56, h * 0.08, w * 0.60, h * 0.22)
      ..close();
    canvas.drawPath(crestPath, crestPaint);

    // Rounded parrot head / body silhouette
    final headPaint = Paint()
      ..color = teal
      ..style = PaintingStyle.fill;
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(w * 0.24, h * 0.22, w * 0.52, h * 0.56),
        Radius.circular(w * 0.26),
      ),
      headPaint,
    );

    // Wing / cheek accent
    final wingPaint = Paint()
      ..color = indigo
      ..style = PaintingStyle.fill;
    canvas.drawArc(
      Rect.fromLTWH(w * 0.24, h * 0.46, w * 0.36, h * 0.34),
      1.2,
      2.6,
      true,
      wingPaint,
    );

    // White eye patch
    final eyePatchPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(w * 0.48, h * 0.42), w * 0.12, eyePatchPaint);

    // Pupil
    final pupilPaint = Paint()
      ..color = const Color(0xFF0F172A)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(w * 0.50, h * 0.42), w * 0.055, pupilPaint);

    // Eye catchlight
    canvas.drawCircle(Offset(w * 0.52, h * 0.40), w * 0.02, eyePatchPaint);

    // Beak
    final beakPaint = Paint()
      ..color = const Color(0xFFF59E0B)
      ..style = PaintingStyle.fill;
    final beakPath = Path()
      ..moveTo(w * 0.62, h * 0.42)
      ..quadraticBezierTo(w * 0.80, h * 0.44, w * 0.72, h * 0.56)
      ..quadraticBezierTo(w * 0.64, h * 0.54, w * 0.60, h * 0.48)
      ..close();
    canvas.drawPath(beakPath, beakPaint);
  }

  @override
  bool shouldRepaint(covariant _PollyVectorAvatarPainter oldDelegate) => false;
}
