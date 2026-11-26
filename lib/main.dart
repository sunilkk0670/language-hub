import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';
import 'l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'firebase_options.dart';
import 'features/curriculum/presentation/pages/all_languages_page.dart';
import 'features/curriculum/presentation/pages/home_page.dart';
import 'features/curriculum/presentation/pages/firestore_test_page.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/legal/presentation/pages/compliance_page.dart';
import 'features/legal/presentation/pages/privacy_policy_page.dart';
import 'features/legal/presentation/pages/terms_of_service_page.dart';
import 'features/legal/presentation/pages/refund_policy_page.dart';
import 'features/info/presentation/pages/about_page.dart';
import 'features/info/presentation/pages/contact_page.dart';
import 'features/auth/presentation/providers/auth_providers.dart';
import 'features/curriculum/presentation/providers/curriculum_provider.dart';
import 'features/subscription/presentation/pages/pricing_page.dart';
import 'features/subscription/presentation/pages/welcome_page.dart';
import 'features/auth/presentation/widgets/welcome_dialog.dart';
import 'screens/ai_tutor_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Handle uncaught Flutter framework errors
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('FlutterError caught: ${details.exceptionAsString()}');
  };

  // Handle uncaught asynchronous errors in the root isolate
  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('Uncaught asynchronous error: $error\n$stack');
    return true; // mark handled
  };

  if (kIsWeb) {
    try {
      usePathUrlStrategy(); // Clean path-based URLs (no # hash) for Paddle/SEO
    } catch (e) {
      debugPrint('usePathUrlStrategy warning: $e');
    }
  }

  Object? initError;
  StackTrace? initStackTrace;

  try {
    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
    } catch (primaryError) {
      debugPrint('Primary Firebase init with options failed ($primaryError), attempting default fallback...');
      await Firebase.initializeApp();
    }
    debugPrint('Firebase initialized successfully');
  } catch (e, stackTrace) {
    initError = e;
    initStackTrace = stackTrace;
    FlutterError.reportError(
      FlutterErrorDetails(
        exception: e,
        stack: stackTrace,
        library: 'Firebase Core',
        context: ErrorDescription('during Firebase.initializeApp in main()'),
      ),
    );
  }

  if (initError != null) {
    runApp(
      FirebaseInitializationErrorApp(
        error: initError.toString(),
        stackTrace: initStackTrace?.toString(),
      ),
    );
    return;
  }

  runApp(
    const ProviderScope(
      child: ChirpPollyApp(),
    ),
  );
}

class FirebaseInitializationErrorApp extends StatelessWidget {
  final String error;
  final String? stackTrace;

  const FirebaseInitializationErrorApp({
    super.key,
    required this.error,
    this.stackTrace,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ChirpPolly - Firebase Error',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: Scaffold(
        backgroundColor: const Color(0xFF1E1E2E),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.error_outline, color: Colors.amberAccent, size: 32),
                    SizedBox(width: 12),
                    Text(
                      'Firebase Init Diagnostic',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Firebase failed to initialize during startup. Diagnostic details:',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF11111B),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: SingleChildScrollView(
                      child: SelectableText(
                        'Error:\n$error\n\nStackTrace:\n${stackTrace ?? "N/A"}',
                        style: const TextStyle(
                          color: Color(0xFFF38BA8),
                          fontFamily: 'monospace',
                          fontSize: 12,
                        ),
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

class ChirpPollyApp extends ConsumerWidget {
  const ChirpPollyApp({super.key});

  // Global navigator key for navigation outside of build context
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Listen to auth state changes globally to update navigation or UI
    ref.listen(authStateProvider, (previous, next) {
      final user = next.valueOrNull;
      final previousUser = previous?.valueOrNull;
      
      debugPrint('Auth change detected: ${previousUser?.email} -> ${user?.email}');
      
      if (previousUser == null && user != null) {
        debugPrint('User just logged in. Current user: ${user.email}');
        final context = navigatorKey.currentContext;
        if (context != null) {
          final currentRoute = ModalRoute.of(context)?.settings.name;
          debugPrint('Current route: $currentRoute');
          if (currentRoute == '/login') {
            debugPrint('Redirecting from /login to /home via global listener');
            navigatorKey.currentState?.pushReplacementNamed('/home');
            // Show welcome dialog for new users after navigation settles
            Future.delayed(const Duration(milliseconds: 600), () {
              final ctx = navigatorKey.currentContext;
              if (ctx != null && ctx.mounted) {
                final email = user.email;
                final userName = email.contains('@') ? email.split('@').first : 'there';
                WelcomeDialog.show(
                  ctx,
                  userName: userName,
                  languageName: 'your chosen language',
                  onStartLesson: () {},
                );
              }
            });
          }
        } else {
          debugPrint('Navigator context is null, cannot redirect globally');
        }
      }
    });

    return MaterialApp(
      navigatorKey: navigatorKey,
      title: 'ChirPolly - Language Learning',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
        ),
        splashFactory: NoSplash.splashFactory,
        highlightColor: Colors.transparent,
        splashColor: Colors.transparent,
        hoverColor: Colors.transparent,
        focusColor: Colors.transparent,
        textTheme: GoogleFonts.notoSansTextTheme().apply(
          fontFamilyFallback: [
            'Noto Sans JP',
            'Noto Sans KR',
          ],
        ),
      ),
      // Changed from AuthGate to HomePage for public access
      home: const HomePage(),
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en'),
      ],
      routes: {
        '/home': (context) => const HomePage(),
        '/test-firestore': (context) => const FirestoreTestPage(),
        '/login': (context) => const LoginPage(),
        '/compliance': (context) {
          final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
          return CompliancePage(initialIndex: args?['initialIndex'] ?? 0);
        },
        '/terms': (context) => const TermsOfServicePage(),
        '/privacy': (context) => const PrivacyPolicyPage(),
        '/refund': (context) => const RefundPolicyPage(),
        '/about': (context) => const AboutPage(),
        '/contact': (context) => const ContactPage(),
        '/languages': (context) => const AllLanguagesPage(),
        '/pricing': (context) => const PricingPage(),
        '/welcome': (context) => const WelcomePage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/ai-tutor') {
          return MaterialPageRoute(
            builder: (context) {
              // Import the AI Tutor screen
              // We'll use a Consumer to get the selected language
              return Consumer(
                builder: (context, ref, _) {
                  final user = ref.watch(currentUserProvider);
                  final selectedLanguage = ref.watch(selectedLanguageProvider);
                  
                  // Import the screen here to avoid circular dependencies
                  return AITutorScreen(
                    targetLanguage: selectedLanguage,
                    nativeLanguage: 'English',
                    userId: user?.uid ?? 'guest',
                    userTier: user?.effectiveTier ?? 'free',
                  );
                },
              );
            },
          );
        }
        return null;
      },
    );
  }
}
