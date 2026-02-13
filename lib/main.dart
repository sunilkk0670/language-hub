import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';
import 'firebase_options.dart';
import 'features/curriculum/presentation/pages/all_languages_page.dart';
import 'features/curriculum/presentation/pages/home_page.dart';
import 'features/curriculum/presentation/pages/firestore_test_page.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/legal/presentation/pages/compliance_page.dart';
import 'features/info/presentation/pages/about_page.dart';
import 'features/auth/presentation/providers/auth_providers.dart';
import 'features/curriculum/presentation/providers/curriculum_provider.dart';
import 'screens/ai_tutor_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(
    const ProviderScope(
      child: ChirpPollyApp(),
    ),
  );
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
        // User just logged in, if they are on login page, move them to home
        final context = navigatorKey.currentContext;
        if (context != null) {
          final currentRoute = ModalRoute.of(context)?.settings.name;
          debugPrint('Current route: $currentRoute');
          if (currentRoute == '/login') {
            debugPrint('Redirecting from /login to /home via global listener');
            navigatorKey.currentState?.pushReplacementNamed('/home');
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
      routes: {
        '/home': (context) => const HomePage(),
        '/test-firestore': (context) => const FirestoreTestPage(),
        '/login': (context) => const LoginPage(),
        '/compliance': (context) {
          final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
          return CompliancePage(initialIndex: args?['initialIndex'] ?? 0);
        },
        '/terms': (context) => const CompliancePage(initialIndex: 1),
        '/privacy': (context) => const CompliancePage(initialIndex: 0),
        '/refund': (context) => const CompliancePage(initialIndex: 2),
        '/about': (context) => const AboutPage(),
        '/languages': (context) => const AllLanguagesPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/ai-tutor') {
          return MaterialPageRoute(
            builder: (context) {
              // Import the AI Tutor screen
              // We'll use a Consumer to get the selected language
              return Consumer(
                builder: (context, ref, _) {
                  final user = ref.watch(authStateProvider).valueOrNull;
                  final selectedLanguage = ref.watch(selectedLanguageProvider);
                  
                  // Import the screen here to avoid circular dependencies
                  return _buildAITutorScreen(
                    targetLanguage: selectedLanguage ?? 'Spanish',
                    nativeLanguage: 'English',
                    userId: user?.uid ?? 'guest',
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

// Helper function to build AI Tutor screen
Widget _buildAITutorScreen({
  required String targetLanguage,
  required String nativeLanguage,
  required String userId,
}) {
  return AITutorScreen(
    targetLanguage: targetLanguage,
    nativeLanguage: nativeLanguage,
    userId: userId,
  );
}

