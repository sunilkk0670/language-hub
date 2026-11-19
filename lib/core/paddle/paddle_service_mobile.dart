import 'package:flutter/material.dart';
import '../billing/mobile_billing_service.dart';

export '../billing/mobile_billing_service.dart' show PriceData;

/// Mobile implementation of PaddleService interface.
/// On Android and iOS, checkout and pricing requests route through MobileBillingService
/// (ready for RevenueCat purchases_flutter) tied to the Firebase Auth UID.
class PaddleService {
  static void init(BuildContext context) {
    MobileBillingService.init(context: context);
  }

  /// Returns localized price display data on mobile.
  /// Uses sensible default pricing ($36.90/yr, $69.99/yr, etc.) so pricing_page.dart
  /// renders cleanly without throwing an UnimplementedError or null errors on mobile.
  static Future<PriceData?> getPrice(
    String priceId, {
    String? currencyCode,
    String? countryCode,
  }) async {
    return await MobileBillingService.getPrice(
      priceId,
      currencyCode: currencyCode,
      countryCode: countryCode,
    );
  }

  /// Opens the mobile store in-app purchase flow tied to Firebase Auth UID.
  static void openCheckout({
    required String priceId,
    String? email,
    String? userId,
    String? currencyCode,
    String? countryCode,
    BuildContext? context,
  }) {
    MobileBillingService.openCheckout(
      priceId: priceId,
      email: email,
      userId: userId,
      currencyCode: currencyCode,
      countryCode: countryCode,
      context: context,
    );
  }
}
