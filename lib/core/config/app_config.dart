import 'package:flutter/foundation.dart';

/// Single source of truth for every plan price, limit, and Paddle price ID.
///
/// To change a price, limit, or feature bullet: edit THIS FILE ONLY.
/// UI widgets, the repository, the Cloud Function, and Firestore rules all
/// derive their values from these constants.
class AppConfig {
  AppConfig._(); // non-instantiable

  // ── App identity ──────────────────────────────────────────────────────────
  static const String appName      = 'ChirPolly';
  static const String siteUrl      = 'https://chirpolly.com';
  static const String supportEmail = 'info@chirpolly.com';

  // ── Supported currencies ──────────────────────────────────────────────────
  /// To add GBP: (1) add Paddle price IDs for each GBP product,
  /// (2) add 'GBP' entries to the pricing maps below,
  /// (3) add 'GBP' to this list.
  static const List<String> supportedCurrencies = ['USD', 'EUR', 'INR'];
  static const String defaultCurrency = 'USD';

  /// Currency symbol for display.
  static String currencySymbol(String code) {
    switch (code) {
      case 'EUR': return '€';
      case 'INR': return '₹';
      case 'GBP': return '£';
      default:    return '\$';
    }
  }

  /// Format a price amount for display, e.g. '$36.90' or '₹1,299'.
  static String formatPrice(double amount, String currencyCode) {
    if (amount == 0) return 'Free';
    final sym = currencySymbol(currencyCode);
    if (currencyCode == 'INR') {
      // Drop the decimal if it's a whole number
      return amount == amount.truncateToDouble()
          ? '$sym${amount.truncate()}'
          : '$sym${amount.toStringAsFixed(2)}';
    }
    return '$sym${amount.toStringAsFixed(2)}';
  }

  // ── AI Tutor daily limits ─────────────────────────────────────────────────
  /// These values must stay in sync with the Firestore rule limits in
  /// firestore.rules → ai_usage → getUserAiCap().
  static const int aiDailyLimitFree     =  15;
  static const int aiDailyLimitStandard = 150;
  static const int aiDailyLimitPremium  = 500;

  /// Returns the daily message limit for a given subscription tier string.
  static int aiDailyLimit(String tier) {
    switch (tier.toLowerCase()) {
      case 'premium':  return aiDailyLimitPremium;
      case 'standard': return aiDailyLimitStandard;
      default:         return aiDailyLimitFree;
    }
  }

  // ── Paddle Price IDs (Live & Sandbox) ─────────────────────────────────────
  static const Map<String, String> livePriceIds = {
    'standard_monthly': 'pri_01m072z30dswgwqkbf54q92bb3',
    'standard_yearly':  'pri_01m0735ydpvg1awa1g4p8ecvw1',
    'premium_monthly':   'pri_01m073bwfc4y5sm6m52x25jwhh',
    'premium_yearly':    'pri_01m073eqm3p2dteyfx16ptsc82',
    'kanji_liar':        'pri_01m073vc2nfejgqxzsmsctktx3j',
  };

  static const Map<String, String> sandboxPriceIds = {
    'standard_monthly': 'pri_01kzqeheharqanpynxcggdzcfa',
    'standard_yearly':  'pri_01kzqehevbgw84djd650vdbchj',
    'premium_monthly':   'pri_01kzqehfgpmc9m8tgx9rky2h9c',
    'premium_yearly':    'pri_01kzqehftf246rapzhfh23an91',
    'kanji_liar':        'pri_01kzqehgctn7wn5awajj4tdc6z',
  };

  /// Whether running in sandbox mode (via kDebugMode or PADDLE_ENV/PADDLE_CLIENT_TOKEN override)
  static bool get isSandbox {
    const env = String.fromEnvironment('PADDLE_ENV');
    if (env == 'sandbox') return true;
    if (env == 'live') return false;
    const token = String.fromEnvironment('PADDLE_CLIENT_TOKEN');
    if (token.startsWith('test_')) return true;
    if (token.startsWith('live_')) return false;
    return kDebugMode;
  }

