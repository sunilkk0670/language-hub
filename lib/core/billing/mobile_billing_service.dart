import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../config/app_config.dart';

class PriceData {
  final String formattedPrice;
  final String currencyCode;

  PriceData({required this.formattedPrice, required this.currencyCode});
}

/// MobileBillingService:
/// Stub for mobile in-app purchases (Android Google Play & iOS App Store)
/// structured for RevenueCat (`purchases_flutter`), bound to the Firebase Auth UID.
class MobileBillingService {
  static bool _initialized = false;
  static String? _currentAppUserId;

  /// Returns the current active user ID (preferring Firebase Auth UID).
  static String? get currentUserId {
    try {
      return _currentAppUserId ?? FirebaseAuth.instance.currentUser?.uid;
    } catch (_) {
      return _currentAppUserId;
    }
  }

  /// Initializes the mobile billing client with RevenueCat configuration.
  /// Binds the session to the current Firebase Auth UID.
  static Future<void> init({BuildContext? context, String? userId}) async {
    String? uid = userId;
    if (uid == null) {
      try {
        uid = FirebaseAuth.instance.currentUser?.uid;
      } catch (_) {
        // Firebase not initialized in tests or offline
      }
    }
    _currentAppUserId = uid;

    debugPrint('MobileBillingService: Initializing for mobile store with UID: $uid');

    // Ready for RevenueCat:
    // await Purchases.setLogLevel(LogLevel.debug);
    // PurchasesConfiguration configuration = PurchasesConfiguration(<PUBLIC_SDK_KEY>);
    // if (uid != null) {
    //   configuration.appUserID = uid;
    // }
    // await Purchases.configure(configuration);

    _initialized = true;
  }

  /// Fetches price data for display.
  /// Provides sensible fallback prices so mobile UI renders cleanly ($36.90/yr, $69.99/yr, etc.)
  /// until live Google Play / Apple Store offerings are fetched via RevenueCat.
  static Future<PriceData?> getPrice(
    String priceId, {
    String? currencyCode,
    String? countryCode,
  }) async {
    final currency = currencyCode ?? 'USD';

    // Ready for RevenueCat:
    // try {
    //   final offerings = await Purchases.getOfferings();
    //   final package = offerings.current?.availablePackages.firstWhere(
    //     (p) => p.storeProduct.identifier == priceId,
    //     orElse: () => null,
    //   );
    //   if (package != null) {
    //     return PriceData(
    //       formattedPrice: package.storeProduct.priceString,
    //       currencyCode: package.storeProduct.currencyCode,
    //     );
    //   }
    // } catch (e) {
    //   debugPrint('RevenueCat getOfferings error: $e');
    // }

    // Fallback display prices using AppConfig as single source of truth:
    if (priceId == AppConfig.kStandardAnnual) {
      final amount = AppConfig.standardAnnual[currency] ?? 36.90;
      return PriceData(formattedPrice: AppConfig.formatPrice(amount, currency), currencyCode: currency);
    } else if (priceId == AppConfig.kStandardMonthly) {
      final amount = AppConfig.standardMonthly[currency] ?? 3.69;
      return PriceData(formattedPrice: AppConfig.formatPrice(amount, currency), currencyCode: currency);
    } else if (priceId == AppConfig.kPremiumAnnual) {
      final amount = AppConfig.premiumAnnual[currency] ?? 69.99;
      return PriceData(formattedPrice: AppConfig.formatPrice(amount, currency), currencyCode: currency);
    } else if (priceId == AppConfig.kPremiumMonthly) {
      final amount = AppConfig.premiumMonthly[currency] ?? 6.99;
      return PriceData(formattedPrice: AppConfig.formatPrice(amount, currency), currencyCode: currency);
    } else if (priceId == AppConfig.kKanjiLiar) {
      final amount = AppConfig.kanjiLiarPrice[currency] ?? 6.99;
      return PriceData(formattedPrice: AppConfig.formatPrice(amount, currency), currencyCode: currency);
    } else {
      return PriceData(formattedPrice: '\$9.99', currencyCode: currency);
    }
  }

  /// Initiates native In-App Purchase checkout flow tied to Firebase Auth UID.
  static Future<void> openCheckout({
    required String priceId,
    String? email,
    String? userId,
    String? currencyCode,
    String? countryCode,
    BuildContext? context,
  }) async {
    final uid = userId ?? FirebaseAuth.instance.currentUser?.uid ?? _currentAppUserId;
    debugPrint(
      'MobileBillingService: Starting checkout for priceId: $priceId, UID: $uid, email: $email',
    );

    // Ready for RevenueCat:
    // try {
    //   if (uid != null) {
    //     await Purchases.logIn(uid);
    //   }
    //   final offerings = await Purchases.getOfferings();
    //   final package = offerings.current?.getPackage(priceId);
    //   if (package != null) {
    //     final customerInfo = await Purchases.purchasePackage(package);
    //     if (customerInfo.entitlements.all['pro']?.isActive == true) {
    //       if (context != null && context.mounted) {
    //         Navigator.of(context, rootNavigator: true).pushNamed('/welcome');
    //       }
    //     }
    //   }
    // } catch (e) {
    //   debugPrint('MobileBillingService purchase error: $e');
    // }

    if (context != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Mobile in-app purchase initialized for $priceId (User: ${uid ?? "Guest"})',
          ),
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  static bool get isInitialized => _initialized;
}
