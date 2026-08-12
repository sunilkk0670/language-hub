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

extension type PaddlePricePreviewRequest._(JSObject _) implements JSObject {
  external factory PaddlePricePreviewRequest({
    JSArray<PaddleItem> items,
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

class PaddleService {
  static bool _initialized = false;

  static void init(BuildContext context) {
    if (!kIsWeb || _initialized) return;
    const token = String.fromEnvironment('PADDLE_CLIENT_TOKEN');
    if (token.isEmpty) {
      debugPrint("PADDLE_CLIENT_TOKEN is not set. Paddle will not initialize. Please set it using --dart-define=PADDLE_CLIENT_TOKEN=test_...");
      return;
    }

    _paddle?.Environment.set('sandbox');
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
  
  static Future<String?> getPrice(String priceId) async {
    if (!kIsWeb || _paddle == null) return null;
    
    try {
      final request = PaddlePricePreviewRequest(
        items: [PaddleItem(priceId: priceId, quantity: 1)].toJS,
      );
      
      final response = await _paddle!.PricePreview(request).toDart;
      final lineItems = response.data.details.lineItems.toDart;
      if (lineItems.isNotEmpty) {
        return lineItems.first.formattedTotals.total;
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
  }) {
    if (!kIsWeb || _paddle == null) return;
    
    final options = JSObject();
    
    final item = JSObject();
    item['priceId'] = priceId.toJS;
    item['quantity'] = 1.toJS;
    options['items'] = [item].toJS;
    
    final settings = JSObject();
    settings['displayMode'] = 'overlay'.toJS;
    settings['theme'] = 'dark'.toJS;
    options['settings'] = settings;
    
    if (email != null) {
      final customer = JSObject();
      customer['email'] = email.toJS;
      options['customer'] = customer;
    }
    
    if (userId != null) {
      final customData = JSObject();
      customData['userId'] = userId.toJS;
      options['customData'] = customData;
    }
    
    _paddle!.Checkout.open(options as PaddleCheckoutOpenOptions);
  }
}
