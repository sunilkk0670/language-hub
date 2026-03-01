import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/subscription_plan.dart';
import '../../data/repositories/subscription_repository.dart';

// ── Repository ──────────────────────────────────────────────────────────────

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>(
  (ref) => SubscriptionRepository(),
);

// ── Plans ────────────────────────────────────────────────────────────────────

final subscriptionPlansProvider = Provider<List<SubscriptionPlan>>(
  (ref) => ref.watch(subscriptionRepositoryProvider).getPlans(),
);

final kanjiLiarAddonProvider = Provider<KanjiLiarAddon>(
  (ref) => ref.watch(subscriptionRepositoryProvider).getKanjiLiarAddon(),
);

// ── Billing Cycle ─────────────────────────────────────────────────────────────

enum BillingCycle { monthly, annual }

final billingCycleProvider = StateProvider<BillingCycle>(
  (ref) => BillingCycle.annual, // Default to annual (higher value)
);

// ── Currency ─────────────────────────────────────────────────────────────────

enum AppCurrency { usd, eur, inr }

final selectedCurrencyProvider = StateProvider<AppCurrency>(
  (ref) => AppCurrency.usd,
);

// ── Helpers ──────────────────────────────────────────────────────────────────

extension AppCurrencyX on AppCurrency {
  String get key {
    switch (this) {
      case AppCurrency.usd: return 'USD';
      case AppCurrency.eur: return 'EUR';
      case AppCurrency.inr: return 'INR';
    }
  }

  String get symbol {
    switch (this) {
      case AppCurrency.usd: return '\$';
      case AppCurrency.eur: return '€';
      case AppCurrency.inr: return '₹';
    }
  }

  String get label {
    switch (this) {
      case AppCurrency.usd: return 'USD (\$)';
      case AppCurrency.eur: return 'EUR (€)';
      case AppCurrency.inr: return 'INR (₹)';
    }
  }
}

extension SubscriptionPlanPricing on SubscriptionPlan {
  double getPrice(AppCurrency currency, BillingCycle cycle) {
    final map = cycle == BillingCycle.annual ? annualPricing : monthlyPricing;
    return map[currency.key] ?? 0;
  }

  String formatPrice(AppCurrency currency, BillingCycle cycle) {
    final price = getPrice(currency, cycle);
    if (price == 0) return 'Free';
    final sym = currency.symbol;
    if (currency == AppCurrency.inr) {
      return '$sym${price.toStringAsFixed(price.truncateToDouble() == price ? 0 : 2)}';
    }
    return '$sym${price.toStringAsFixed(2)}';
  }

  /// Annual savings percentage vs monthly × 12
  int annualSavingsPercent(AppCurrency currency) {
    final monthly = monthlyPricing[currency.key] ?? 0;
    final annual = annualPricing[currency.key] ?? 0;
    if (monthly == 0) return 0;
    final fullYear = monthly * 12;
    return (((fullYear - annual) / fullYear) * 100).round();
  }
}
