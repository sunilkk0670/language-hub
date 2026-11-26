import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/app_config.dart';
import '../../../auth/domain/entities/user_entity.dart';
import '../../../auth/presentation/providers/auth_providers.dart';

/// Post-checkout confirmation page.
/// Listens to the user's Firestore document until [isPro] or [subscriptionTier]
/// is updated by the Paddle webhook Cloud Function, then routes to /home.
/// Displays a fallback timeout message with support email after 30 seconds.
class WelcomePage extends ConsumerStatefulWidget {
  const WelcomePage({super.key});

  @override
  ConsumerState<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends ConsumerState<WelcomePage> {
  Timer? _timeoutTimer;
  bool _isTimedOut = false;
  bool _hasNavigated = false;

  String? _initialTier;
  bool? _initialHasKanjiLiar;

  @override
  void initState() {
    super.initState();
    // 30-second fallback timer
    _timeoutTimer = Timer(const Duration(seconds: 30), () {
      if (mounted && !_hasNavigated) {
        setState(() {
          _isTimedOut = true;
        });
      }
    });
  }

  @override
  void dispose() {
    _timeoutTimer?.cancel();
    super.dispose();
  }

  void _navigateToHome() {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;
    _timeoutTimer?.cancel();
    Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
  }

  void _checkActivation(UserEntity? user) {
    if (user == null || _hasNavigated) return;

    if (_initialTier == null) {
      _initialTier = user.effectiveTier;
      _initialHasKanjiLiar = user.hasKanjiLiar;

      // If already active upon arrival (webhook beat the redirect),
      // allow a brief moment to show success UI then navigate.
      if (user.effectiveTier != 'free' || user.hasKanjiLiar || user.isPro) {
        Future.delayed(const Duration(milliseconds: 1500), () {
          if (mounted) _navigateToHome();
        });
      }
      return;
    }

    // Check for state changes triggered by the webhook
    final tierChanged = user.effectiveTier != _initialTier && user.effectiveTier != 'free';
    final kanjiLiarUnlocked = (_initialHasKanjiLiar == false) && user.hasKanjiLiar;
    final becamePro = user.isPro && (_initialTier == 'free');

    if (tierChanged || kanjiLiarUnlocked || becamePro) {
      _navigateToHome();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Listen to user stream for real-time Firestore updates from paddleWebhook
    ref.listen<AsyncValue<UserEntity?>>(userStreamProvider, (previous, next) {
      final user = next.valueOrNull;
      _checkActivation(user);
    });

    // Also check current value
    final currentUser = ref.watch(currentUserProvider);
    WidgetsBinding.instance.addPostFrameCallback((_) => _checkActivation(currentUser));

    return Scaffold(
      backgroundColor: const Color(0xFF0F0A1E),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Container(
              padding: const EdgeInsets.all(36),
              decoration: BoxDecoration(
                color: const Color(0xFF1B1433),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: _isTimedOut
                      ? Colors.amber.withOpacity(0.4)
                      : const Color(0xFF6A4CBC).withOpacity(0.4),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: (_isTimedOut ? Colors.amber : const Color(0xFF6A4CBC))
                        .withOpacity(0.2),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Icon
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _isTimedOut
                          ? Colors.amber.withOpacity(0.15)
                          : const Color(0xFF6A4CBC).withOpacity(0.2),
                    ),
                    child: Center(
                      child: _isTimedOut
                          ? const Icon(Icons.hourglass_empty_rounded,
                              size: 38, color: Colors.amber)
                          : const Icon(Icons.check_circle_outline_rounded,
                              size: 40, color: Color(0xFF66BB6A)),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Header
                  Text(
                    _isTimedOut
                        ? 'Activation in Progress'
                        : 'Payment Received!',
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),

                  // Body message
                  if (!_isTimedOut) ...[
                    Text(
                      'Activating your plan...',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white.withOpacity(0.7),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 28),
                    const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF6A4CBC)),
                      strokeWidth: 3,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'You will be redirected automatically once confirmed.',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.white.withOpacity(0.4),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ] else ...[
                    Text(
                      'This is taking longer than expected.\n\n'
                      'Your payment was safely received, but plan activation is taking a moment to sync. '
                      'Your access will be unlocked shortly.',
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.5,
                        color: Colors.white.withOpacity(0.8),
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.mail_outline, size: 16, color: Colors.white70),
                          const SizedBox(width: 8),
                          SelectableText(
                            AppConfig.supportEmail,
                            style: const TextStyle(
                              color: Color(0xFF9B8FCC),
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _navigateToHome,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6A4CBC),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Continue to Home',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
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
    );
  }
}
