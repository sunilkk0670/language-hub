import '../models/subscription_plan.dart';
import '../../../../core/config/app_config.dart';

/// Repository for subscription plan data.
/// All prices, word counts, and feature lists are read from [AppConfig].
class SubscriptionRepository {
  static const List<SubscriptionPlan> _plans = [
    SubscriptionPlan(
      id: 'free',
      name: 'Free',
      tagline: 'A1 — Starter',
      description: 'Begin your language journey at zero cost.',
      annualPricing:  AppConfig.freePrice,
      monthlyPricing: AppConfig.freePrice,
      features:       AppConfig.featuresFree,
      curriculumLevel: 'A1',
      wordCount:      AppConfig.wordCountFree,
      isAdFree:       false,
      hasOfflineMode: false,
      badgeLabel:     '',
    ),
    SubscriptionPlan(
      id: 'standard',
      name: 'Standard',
      tagline: 'A2 — Practice',
      description: 'Accelerate with deeper content and no distractions.',
      annualPricing:  AppConfig.standardAnnual,
      monthlyPricing: AppConfig.standardMonthly,
      features:       AppConfig.featuresStandard,
      curriculumLevel: 'A2',
      wordCount:      AppConfig.wordCountStandard,
      isAdFree:       true,
      hasOfflineMode: false,
      isMostPopular:  true,
      badgeLabel:     'Most Popular',
    ),
    SubscriptionPlan(
      id: 'premium',
      name: 'Premium',
      tagline: 'B1 — Mastery',
      description: 'Full fluency with AI coaching and offline access.',
      annualPricing:  AppConfig.premiumAnnual,
      monthlyPricing: AppConfig.premiumMonthly,
      features:       AppConfig.featuresPremium,
      curriculumLevel: 'B1',
      wordCount:      AppConfig.wordCountPremium,
      isAdFree:       true,
      hasOfflineMode: true,
      badgeLabel:     'Best Value',
    ),
  ];

  static const KanjiLiarAddon _kanjiLiarAddon = KanjiLiarAddon(
    pricing:     AppConfig.kanjiLiarPrice,
    description: 'One-time purchase. Unlock the advanced Kanji Liar challenge game.',
  );

  List<SubscriptionPlan> getPlans() => _plans;
  KanjiLiarAddon getKanjiLiarAddon() => _kanjiLiarAddon;
}
