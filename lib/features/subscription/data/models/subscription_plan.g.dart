// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_plan.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SubscriptionPlanImpl _$$SubscriptionPlanImplFromJson(
        Map<String, dynamic> json) =>
    _$SubscriptionPlanImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      monthlyPricing: (json['monthlyPricing'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      annualPricing: (json['annualPricing'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      features:
          (json['features'] as List<dynamic>).map((e) => e as String).toList(),
      differentiator: json['differentiator'] as String,
      depth: json['depth'] as String,
      wordCount: (json['wordCount'] as num).toInt(),
      isAdSupported: json['isAdSupported'] as bool,
      hasOfflineMode: json['hasOfflineMode'] as bool,
      isMostPopular: json['isMostPopular'] as bool? ?? false,
    );

Map<String, dynamic> _$$SubscriptionPlanImplToJson(
        _$SubscriptionPlanImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'monthlyPricing': instance.monthlyPricing,
      'annualPricing': instance.annualPricing,
      'features': instance.features,
      'differentiator': instance.differentiator,
      'depth': instance.depth,
      'wordCount': instance.wordCount,
      'isAdSupported': instance.isAdSupported,
      'hasOfflineMode': instance.hasOfflineMode,
      'isMostPopular': instance.isMostPopular,
    };
