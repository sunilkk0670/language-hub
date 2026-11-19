import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/subscription_providers.dart';
import '../../data/models/subscription_plan.dart';
import '../../../../core/paddle/paddle_service.dart';
import '../../../auth/presentation/providers/auth_providers.dart';


final selectedCurrencyProvider = StateProvider<String?>((ref) => null);

String? getCountryCode(String? currency) {
  if (currency == 'USD') return 'US';
  if (currency == 'EUR') return 'DE';
  if (currency == 'GBP') return 'GB';
  if (currency == 'INR') return 'IN';
  return null;
}

final paddlePriceProvider = FutureProvider.autoDispose.family<PriceData?, String>((ref, arg) async {
  final parts = arg.split(':');
  final priceId = parts[0];
  final currencyCode = parts.length > 1 && parts[1] != 'null' ? parts[1] : null;
  return await PaddleService.getPrice(
    priceId,
    currencyCode: currencyCode,
    countryCode: getCountryCode(currencyCode),
  );
});

String getStaticPriceText(String planId, BillingCycle cycle, String currency) {
  if (planId == 'standard') {
    if (cycle == BillingCycle.monthly) {
      if (currency == 'INR') return '₹129.99';
      if (currency == 'EUR') return '€3.69';
      if (currency == 'GBP') return '£3.69';
      return '\$3.69';
    } else {
      if (currency == 'INR') return '₹1,299.00';
      if (currency == 'EUR') return '€36.90';
      if (currency == 'GBP') return '£36.90';
      return '\$36.90';
    }
  } else if (planId == 'premium') {
    if (cycle == BillingCycle.monthly) {
      if (currency == 'INR') return '₹159.99';
      if (currency == 'EUR') return '€6.99';
      if (currency == 'GBP') return '£6.99';
      return '\$6.99';
    } else {
      if (currency == 'INR') return '₹1,599.00';
      if (currency == 'EUR') return '€69.99';
      if (currency == 'GBP') return '£69.99';
      return '\$69.99';
    }
  }
  return 'Free';
}

String getStaticAddonPriceText(String currency) {
  if (currency == 'INR') return '₹159.99';
  if (currency == 'EUR') return '€6.99';
  if (currency == 'GBP') return '£6.99';
  return '\$6.99';
}

String? getPaddlePriceId(String planId, BillingCycle cycle) {
  if (planId == 'standard') {
    return cycle == BillingCycle.annual ? 'pri_01m0735ydpvg1awa1g4p8ecvw1' : 'pri_01m072z30dswgwqkbf54q92bb3';
  } else if (planId == 'premium') {
    return cycle == BillingCycle.annual ? 'pri_01m073eqm3p2dteyfx16ptsc82' : 'pri_01m073bwfc4y5sm6m52x25jwhh';
  }
  return null;
}

class _PricingScrollBehavior extends MaterialScrollBehavior {
  const _PricingScrollBehavior();

  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
        PointerDeviceKind.stylus,
      };
}

class PricingPage extends ConsumerWidget {
  const PricingPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    return Scaffold(
      backgroundColor: const Color(0xFF0F0A1E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0A1E),
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Pricing',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: const _PricingBody(),
    );
  }
}

class _PricingBody extends ConsumerWidget {
  const _PricingBody();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Initialize Paddle JS Interop (only happens once)
    PaddleService.init(context);

    final rawPlans = ref.watch(subscriptionPlansProvider);
    final plans = rawPlans;
    final cycle = ref.watch(billingCycleProvider);
    
    final selectedCurrency = ref.watch(selectedCurrencyProvider);
    final standardMonthlyPriceId = getPaddlePriceId('standard', BillingCycle.monthly);
    if (standardMonthlyPriceId != null) {
      ref.listen(paddlePriceProvider('$standardMonthlyPriceId:$selectedCurrency'), (previous, next) {
        final data = next.value;
        if (data != null && ref.read(selectedCurrencyProvider) == null) {
          ref.read(selectedCurrencyProvider.notifier).state = data.currencyCode;
        }
      });
    }
    final rawAddon = ref.watch(kanjiLiarAddonProvider);
    final addon = KanjiLiarAddon(
      pricing: const {'USD': 6.99, 'EUR': 6.99, 'INR': 159.99},
      description: rawAddon.description,
    );

