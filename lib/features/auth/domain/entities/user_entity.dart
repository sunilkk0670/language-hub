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
    String? planExpiresAt,
  }) = _UserEntity;

  /// Whether the subscription period has expired based on [planExpiresAt].
  bool get isPlanExpired {
    if (planExpiresAt == null || planExpiresAt!.isEmpty) return false;
    try {
      final expiry = DateTime.parse(planExpiresAt!);
      return DateTime.now().toUtc().isAfter(expiry);
    } catch (_) {
      return false;
    }
  }

  /// Whether the user has an active Pro / paid plan.
  bool get hasActivePro {
    if (isPlanExpired) return false;
    return effectiveTier != 'free';
  }

  /// Effective subscription tier: 'free', 'standard', or 'premium'.
  /// Fallback for legacy subscribers: if [isPro] is true and [subscriptionTier] is missing or 'free',
  /// treat as 'premium' so legacy paying subscribers are never downgraded.
  /// If [planExpiresAt] is present and in the past, treats subscription as expired ('free').
  String get effectiveTier {
    if (isPlanExpired) return 'free';

    final tier = subscriptionTier.toLowerCase();
    if (tier == 'premium') return 'premium';
    if (tier == 'standard') return 'standard';
    if (isPro) return 'premium'; // Legacy fallback: treated as premium so never downgraded
    return 'free';
  }
}
