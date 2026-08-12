import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:chirp_polly/features/subscription/data/repositories/subscription_repository.dart';
import 'package:chirp_polly/features/subscription/presentation/pages/pricing_page.dart';

void main() {
  test('SubscriptionRepository feature lists reflect correct N levels', () {
    final repository = SubscriptionRepository();
    final plans = repository.getPlans();

    final standardPlan = plans.firstWhere((p) => p.id == 'standard');
    expect(standardPlan.features, contains('N4 & N3 Kanji Mastery'));

    final premiumPlan = plans.firstWhere((p) => p.id == 'premium');
    expect(premiumPlan.features, contains('N2 & N1 Fluency Mastery'));
  });

  testWidgets('PricingPage renders updated feature text accurately', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: PricingPage(),
        ),
      ),
    );

    // Verify both updated features render on the Pricing Page
    expect(find.text('N4 & N3 Kanji Mastery'), findsOneWidget);
    expect(find.text('N2 & N1 Fluency Mastery'), findsOneWidget);
  });
}
