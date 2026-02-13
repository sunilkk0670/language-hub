import 'package:freezed_annotation/freezed_annotation.dart';

part 'ai_usage_tracker.freezed.dart';
part 'ai_usage_tracker.g.dart';

@freezed
class AIUsageTracker with _$AIUsageTracker {
  const factory AIUsageTracker({
    required String userId,
    required DateTime date,
    required int requestCount,
    @Default(50) int dailyLimit,
  }) = _AIUsageTracker;

  factory AIUsageTracker.fromJson(Map<String, dynamic> json) =>
      _$AIUsageTrackerFromJson(json);
}
