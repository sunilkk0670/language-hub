// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get loginTitle => 'Welcome Back';

  @override
  String get loginSubtitle => 'Sign in to continue learning';

  @override
  String get signupTitle => 'Create Your Account';

  @override
  String get signupSubtitle => 'Start your language learning journey';

  @override
  String get emailLabel => 'Email';

  @override
  String get emailHint => 'Enter your email';

  @override
  String get passwordLabel => 'Password';

  @override
  String get passwordHint => 'Enter your password';

  @override
  String get forgotPassword => 'Forgot Password?';

  @override
  String get signInButton => 'Sign In';

  @override
  String get signUpButton => 'Sign Up';

  @override
  String get dontHaveAccount => 'Don\'t have an account? ';

  @override
  String get alreadyHaveAccount => 'Already have an account? ';

  @override
  String get emailRequired => 'Email is required';

  @override
  String get invalidEmail => 'Please enter a valid email';

  @override
  String get passwordRequired => 'Password is required';

  @override
  String get passwordTooShort => 'Password must be at least 6 characters';

  @override
  String get passwordResetSent => 'Password reset link sent! Check your email.';

  @override
  String get agreeToTerms => 'I agree to the ';

  @override
  String get termsOfService => 'Terms of Service';

  @override
  String get and => ' and ';

  @override
  String get privacyPolicy => 'Privacy Policy';

  @override
  String get ageVerification =>
      'I confirm that I am at least 13 years old (or the required age in my country)';
}