    return ScrollConfiguration(
      behavior: const _PricingScrollBehavior(),
      child: Scrollbar(
        thumbVisibility: true,
        child: SingleChildScrollView(
          primary: true,
          physics: const BouncingScrollPhysics(),
          child: Column(
            children: [
              _HeroSection(cycle: cycle),
              const SizedBox(height: 32),
            _PlanCardsSection(plans: plans, cycle: cycle),
            const SizedBox(height: 48),
            _KanjiLiarSection(addon: addon),
            const SizedBox(height: 48),
            _FeatureComparisonTable(plans: plans),
            const SizedBox(height: 48),
            const _PricingFooter(),
            const SizedBox(height: 32),
          ],
        ),
      ),
      ),
    );
  }
}

// ── Hero Section ─────────────────────────────────────────────────────────────

class _HeroSection extends ConsumerWidget {
  final BillingCycle cycle;

  const _HeroSection({required this.cycle});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 0),
      child: Column(
        children: [
          // Title
          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: [Color(0xFF9B59B6), Color(0xFFFF6B6B)],
            ).createShader(bounds),
            child: const Text(
              'Simple, Honest Pricing',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Start free. Upgrade when you\'re ready.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white.withOpacity(0.6),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          // Billing Toggle Row
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 16,
            runSpacing: 12,
            children: [
              _BillingToggle(cycle: cycle),
              const _CurrencyDropdown(),
            ],
          ),
        ],
      ),
    );
  }
}

class _BillingToggle extends ConsumerWidget {
  final BillingCycle cycle;
  const _BillingToggle({required this.cycle});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isAnnual = cycle == BillingCycle.annual;
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(50),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _ToggleChip(
            label: 'Monthly',
            isSelected: !isAnnual,
            onTap: () => ref.read(billingCycleProvider.notifier).state = BillingCycle.monthly,
          ),
          _ToggleChip(
            label: 'Annual',
            isSelected: isAnnual,
            badge: 'Save 17%',
            onTap: () => ref.read(billingCycleProvider.notifier).state = BillingCycle.annual,
          ),
        ],
      ),
    );
  }
}

class _ToggleChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final String? badge;
  final VoidCallback onTap;

  const _ToggleChip({
    required this.label,
    required this.isSelected,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [Color(0xFF6A4CBC), Color(0xFFFF6B6B)],
                )
              : null,
          borderRadius: BorderRadius.circular(50),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.white60,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 14,
              ),
            ),
            if (badge != null && isSelected) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFFF6B6B).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFFF6B6B).withOpacity(0.5)),
                ),
                child: Text(
                  badge!,
                  style: const TextStyle(
                    color: Color(0xFFFF9999),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _CurrencyDropdown extends ConsumerWidget {
  const _CurrencyDropdown();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCurrency = ref.watch(selectedCurrencyProvider);
    final displayValue = selectedCurrency ?? 'USD';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(50),
        border: Border.all(color: Colors.white.withOpacity(0.15)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: displayValue,
          dropdownColor: const Color(0xFF0F0A1E),
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          icon: const Icon(Icons.keyboard_arrow_down, color: Colors.white54),
          items: const [
            DropdownMenuItem(value: 'USD', child: Text('USD (\$)')),
            DropdownMenuItem(value: 'EUR', child: Text('EUR (€)')),
            DropdownMenuItem(value: 'GBP', child: Text('GBP (£)')),
            DropdownMenuItem(value: 'INR', child: Text('INR (₹)')),
          ],
          onChanged: (val) {
            if (val != null) {
              ref.read(selectedCurrencyProvider.notifier).state = val;
            }
          },
        ),
      ),
    );
  }
}

// ── Plan Cards ───────────────────────────────────────────────────────────────

class _PlanCardsSection extends StatelessWidget {
  final List<SubscriptionPlan> plans;
  final BillingCycle cycle;

  const _PlanCardsSection({
    required this.plans,
    required this.cycle,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final isDesktop = constraints.maxWidth > 800;
          if (isDesktop) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: plans.map((plan) {
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: _PlanCard(
                      plan: plan,
                      cycle: cycle,
                    ),
                  ),
                );
              }).toList(),
            );
          } else {
            return Column(
              children: plans.map((plan) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: _PlanCard(
                    plan: plan,
                    cycle: cycle,
                  ),
                );
              }).toList(),
            );
          }
        },
      ),
    );
  }
}

