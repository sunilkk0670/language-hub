// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ai_tutor_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AITutorResponseImpl _$$AITutorResponseImplFromJson(
        Map<String, dynamic> json) =>
    _$AITutorResponseImpl(
      content: json['content'] as String,
      relatedVocabulary: (json['relatedVocabulary'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      cefrLevel: json['cefrLevel'] as String?,
      functionCallResult: json['functionCallResult'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$$AITutorResponseImplToJson(
        _$AITutorResponseImpl instance) =>
    <String, dynamic>{
      'content': instance.content,
      'relatedVocabulary': instance.relatedVocabulary,
      'cefrLevel': instance.cefrLevel,
      'functionCallResult': instance.functionCallResult,
    };
