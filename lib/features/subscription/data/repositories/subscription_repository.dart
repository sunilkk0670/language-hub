import '../models/subscription_plan.dart';

class SubscriptionRepository {
  static const List<SubscriptionPlan> _plans = [
    SubscriptionPlan(
      id: 'free',
      name: 'Free',
      tagline: 'A1 — Starter',
      description: 'Begin your language journey at zero cost.',
      annualPricing: {'USD': 0, 'EUR': 0, 'INR': 0},
      monthlyPricing: {'USD': 0, 'EUR': 0, 'INR': 0},
      aiTutorDailyLimit: 5,
      aiTutorHardCap: 5,
      features: [
        '1,000 Words (A1 Curriculum)',
        'N5 Japanese Intro',
        'Basic Liar Game',
        'Online Only',
      ],
      curriculumLevel: 'A1',
      wordCount: 1000,
      isAdFree: false,
      hasOfflineMode: false,
      badgeLabel: '',
    ),
    SubscriptionPlan(
      id: 'standard',
      name: 'Standard',
      tagline: 'A2 — Practice',
      description: 'Accelerate with deeper content and no distractions.',
      annualPricing: {'USD': 36.90, 'EUR': 36.90, 'INR': 1299},
      monthlyPricing: {'USD': 3.69, 'EUR': 3.69, 'INR': 129.99},
      aiTutorDailyLimit: 50,
      aiTutorHardCap: 50,
      features: [
        '2,000 Words (A1 + A2 Curriculum)',
        'N5 & N4 Kanji Mastery',
        'Full Grammar Suite',
        'Ad-Free Experience',
        'Online Only',
      ],
      curriculumLevel: 'A2',
      wordCount: 2000,
      isAdFree: true,
      hasOfflineMode: false,
      isMostPopular: true,
      badgeLabel: 'Most Popular',
    ),
    SubscriptionPlan(
      id: 'premium',
      name: 'Premium',
      tagline: 'B1 — Mastery',
      description: 'Full fluency with AI coaching and offline access.',
      annualPricing: {'USD': 69.99, 'EUR': 69.99, 'INR': 1599},
      monthlyPricing: {'USD': 6.99, 'EUR': 6.99, 'INR': 159.99},
      // null = unlimited for user; hard cap protects against bot abuse
      aiTutorDailyLimit: null,
      aiTutorHardCap: 200,
      features: [
        '3,000 Words (A1 + A2 + B1 Curriculum)',
        'N3 & N2 Fluency Mastery',
        'Ad-Free Experience',
        'Offline Mode',
      ],
      curriculumLevel: 'B1',
      wordCount: 3000,
      isAdFree: true,
      hasOfflineMode: true,
      badgeLabel: 'Best Value',
    ),
  ];

  static const KanjiLiarAddon kanjiLiarAddon = KanjiLiarAddon(
    pricing: {'USD': 3.99, 'EUR': 3.99, 'INR': 69.99},
    description: 'One-time purchase. Unlock the advanced Kanji Liar challenge game.',
  );

  List<SubscriptionPlan> getPlans() => _plans;
  KanjiLiarAddon getKanjiLiarAddon() => kanjiLiarAddon;
}