class _PlanCard extends ConsumerStatefulWidget {
  final SubscriptionPlan plan;
  final BillingCycle cycle;

  const _PlanCard({
    required this.plan,
    required this.cycle,
  });

  @override
  ConsumerState<_PlanCard> createState() => _PlanCardState();
}

class _PlanCardState extends ConsumerState<_PlanCard> {
  bool _isHovered = false;

  List<Color> get _gradientColors {
    switch (widget.plan.id) {
      case 'free':
        return [const Color(0xFF1E1535), const Color(0xFF2A1F4A)];
      case 'standard':
        return [const Color(0xFF2E1B6B), const Color(0xFF6A4CBC)];
      case 'premium':
        return [const Color(0xFF6A1B1B), const Color(0xFFCC4444)];
      default:
        return [const Color(0xFF1E1535), const Color(0xFF2A1F4A)];
    }
  }

  Color get _accentColor {
    switch (widget.plan.id) {
      case 'free': return const Color(0xFF9B8FCC);
      case 'standard': return const Color(0xFF9B59B6);
      case 'premium': return const Color(0xFFFF6B6B);
      default: return const Color(0xFF9B8FCC);
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = ref.watch(currentUserProvider);
    final selectedCurrency = ref.watch(selectedCurrencyProvider);
    final plan = widget.plan;
    final isAnnual = widget.cycle == BillingCycle.annual;
    final priceId = getPaddlePriceId(plan.id, widget.cycle);
    final paddlePriceAsync = priceId != null 
        ? ref.watch(paddlePriceProvider('$priceId:$selectedCurrency')) 
        : const AsyncValue<PriceData?>.data(null);

    // For savings logic, we no longer compute it manually via currency.
    // We could omit it, or just show it statically if isAnnual and plan is standard/premium.
    final savings = (plan.id == 'free') ? 0 : 17;

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        transform: Matrix4.identity()
          ..translate(0.0, _isHovered ? -6.0 : 0.0),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: _gradientColors,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: plan.isMostPopular
                  ? _accentColor.withOpacity(0.8)
                  : Colors.white.withOpacity(_isHovered ? 0.2 : 0.08),
              width: plan.isMostPopular ? 2 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: _accentColor.withOpacity(_isHovered ? 0.35 : 0.15),
                blurRadius: _isHovered ? 30 : 15,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Stack(
            children: [
              // Glassmorphic overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withOpacity(0.05),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              // Content
              Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge row
                    if (plan.badgeLabel.isNotEmpty)
                      Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: _accentColor.withOpacity(0.25),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: _accentColor.withOpacity(0.5)),
                        ),
                        child: Text(
                          plan.badgeLabel,
                          style: TextStyle(
                            color: _accentColor,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    // Plan name & tagline
                    Text(
                      plan.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      plan.tagline,
                      style: TextStyle(
                        color: _accentColor,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Price
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: Column(
                        key: ValueKey('${widget.cycle}'),
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Builder(
                            builder: (context) {
                              final priceStr = getStaticPriceText(plan.id, widget.cycle, selectedCurrency ?? 'USD');
                              return Text(
                                priceStr,
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: priceStr == 'Free' || priceStr.isEmpty ? 40 : 34,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1,
                                ),
                              );
                            },
                          ),
                          if (plan.id != 'free')
                            Text(
                              isAnnual ? '/ year' : '/ month',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.5),
                                fontSize: 13,
                              ),
                            ),
                          if (isAnnual && savings > 0)
                            Padding(
                              padding: const EdgeInsets.only(top: 6),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.green.withOpacity(0.4)),
                                ),
                                child: Text(
                                  'Save $savings% vs monthly',
                                  style: const TextStyle(
                                    color: Color(0xFF66BB6A),
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Divider(color: Colors.white.withOpacity(0.1)),
                    const SizedBox(height: 16),
                    // Features
                    ...plan.features.map((f) => _FeatureRow(
                          feature: f,
                          accentColor: _accentColor,
                        )),
                    const SizedBox(height: 16),
                    _AiTutorChip(plan: plan, accentColor: _accentColor),
                    const SizedBox(height: 24),
                    // CTA
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          if (plan.id == 'free') {
                            Navigator.pushNamed(context, '/register');
                          } else if (priceId != null) {
                            // Open Paddle Checkout for this specific price
                             PaddleService.openCheckout(
                              priceId: priceId,
                              email: currentUser?.email,
                              userId: currentUser?.uid,
                              currencyCode: selectedCurrency,
                              countryCode: getCountryCode(selectedCurrency),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: plan.id == 'free'
                              ? Colors.white.withOpacity(0.1)
                              : _accentColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: plan.id == 'free'
                                ? BorderSide(color: Colors.white.withOpacity(0.2))
                                : BorderSide.none,
                          ),
                          elevation: 0,
                        ),
                        child: Text(
                          plan.id == 'free' ? 'Get Started Free' : 'Choose ${plan.name}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final String feature;
  final Color accentColor;

  const _FeatureRow({required this.feature, required this.accentColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check_circle_rounded, color: accentColor, size: 16),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              feature,
              style: TextStyle(
                color: Colors.white.withOpacity(0.85),
                fontSize: 13,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AiTutorChip extends ConsumerWidget {
  final SubscriptionPlan plan;
  final Color accentColor;

  const _AiTutorChip({required this.plan, required this.accentColor});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final limit = ref.watch(aiTutorLimitProvider(plan.id));
    final label = 'AI Tutor: $limit msg/day';
    final sublabel = plan.id == 'premium' ? '(Priority Access)' : null;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: accentColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.smart_toy_outlined, color: accentColor, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: accentColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (sublabel != null)
                  Text(
                    sublabel,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.4),
                      fontSize: 10,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Kanji Liar Add-on ─────────────────────────────────────────────────────────

class _KanjiLiarSection extends ConsumerWidget {
  final dynamic addon;

  const _KanjiLiarSection({required this.addon});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    final selectedCurrency = ref.watch(selectedCurrencyProvider);
    const addonPriceId = 'pri_01m073vc2nfejgqxzsmsctktx3j'; // Price ID for Kanji Liar
    final paddlePriceAsync = ref.watch(paddlePriceProvider('$addonPriceId:$selectedCurrency'));

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1A2A1A), Color(0xFF0D3320)],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFF4CAF50).withOpacity(0.4)),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF4CAF50).withOpacity(0.15),
              blurRadius: 20,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth > 500;
            if (isWide) {
              return Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF4CAF50).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Text('漢', style: TextStyle(fontSize: 28, color: Color(0xFF66BB6A))),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Kanji Liar', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text('One-time purchase · Standalone add-on', style: TextStyle(color: const Color(0xFF66BB6A).withOpacity(0.8), fontSize: 12)),
                                const SizedBox(height: 8),
                                Text(addon.description, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Builder(
                          builder: (context) {
                            final priceStr = getStaticAddonPriceText(selectedCurrency ?? 'USD');
                            return Text(
                              priceStr,
                              style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                            );
                          },
                        ),
                        const Text('one-time', style: TextStyle(color: Colors.white38, fontSize: 12)),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: () {
                            PaddleService.openCheckout(
                              priceId: addonPriceId,
                              email: currentUser?.email,
                              userId: currentUser?.uid,
                              currencyCode: selectedCurrency,
                              countryCode: getCountryCode(selectedCurrency),
                            );
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4CAF50), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), elevation: 0),
                          child: const Text('Add to Plan', style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                );
            }
            return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFF4CAF50).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Text('漢', style: TextStyle(fontSize: 28, color: Color(0xFF66BB6A))),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Kanji Liar', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('One-time purchase · Standalone add-on', style: TextStyle(color: const Color(0xFF66BB6A).withOpacity(0.8), fontSize: 12)),
                              const SizedBox(height: 8),
                              Text(addon.description, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Builder(
                      builder: (context) {
                        final priceStr = getStaticAddonPriceText(selectedCurrency ?? 'USD');
                        return Text(
                          priceStr,
                          style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                        );
                      },
                    ),
                    const Text('one-time', style: TextStyle(color: Colors.white38, fontSize: 12)),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () {
                        PaddleService.openCheckout(
                          priceId: addonPriceId,
                          email: currentUser?.email,
                          userId: currentUser?.uid,
                          currencyCode: selectedCurrency,
                          countryCode: getCountryCode(selectedCurrency),
                        );
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4CAF50), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), elevation: 0),
                      child: const Text('Add to Plan', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                );

          },
        ),
      ),
    );
  }
}

