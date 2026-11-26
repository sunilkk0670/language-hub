/// Represents a subscription tier for ChirPolly.
/// Prices, AI limits, and feature lists live in AppConfig — not here.
class SubscriptionPlan {
  final String id;
  final String name;
  final String tagline;
  final String description;

  /// Localized annual pricing. Keys: 'USD', 'EUR', 'INR'. 0 = Free.
  final Map<String, double> annualPricing;

  /// Localized monthly pricing. Keys: 'USD', 'EUR', 'INR'. 0 = Free.
  final Map<String, double> monthlyPricing;

  final List<String> features;
  final String curriculumLevel; // 'A1', 'A2', 'B1'
  final int wordCount;
  final bool isAdFree;
  final bool hasOfflineMode;
  final bool isMostPopular;
  final String badgeLabel;

  const SubscriptionPlan({
    required this.id,
    required this.name,
    required this.tagline,
    required this.description,
    required this.annualPricing,
    required this.monthlyPricing,
    required this.features,
    required this.curriculumLevel,
    required this.wordCount,
    required this.isAdFree,
    required this.hasOfflineMode,
    this.isMostPopular = false,
    this.badgeLabel = '',
  });
}

/// Represents the Kanji Liar standalone add-on (one-time purchase).
class KanjiLiarAddon {
  final Map<String, double> pricing; // 'USD', 'EUR', 'INR'
  final String description;

  const KanjiLiarAddon({
    required this.pricing,
    required this.description,
  });
}
