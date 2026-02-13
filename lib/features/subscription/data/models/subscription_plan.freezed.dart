// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'subscription_plan.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

SubscriptionPlan _$SubscriptionPlanFromJson(Map<String, dynamic> json) {
  return _SubscriptionPlan.fromJson(json);
}

/// @nodoc
mixin _$SubscriptionPlan {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  Map<String, double> get monthlyPricing =>
      throw _privateConstructorUsedError; // Localized pricing: {'USD': 12.99, 'EUR': 12.99, 'INR': 199}
  Map<String, double> get annualPricing =>
      throw _privateConstructorUsedError; // Localized pricing: {'USD': 89.99, 'EUR': 89.99, 'INR': 999}
  List<String> get features => throw _privateConstructorUsedError;
  String get differentiator => throw _privateConstructorUsedError;
  String get depth => throw _privateConstructorUsedError;
  int get wordCount => throw _privateConstructorUsedError;
  bool get isAdSupported => throw _privateConstructorUsedError;
  bool get hasOfflineMode => throw _privateConstructorUsedError;
  bool get isMostPopular => throw _privateConstructorUsedError;

  /// Serializes this SubscriptionPlan to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SubscriptionPlanCopyWith<SubscriptionPlan> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SubscriptionPlanCopyWith<$Res> {
  factory $SubscriptionPlanCopyWith(
          SubscriptionPlan value, $Res Function(SubscriptionPlan) then) =
      _$SubscriptionPlanCopyWithImpl<$Res, SubscriptionPlan>;
  @useResult
  $Res call(
      {String id,
      String name,
      String description,
      Map<String, double> monthlyPricing,
      Map<String, double> annualPricing,
      List<String> features,
      String differentiator,
      String depth,
      int wordCount,
      bool isAdSupported,
      bool hasOfflineMode,
      bool isMostPopular});
}

/// @nodoc
class _$SubscriptionPlanCopyWithImpl<$Res, $Val extends SubscriptionPlan>
    implements $SubscriptionPlanCopyWith<$Res> {
  _$SubscriptionPlanCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = null,
    Object? monthlyPricing = null,
    Object? annualPricing = null,
    Object? features = null,
    Object? differentiator = null,
    Object? depth = null,
    Object? wordCount = null,
    Object? isAdSupported = null,
    Object? hasOfflineMode = null,
    Object? isMostPopular = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      monthlyPricing: null == monthlyPricing
          ? _value.monthlyPricing
          : monthlyPricing // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      annualPricing: null == annualPricing
          ? _value.annualPricing
          : annualPricing // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      features: null == features
          ? _value.features
          : features // ignore: cast_nullable_to_non_nullable
              as List<String>,
      differentiator: null == differentiator
          ? _value.differentiator
          : differentiator // ignore: cast_nullable_to_non_nullable
              as String,
      depth: null == depth
          ? _value.depth
          : depth // ignore: cast_nullable_to_non_nullable
              as String,
      wordCount: null == wordCount
          ? _value.wordCount
          : wordCount // ignore: cast_nullable_to_non_nullable
              as int,
      isAdSupported: null == isAdSupported
          ? _value.isAdSupported
          : isAdSupported // ignore: cast_nullable_to_non_nullable
              as bool,
      hasOfflineMode: null == hasOfflineMode
          ? _value.hasOfflineMode
          : hasOfflineMode // ignore: cast_nullable_to_non_nullable
              as bool,
      isMostPopular: null == isMostPopular
          ? _value.isMostPopular
          : isMostPopular // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SubscriptionPlanImplCopyWith<$Res>
    implements $SubscriptionPlanCopyWith<$Res> {
  factory _$$SubscriptionPlanImplCopyWith(_$SubscriptionPlanImpl value,
          $Res Function(_$SubscriptionPlanImpl) then) =
      __$$SubscriptionPlanImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String description,
      Map<String, double> monthlyPricing,
      Map<String, double> annualPricing,
      List<String> features,
      String differentiator,
      String depth,
      int wordCount,
      bool isAdSupported,
      bool hasOfflineMode,
      bool isMostPopular});
}