// ── Feature Comparison Table ──────────────────────────────────────────────────

class _FeatureComparisonTable extends StatelessWidget {
  final List<SubscriptionPlan> plans;

  const _FeatureComparisonTable({required this.plans});

  @override
  Widget build(BuildContext context) {
    final rows = [
      ['Words', '1,000', '3,000'],
      ['Japanese Depth', 'N5 Intro', 'N5 to N1 Mastery'],
      ['Ads', 'Yes', 'No'],
      ['Liar Game', 'Basic', 'Full'],
      ['Grammar Suite', '—', '✓'],
      ['Offline Mode', '—', '✓'],
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: ShaderMask(
              shaderCallback: (b) => const LinearGradient(
                colors: [Color(0xFF9B59B6), Color(0xFFFF6B6B)],
              ).createShader(b),
              child: const Text(
                'Compare All Features',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Table(
                columnWidths: const {
                  0: FlexColumnWidth(2),
                  1: FlexColumnWidth(1.2),
                  2: FlexColumnWidth(1.2),
                },
                children: [
                  // Header
                  TableRow(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF6A4CBC).withOpacity(0.4),
                          const Color(0xFFFF6B6B).withOpacity(0.2),
                        ],
                      ),
                    ),
                    children: [
                      _tableCell('Feature', isHeader: true),
                      _tableCell('Free', isHeader: true),
                      _tableCell('Premium', isHeader: true),
                    ],
                  ),
                  // Data rows
                  ...rows.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final row = entry.value;
                    return TableRow(
                      decoration: BoxDecoration(
                        color: idx.isOdd
                            ? Colors.white.withOpacity(0.03)
                            : Colors.transparent,
                      ),
                      children: [
                        _tableCell(row[0], isFeature: true),
                        _tableCell(row[1]),
                        _tableCell(row[2]),
                      ],
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tableCell(String text, {bool isHeader = false, bool isFeature = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Text(
        text,
        style: TextStyle(
          color: isHeader
              ? Colors.white
              : isFeature
                  ? Colors.white70
                  : text == '—'
                      ? Colors.white24
                      : text == '✓'
                          ? const Color(0xFF66BB6A)
                          : Colors.white60,
          fontWeight: isHeader ? FontWeight.bold : FontWeight.normal,
          fontSize: isHeader ? 13 : 13,
        ),
        textAlign: isFeature ? TextAlign.left : TextAlign.center,
      ),
    );
  }
}

// ── Footer ────────────────────────────────────────────────────────────────────

class _PricingFooter extends StatelessWidget {
  const _PricingFooter();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          Divider(color: Colors.white.withOpacity(0.1)),
          const SizedBox(height: 20),
          Text(
            'All prices are in the selected currency and include applicable taxes where required. '
            'Annual plans are billed once per year. Cancel anytime.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.4),
              fontSize: 12,
              height: 1.6,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 8,
            runSpacing: 4,
            children: [
              _FooterLink(label: 'Terms of Service', onTap: () => Navigator.pushNamed(context, '/compliance', arguments: {'initialIndex': 0})),
              Text('·', style: TextStyle(color: Colors.white.withOpacity(0.3))),
              _FooterLink(label: 'Privacy Policy', onTap: () => Navigator.pushNamed(context, '/compliance', arguments: {'initialIndex': 1})),
              Text('·', style: TextStyle(color: Colors.white.withOpacity(0.3))),
              _FooterLink(label: 'Refund Policy', onTap: () => Navigator.pushNamed(context, '/compliance', arguments: {'initialIndex': 0})),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '© ${DateTime.now().year} ChirpPolly. All rights reserved.',
            style: TextStyle(color: Colors.white.withOpacity(0.25), fontSize: 11),
          ),
        ],
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _FooterLink({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Text(
        label,
        style: const TextStyle(
          color: Color(0xFF9B8FCC),
          fontSize: 12,
          decoration: TextDecoration.underline,
          decorationColor: Color(0xFF9B8FCC),
        ),
      ),
    );
  }
}
