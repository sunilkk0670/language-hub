// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ai_usage_tracker.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AIUsageTrackerImpl _$$AIUsageTrackerImplFromJson(Map<String, dynamic> json) =>
    _$AIUsageTrackerImpl(
      userId: json['userId'] as String,
      date: DateTime.parse(json['date'] as String),
      requestCount: (json['requestCount'] as num).toInt(),
      dailyLimit: (json['dailyLimit'] as num?)?.toInt() ?? 50,
    );

Map<String, dynamic> _$$AIUsageTrackerImplToJson(
        _$AIUsageTrackerImpl instance) =>
    <String, dynamic>{
      'userId': instance.userId,
      'date': instance.date.toIso8601String(),
      'requestCount': instance.requestCount,
      'dailyLimit': instance.dailyLimit,
    };