  static Map<String, String> get activePriceIds => isSandbox ? sandboxPriceIds : livePriceIds;

  static String get kStandardAnnual  => activePriceIds['standard_yearly']!;
  static String get kStandardMonthly => activePriceIds['standard_monthly']!;
  static String get kPremiumAnnual   => activePriceIds['premium_yearly']!;
  static String get kPremiumMonthly  => activePriceIds['premium_monthly']!;
  static String get kKanjiLiar       => activePriceIds['kanji_liar']!;

  /// Returns the Paddle price ID for a plan + billing cycle.
  /// [annual] = true → annual price; false → monthly price.
  static String? paddlePriceId(String planId, {required bool annual}) {
    switch (planId) {
      case 'standard':
        return annual ? kStandardAnnual : kStandardMonthly;
      case 'premium':
        return annual ? kPremiumAnnual  : kPremiumMonthly;
      default:
        return null; // 'free' has no Paddle price
    }
  }

  /// Maps a Paddle price ID → subscription tier string.
  /// Supports both live and sandbox Price IDs.
  /// Returns null for add-on products (e.g., Kanji Liar).
  static String? tierForPriceId(String priceId) {
    if (priceId == livePriceIds['standard_yearly'] ||
        priceId == livePriceIds['standard_monthly'] ||
        priceId == sandboxPriceIds['standard_yearly'] ||
        priceId == sandboxPriceIds['standard_monthly']) {
      return 'standard';
    }
    if (priceId == livePriceIds['premium_yearly'] ||
        priceId == livePriceIds['premium_monthly'] ||
        priceId == sandboxPriceIds['premium_yearly'] ||
        priceId == sandboxPriceIds['premium_monthly']) {
      return 'premium';
    }
    return null;
  }

  // ── Plan pricing maps (currency key → amount) ─────────────────────────────
  static const Map<String, double> freePrice        = {'USD': 0,     'EUR': 0,     'INR': 0     };
  static const Map<String, double> standardAnnual   = {'USD': 36.90, 'EUR': 36.90, 'INR': 1299  };
  static const Map<String, double> standardMonthly  = {'USD':  3.69, 'EUR':  3.69, 'INR':  129.99};
  static const Map<String, double> premiumAnnual    = {'USD': 69.99, 'EUR': 69.99, 'INR': 1599  };
  static const Map<String, double> premiumMonthly   = {'USD':  6.99, 'EUR':  6.99, 'INR':  159.99};
  static const Map<String, double> kanjiLiarPrice   = {'USD':  6.99, 'EUR':  6.99, 'INR':  159.99};

  static Map<String, double> annualPricingFor(String planId) {
    switch (planId) {
      case 'standard': return standardAnnual;
      case 'premium':  return premiumAnnual;
      default:         return freePrice;
    }
  }

  static Map<String, double> monthlyPricingFor(String planId) {
    switch (planId) {
      case 'standard': return standardMonthly;
      case 'premium':  return premiumMonthly;
      default:         return freePrice;
    }
  }

  // ── Plan content limits ───────────────────────────────────────────────────
  static const int wordCountFree     = 1000;
  static const int wordCountStandard = 2000;
  static const int wordCountPremium  = 3000;

  // ── Plan feature bullet lists ─────────────────────────────────────────────
  static const List<String> featuresFree = [
    '1,000 Words (A1 Curriculum)',
    'N5 Japanese Intro',
    'Basic Liar Game',
    'Online Only',
  ];

  static const List<String> featuresStandard = [
    '2,000 Words (A1 + A2 Curriculum)',
    'N4 & N3 Kanji Mastery',
    'Full Grammar Suite',
    'Ad-Free Experience',
    'Online Only',
  ];

  static const List<String> featuresPremium = [
    '3,000 Words (A1 + A2 + B1 Curriculum)',
    'N2 & N1 Fluency Mastery',
    'Ad-Free Experience',
    'Offline Mode',
  ];
}