/// @nodoc
class __$$SubscriptionPlanImplCopyWithImpl<$Res>
    extends _$SubscriptionPlanCopyWithImpl<$Res, _$SubscriptionPlanImpl>
    implements _$$SubscriptionPlanImplCopyWith<$Res> {
  __$$SubscriptionPlanImplCopyWithImpl(_$SubscriptionPlanImpl _value,
      $Res Function(_$SubscriptionPlanImpl) _then)
      : super(_value, _then);

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = null,
    Object? monthlyPricing = null,
    Object? annualPricing = null,
    Object? features = null,
    Object? differentiator = null,
    Object? depth = null,
    Object? wordCount = null,
    Object? isAdSupported = null,
    Object? hasOfflineMode = null,
    Object? isMostPopular = null,
  }) {
    return _then(_$SubscriptionPlanImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      monthlyPricing: null == monthlyPricing
          ? _value._monthlyPricing
          : monthlyPricing // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      annualPricing: null == annualPricing
          ? _value._annualPricing
          : annualPricing // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      features: null == features
          ? _value._features
          : features // ignore: cast_nullable_to_non_nullable
              as List<String>,
      differentiator: null == differentiator
          ? _value.differentiator
          : differentiator // ignore: cast_nullable_to_non_nullable
              as String,
      depth: null == depth
          ? _value.depth
          : depth // ignore: cast_nullable_to_non_nullable
              as String,
      wordCount: null == wordCount
          ? _value.wordCount
          : wordCount // ignore: cast_nullable_to_non_nullable
              as int,
      isAdSupported: null == isAdSupported
          ? _value.isAdSupported
          : isAdSupported // ignore: cast_nullable_to_non_nullable
              as bool,
      hasOfflineMode: null == hasOfflineMode
          ? _value.hasOfflineMode
          : hasOfflineMode // ignore: cast_nullable_to_non_nullable
              as bool,
      isMostPopular: null == isMostPopular
          ? _value.isMostPopular
          : isMostPopular // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SubscriptionPlanImpl implements _SubscriptionPlan {
  const _$SubscriptionPlanImpl(
      {required this.id,
      required this.name,
      required this.description,
      required final Map<String, double> monthlyPricing,
      required final Map<String, double> annualPricing,
      required final List<String> features,
      required this.differentiator,
      required this.depth,
      required this.wordCount,
      required this.isAdSupported,
      required this.hasOfflineMode,
      this.isMostPopular = false})
      : _monthlyPricing = monthlyPricing,
        _annualPricing = annualPricing,
        _features = features;

  factory _$SubscriptionPlanImpl.fromJson(Map<String, dynamic> json) =>
      _$$SubscriptionPlanImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String description;
  final Map<String, double> _monthlyPricing;
  @override
  Map<String, double> get monthlyPricing {
    if (_monthlyPricing is EqualUnmodifiableMapView) return _monthlyPricing;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_monthlyPricing);
  }

// Localized pricing: {'USD': 12.99, 'EUR': 12.99, 'INR': 199}
  final Map<String, double> _annualPricing;
// Localized pricing: {'USD': 12.99, 'EUR': 12.99, 'INR': 199}
  @override
  Map<String, double> get annualPricing {
    if (_annualPricing is EqualUnmodifiableMapView) return _annualPricing;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_annualPricing);
  }

// Localized pricing: {'USD': 89.99, 'EUR': 89.99, 'INR': 999}
  final List<String> _features;
// Localized pricing: {'USD': 89.99, 'EUR': 89.99, 'INR': 999}
  @override
  List<String> get features {
    if (_features is EqualUnmodifiableListView) return _features;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_features);
  }

  @override
  final String differentiator;
  @override
  final String depth;
  @override
  final int wordCount;
  @override
  final bool isAdSupported;
  @override
  final bool hasOfflineMode;
  @override
  @JsonKey()
  final bool isMostPopular;

  @override
  String toString() {
    return 'SubscriptionPlan(id: $id, name: $name, description: $description, monthlyPricing: $monthlyPricing, annualPricing: $annualPricing, features: $features, differentiator: $differentiator, depth: $depth, wordCount: $wordCount, isAdSupported: $isAdSupported, hasOfflineMode: $hasOfflineMode, isMostPopular: $isMostPopular)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SubscriptionPlanImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            const DeepCollectionEquality()
                .equals(other._monthlyPricing, _monthlyPricing) &&
            const DeepCollectionEquality()
                .equals(other._annualPricing, _annualPricing) &&
            const DeepCollectionEquality().equals(other._features, _features) &&
            (identical(other.differentiator, differentiator) ||
                other.differentiator == differentiator) &&
            (identical(other.depth, depth) || other.depth == depth) &&
            (identical(other.wordCount, wordCount) ||
                other.wordCount == wordCount) &&
            (identical(other.isAdSupported, isAdSupported) ||
                other.isAdSupported == isAdSupported) &&
            (identical(other.hasOfflineMode, hasOfflineMode) ||
                other.hasOfflineMode == hasOfflineMode) &&
            (identical(other.isMostPopular, isMostPopular) ||
                other.isMostPopular == isMostPopular));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      description,
      const DeepCollectionEquality().hash(_monthlyPricing),
      const DeepCollectionEquality().hash(_annualPricing),
      const DeepCollectionEquality().hash(_features),
      differentiator,
      depth,
      wordCount,
      isAdSupported,
      hasOfflineMode,
      isMostPopular);

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SubscriptionPlanImplCopyWith<_$SubscriptionPlanImpl> get copyWith =>
      __$$SubscriptionPlanImplCopyWithImpl<_$SubscriptionPlanImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SubscriptionPlanImplToJson(
      this,
    );
  }
}

abstract class _SubscriptionPlan implements SubscriptionPlan {
  const factory _SubscriptionPlan(
      {required final String id,
      required final String name,
      required final String description,
      required final Map<String, double> monthlyPricing,
      required final Map<String, double> annualPricing,
      required final List<String> features,
      required final String differentiator,
      required final String depth,
      required final int wordCount,
      required final bool isAdSupported,
      required final bool hasOfflineMode,
      final bool isMostPopular}) = _$SubscriptionPlanImpl;

  factory _SubscriptionPlan.fromJson(Map<String, dynamic> json) =
      _$SubscriptionPlanImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get description;
  @override
  Map<String, double>
      get monthlyPricing; // Localized pricing: {'USD': 12.99, 'EUR': 12.99, 'INR': 199}
  @override
  Map<String, double>
      get annualPricing; // Localized pricing: {'USD': 89.99, 'EUR': 89.99, 'INR': 999}
  @override
  List<String> get features;
  @override
  String get differentiator;
  @override
  String get depth;
  @override
  int get wordCount;
  @override
  bool get isAdSupported;
  @override
  bool get hasOfflineMode;
  @override
  bool get isMostPopular;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SubscriptionPlanImplCopyWith<_$SubscriptionPlanImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
