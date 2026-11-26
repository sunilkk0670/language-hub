import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_entity.freezed.dart';

@freezed
class UserEntity with _$UserEntity {
  const UserEntity._();

  const factory UserEntity({
    required String uid,
    required String email,
    String? displayName,
    @Default(false) bool isPro,
    @Default('free') String subscriptionTier,
    @Default(false) bool hasKanjiLiar,
    String? subscriptionId,
    String? subscriptionStatus,
  }) = _UserEntity;

  /// Effective subscription tier: 'free', 'standard', or 'premium'.
  /// Fallback for legacy subscribers: if [isPro] is true and [subscriptionTier] is missing or 'free',
  /// treat as 'standard'.
  String get effectiveTier {
    final tier = subscriptionTier.toLowerCase();
    if (tier == 'premium') return 'premium';
    if (tier == 'standard') return 'standard';
    if (isPro) return 'standard';
    return 'free';
  }
}
