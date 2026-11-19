import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

@JS('Paddle')
external PaddleJS? get _paddle;

extension type PaddleJS(JSObject _) implements JSObject {
  external PaddleEnvironment get Environment;
  external void Initialize(PaddleInitOptions options);
  external JSPromise<PaddlePricePreviewResponse> PricePreview(PaddlePricePreviewRequest request);
  external PaddleCheckout get Checkout;
}

extension type PaddleEnvironment(JSObject _) implements JSObject {
  external void set(String env);
}

extension type PaddleInitOptions._(JSObject _) implements JSObject {
  external factory PaddleInitOptions({
    String token,
    JSFunction eventCallback,
  });
}

extension type PaddleAddress._(JSObject _) implements JSObject {
  external factory PaddleAddress({
    String countryCode,
  });
}

extension type PaddlePricePreviewRequest._(JSObject _) implements JSObject {
  external factory PaddlePricePreviewRequest({
    JSArray<PaddleItem> items,
    String? currencyCode,
    PaddleAddress? address,
  });
}

extension type PaddleItem._(JSObject _) implements JSObject {
  external factory PaddleItem({
    String priceId,
    int quantity,
  });
}

extension type PaddlePricePreviewResponse(JSObject _) implements JSObject {
  external PaddlePricePreviewData get data;
}

extension type PaddlePricePreviewData(JSObject _) implements JSObject {
  external PaddlePricePreviewDetails get details;
  external String get currencyCode;
}

extension type PaddlePricePreviewDetails(JSObject _) implements JSObject {
  external JSArray<PaddleLineItem> get lineItems;
}

extension type PaddleLineItem(JSObject _) implements JSObject {
  external PaddleFormattedTotals get formattedTotals;
}

extension type PaddleFormattedTotals(JSObject _) implements JSObject {
  external String get total;
}

extension type PaddleCheckout(JSObject _) implements JSObject {
  external void open(PaddleCheckoutOpenOptions options);
}

extension type PaddleCheckoutOpenOptions._(JSObject _) implements JSObject {
  external factory PaddleCheckoutOpenOptions({
    JSArray<PaddleItem> items,
    PaddleCheckoutSettings settings,
    PaddleCustomer? customer,
    JSObject? customData,
    String? currencyCode,
  });
}

extension type PaddleCheckoutSettings._(JSObject _) implements JSObject {
  external factory PaddleCheckoutSettings({
    String? displayMode,
    String? theme,
    String? locale,
    String? successUrl,
  });
}

extension type PaddleCustomer._(JSObject _) implements JSObject {
  external factory PaddleCustomer({
    String email,
  });
}

class PriceData {
  final String formattedPrice;
  final String currencyCode;

  PriceData({required this.formattedPrice, required this.currencyCode});
}

class PaddleService {
  static bool _initialized = false;

  static void init(BuildContext context) {
    if (!kIsWeb || _initialized) return;
    var token = const String.fromEnvironment('PADDLE_CLIENT_TOKEN');
    if (token.isEmpty) {
      token = 'live_29cb72fd620e6a711753029ed6d';
    }

    if (token.startsWith('test_')) {
      _paddle?.Environment.set('sandbox');
    }
    _paddle?.Initialize(PaddleInitOptions(
      token: token,
      eventCallback: ((JSObject event) {
        final name = event['name'] as JSString?;
        if (name != null && name.toDart == 'checkout.completed') {
          // Navigate to /welcome via client-side routing
          Navigator.of(context, rootNavigator: true).pushNamed('/welcome');
        }
      }).toJS,
    ));
    _initialized = true;
  }
  
  static Future<PriceData?> getPrice(String priceId, {String? currencyCode, String? countryCode}) async {
    if (!kIsWeb || _paddle == null) return null;
    
    try {
      final request = JSObject();
      
      final item = JSObject();
      item['priceId'] = priceId.toJS;
      item['quantity'] = 1.toJS;
      request['items'] = [item].toJS;

      if (currencyCode != null) {
        request['currencyCode'] = currencyCode.toJS;
      }
      
      if (countryCode != null) {
        final address = JSObject();
        address['countryCode'] = countryCode.toJS;
        request['address'] = address;
      }
      
      final response = await _paddle!.PricePreview(request as PaddlePricePreviewRequest).toDart;
      final lineItems = response.data.details.lineItems.toDart;
      if (lineItems.isNotEmpty) {
        return PriceData(
          formattedPrice: lineItems.first.formattedTotals.total,
          currencyCode: response.data.currencyCode,
        );
      }
    } catch (e) {
      debugPrint("Paddle PricePreview Error: $e");
    }
    return null;
  }
  
  static void openCheckout({
    required String priceId,
    String? email,
    String? userId,
    String? currencyCode,
    String? countryCode,
    BuildContext? context,
  }) {
    if (!kIsWeb || _paddle == null) return;

    try {
      final options = JSObject();

      // Construct items array
      final item = JSObject();
      item['priceId'] = priceId.toJS;
      item['quantity'] = 1.toJS;
      options['items'] = [item].toJS;

      // Attach customer info only if provided and non-empty
      if (email != null && email.isNotEmpty) {
        final customer = JSObject();
        customer['email'] = email.toJS;
        options['customer'] = customer;
      }

      // Attach custom data only if provided and non-empty
      if (userId != null && userId.isNotEmpty) {
        final customData = JSObject();
        customData['userId'] = userId.toJS;
        options['customData'] = customData;
      }

      debugPrint('Calling Paddle.Checkout.open with priceId: $priceId, email: $email, userId: $userId');

      _paddle!.Checkout.open(options as PaddleCheckoutOpenOptions);
    } catch (e) {
      debugPrint('Error opening Paddle checkout: $e');
    }
  }
}
