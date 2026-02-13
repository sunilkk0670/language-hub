import 'package:freezed_annotation/freezed_annotation.dart';

part 'ai_tutor_response.freezed.dart';
part 'ai_tutor_response.g.dart';

@freezed
class AITutorResponse with _$AITutorResponse {
  const factory AITutorResponse({
    required String content,
    List<String>? relatedVocabulary,
    String? cefrLevel,
    Map<String, dynamic>? functionCallResult,
  }) = _AITutorResponse;

  factory AITutorResponse.fromJson(Map<String, dynamic> json) =>
      _$AITutorResponseFromJson(json);
}
