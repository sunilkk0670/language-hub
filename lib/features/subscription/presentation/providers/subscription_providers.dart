import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/subscription_plan.dart';
import '../../data/repositories/subscription_repository.dart';
import '../../../../core/config/app_config.dart';

// ── Repository ───────────────────────────────────────────────────────────────

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>(
  (ref) => SubscriptionRepository(),
);

// ── Plans ─────────────────────────────────────────────────────────────────────

final subscriptionPlansProvider = Provider<List<SubscriptionPlan>>(
  (ref) => ref.watch(subscriptionRepositoryProvider).getPlans(),
);

final kanjiLiarAddonProvider = Provider<KanjiLiarAddon>(
  (ref) => ref.watch(subscriptionRepositoryProvider).getKanjiLiarAddon(),
);

// ── Billing Cycle ─────────────────────────────────────────────────────────────

enum BillingCycle { monthly, annual }

final billingCycleProvider = StateProvider<BillingCycle>(
  (ref) => BillingCycle.annual, // default to annual (better value)
);

// ── AI Tutor Limit ────────────────────────────────────────────────────────────

/// Reads from [AppConfig] — single source of truth.
/// Pass the user's subscription tier string ('free', 'standard', 'premium').
final aiTutorLimitProvider = Provider.family<int, String>(
  (ref, tier) => AppConfig.aiDailyLimit(tier),
);

// ── Pricing helpers (String-keyed currency) ───────────────────────────────────

extension SubscriptionPlanPricing on SubscriptionPlan {
  double getPrice(String currencyKey, BillingCycle cycle) {
    final map = cycle == BillingCycle.annual ? annualPricing : monthlyPricing;
    return map[currencyKey] ?? 0;
  }

  String formatPrice(String currencyKey, BillingCycle cycle) {
    final price = getPrice(currencyKey, cycle);
    return AppConfig.formatPrice(price, currencyKey);
  }

  /// Annual savings percentage vs paying monthly × 12.
  int annualSavingsPercent(String currencyKey) {
    final monthly = monthlyPricing[currencyKey] ?? 0;
    final annual  = annualPricing[currencyKey]  ?? 0;
    if (monthly == 0) return 0;
    final fullYear = monthly * 12;
    return (((fullYear - annual) / fullYear) * 100).round();
  }
}
