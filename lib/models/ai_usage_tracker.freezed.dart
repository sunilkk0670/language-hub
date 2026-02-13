// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'ai_usage_tracker.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

AIUsageTracker _$AIUsageTrackerFromJson(Map<String, dynamic> json) {
  return _AIUsageTracker.fromJson(json);
}

/// @nodoc
mixin _$AIUsageTracker {
  String get userId => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  int get requestCount => throw _privateConstructorUsedError;
  int get dailyLimit => throw _privateConstructorUsedError;

  /// Serializes this AIUsageTracker to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AIUsageTracker
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AIUsageTrackerCopyWith<AIUsageTracker> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AIUsageTrackerCopyWith<$Res> {
  factory $AIUsageTrackerCopyWith(
          AIUsageTracker value, $Res Function(AIUsageTracker) then) =
      _$AIUsageTrackerCopyWithImpl<$Res, AIUsageTracker>;
  @useResult
  $Res call({String userId, DateTime date, int requestCount, int dailyLimit});
}

/// @nodoc
class _$AIUsageTrackerCopyWithImpl<$Res, $Val extends AIUsageTracker>
    implements $AIUsageTrackerCopyWith<$Res> {
  _$AIUsageTrackerCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AIUsageTracker
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? date = null,
    Object? requestCount = null,
    Object? dailyLimit = null,
  }) {
    return _then(_value.copyWith(
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      requestCount: null == requestCount
          ? _value.requestCount
          : requestCount // ignore: cast_nullable_to_non_nullable
              as int,
      dailyLimit: null == dailyLimit
          ? _value.dailyLimit
          : dailyLimit // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AIUsageTrackerImplCopyWith<$Res>
    implements $AIUsageTrackerCopyWith<$Res> {
  factory _$$AIUsageTrackerImplCopyWith(_$AIUsageTrackerImpl value,
          $Res Function(_$AIUsageTrackerImpl) then) =
      __$$AIUsageTrackerImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String userId, DateTime date, int requestCount, int dailyLimit});
}

/// @nodoc
class __$$AIUsageTrackerImplCopyWithImpl<$Res>
    extends _$AIUsageTrackerCopyWithImpl<$Res, _$AIUsageTrackerImpl>
    implements _$$AIUsageTrackerImplCopyWith<$Res> {
  __$$AIUsageTrackerImplCopyWithImpl(
      _$AIUsageTrackerImpl _value, $Res Function(_$AIUsageTrackerImpl) _then)
      : super(_value, _then);

  /// Create a copy of AIUsageTracker
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? date = null,
    Object? requestCount = null,
    Object? dailyLimit = null,
  }) {
    return _then(_$AIUsageTrackerImpl(
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      requestCount: null == requestCount
          ? _value.requestCount
          : requestCount // ignore: cast_nullable_to_non_nullable
              as int,
      dailyLimit: null == dailyLimit
          ? _value.dailyLimit
          : dailyLimit // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AIUsageTrackerImpl implements _AIUsageTracker {
  const _$AIUsageTrackerImpl(
      {required this.userId,
      required this.date,
      required this.requestCount,
      this.dailyLimit = 50});

  factory _$AIUsageTrackerImpl.fromJson(Map<String, dynamic> json) =>
      _$$AIUsageTrackerImplFromJson(json);

  @override
  final String userId;
  @override
  final DateTime date;
  @override
  final int requestCount;
  @override
  @JsonKey()
  final int dailyLimit;

  @override
  String toString() {
    return 'AIUsageTracker(userId: $userId, date: $date, requestCount: $requestCount, dailyLimit: $dailyLimit)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AIUsageTrackerImpl &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.requestCount, requestCount) ||
                other.requestCount == requestCount) &&
            (identical(other.dailyLimit, dailyLimit) ||
                other.dailyLimit == dailyLimit));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, userId, date, requestCount, dailyLimit);

  /// Create a copy of AIUsageTracker
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AIUsageTrackerImplCopyWith<_$AIUsageTrackerImpl> get copyWith =>
      __$$AIUsageTrackerImplCopyWithImpl<_$AIUsageTrackerImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AIUsageTrackerImplToJson(
      this,
    );
  }
}

abstract class _AIUsageTracker implements AIUsageTracker {
  const factory _AIUsageTracker(
      {required final String userId,
      required final DateTime date,
      required final int requestCount,
      final int dailyLimit}) = _$AIUsageTrackerImpl;

  factory _AIUsageTracker.fromJson(Map<String, dynamic> json) =
      _$AIUsageTrackerImpl.fromJson;

  @override
  String get userId;
  @override
  DateTime get date;
  @override
  int get requestCount;
  @override
  int get dailyLimit;

  /// Create a copy of AIUsageTracker
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AIUsageTrackerImplCopyWith<_$AIUsageTrackerImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
