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
  /// firestore.rules → ai_usage → getMaxDailyLimit().
  static const int aiDailyLimitFree     =   5;
  static const int aiDailyLimitStandard =  50;
  static const int aiDailyLimitPremium  = 200;

  /// Returns the daily message limit for a given subscription tier string.
  static int aiDailyLimit(String tier) {
    switch (tier.toLowerCase()) {
      case 'premium':  return aiDailyLimitPremium;
      case 'standard': return aiDailyLimitStandard;
      default:         return aiDailyLimitFree;
    }
  }

  // ── Paddle price IDs ──────────────────────────────────────────────────────
  static const String kStandardAnnual  = 'pri_01m0735ydpvg1awa1g4p8ecvw1';
  static const String kStandardMonthly = 'pri_01m072z30dswgwqkbf54q92bb3';
  static const String kPremiumAnnual   = 'pri_01m073eqm3p2dteyfx16ptsc82';
  static const String kPremiumMonthly  = 'pri_01m073bwfc4y5sm6m52x25jwhh';
  static const String kKanjiLiar       = 'pri_01m073vc2nfejgqxzsmsctktx3j';

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
  /// Returns null for add-on products (e.g., Kanji Liar).
  static String? tierForPriceId(String priceId) {
    switch (priceId) {
      case kStandardAnnual:
      case kStandardMonthly:
        return 'standard';
      case kPremiumAnnual:
      case kPremiumMonthly:
        return 'premium';
      default:
        return null;
    }
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
