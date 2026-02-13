// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'ai_tutor_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

AITutorResponse _$AITutorResponseFromJson(Map<String, dynamic> json) {
  return _AITutorResponse.fromJson(json);
}

/// @nodoc
mixin _$AITutorResponse {
  String get content => throw _privateConstructorUsedError;
  List<String>? get relatedVocabulary => throw _privateConstructorUsedError;
  String? get cefrLevel => throw _privateConstructorUsedError;
  Map<String, dynamic>? get functionCallResult =>
      throw _privateConstructorUsedError;

  /// Serializes this AITutorResponse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AITutorResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AITutorResponseCopyWith<AITutorResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AITutorResponseCopyWith<$Res> {
  factory $AITutorResponseCopyWith(
          AITutorResponse value, $Res Function(AITutorResponse) then) =
      _$AITutorResponseCopyWithImpl<$Res, AITutorResponse>;
  @useResult
  $Res call(
      {String content,
      List<String>? relatedVocabulary,
      String? cefrLevel,
      Map<String, dynamic>? functionCallResult});
}

/// @nodoc
class _$AITutorResponseCopyWithImpl<$Res, $Val extends AITutorResponse>
    implements $AITutorResponseCopyWith<$Res> {
  _$AITutorResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AITutorResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? content = null,
    Object? relatedVocabulary = freezed,
    Object? cefrLevel = freezed,
    Object? functionCallResult = freezed,
  }) {
    return _then(_value.copyWith(
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      relatedVocabulary: freezed == relatedVocabulary
          ? _value.relatedVocabulary
          : relatedVocabulary // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      cefrLevel: freezed == cefrLevel
          ? _value.cefrLevel
          : cefrLevel // ignore: cast_nullable_to_non_nullable
              as String?,
      functionCallResult: freezed == functionCallResult
          ? _value.functionCallResult
          : functionCallResult // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AITutorResponseImplCopyWith<$Res>
    implements $AITutorResponseCopyWith<$Res> {
  factory _$$AITutorResponseImplCopyWith(_$AITutorResponseImpl value,
          $Res Function(_$AITutorResponseImpl) then) =
      __$$AITutorResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String content,
      List<String>? relatedVocabulary,
      String? cefrLevel,
      Map<String, dynamic>? functionCallResult});
}

/// @nodoc
class __$$AITutorResponseImplCopyWithImpl<$Res>
    extends _$AITutorResponseCopyWithImpl<$Res, _$AITutorResponseImpl>
    implements _$$AITutorResponseImplCopyWith<$Res> {
  __$$AITutorResponseImplCopyWithImpl(
      _$AITutorResponseImpl _value, $Res Function(_$AITutorResponseImpl) _then)
      : super(_value, _then);

  /// Create a copy of AITutorResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? content = null,
    Object? relatedVocabulary = freezed,
    Object? cefrLevel = freezed,
    Object? functionCallResult = freezed,
  }) {
    return _then(_$AITutorResponseImpl(
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      relatedVocabulary: freezed == relatedVocabulary
          ? _value._relatedVocabulary
          : relatedVocabulary // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      cefrLevel: freezed == cefrLevel
          ? _value.cefrLevel
          : cefrLevel // ignore: cast_nullable_to_non_nullable
              as String?,
      functionCallResult: freezed == functionCallResult
          ? _value._functionCallResult
          : functionCallResult // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AITutorResponseImpl implements _AITutorResponse {
  const _$AITutorResponseImpl(
      {required this.content,
      final List<String>? relatedVocabulary,
      this.cefrLevel,
      final Map<String, dynamic>? functionCallResult})
      : _relatedVocabulary = relatedVocabulary,
        _functionCallResult = functionCallResult;

  factory _$AITutorResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$AITutorResponseImplFromJson(json);

  @override
  final String content;
  final List<String>? _relatedVocabulary;
  @override
  List<String>? get relatedVocabulary {
    final value = _relatedVocabulary;
    if (value == null) return null;
    if (_relatedVocabulary is EqualUnmodifiableListView)
      return _relatedVocabulary;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? cefrLevel;
  final Map<String, dynamic>? _functionCallResult;
  @override
  Map<String, dynamic>? get functionCallResult {
    final value = _functionCallResult;
    if (value == null) return null;
    if (_functionCallResult is EqualUnmodifiableMapView)
      return _functionCallResult;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'AITutorResponse(content: $content, relatedVocabulary: $relatedVocabulary, cefrLevel: $cefrLevel, functionCallResult: $functionCallResult)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AITutorResponseImpl &&
            (identical(other.content, content) || other.content == content) &&
            const DeepCollectionEquality()
                .equals(other._relatedVocabulary, _relatedVocabulary) &&
            (identical(other.cefrLevel, cefrLevel) ||
                other.cefrLevel == cefrLevel) &&
            const DeepCollectionEquality()
                .equals(other._functionCallResult, _functionCallResult));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      content,
      const DeepCollectionEquality().hash(_relatedVocabulary),
      cefrLevel,
      const DeepCollectionEquality().hash(_functionCallResult));

  /// Create a copy of AITutorResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AITutorResponseImplCopyWith<_$AITutorResponseImpl> get copyWith =>
      __$$AITutorResponseImplCopyWithImpl<_$AITutorResponseImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AITutorResponseImplToJson(
      this,
    );
  }
}

abstract class _AITutorResponse implements AITutorResponse {
  const factory _AITutorResponse(
      {required final String content,
      final List<String>? relatedVocabulary,
      final String? cefrLevel,
      final Map<String, dynamic>? functionCallResult}) = _$AITutorResponseImpl;

  factory _AITutorResponse.fromJson(Map<String, dynamic> json) =
      _$AITutorResponseImpl.fromJson;

  @override
  String get content;
  @override
  List<String>? get relatedVocabulary;
  @override
  String? get cefrLevel;
  @override
  Map<String, dynamic>? get functionCallResult;

  /// Create a copy of AITutorResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AITutorResponseImplCopyWith<_$AITutorResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
