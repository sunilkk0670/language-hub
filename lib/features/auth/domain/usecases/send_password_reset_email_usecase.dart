import '../repositories/auth_repository.dart';

class SendPasswordResetEmailUseCase {
  final AuthRepository _repository;

  SendPasswordResetEmailUseCase(this._repository);

  Future<void> call(String email) async {
    if (email.isEmpty) {
      throw Exception('Email cannot be empty');
    }
    
    return await _repository.sendPasswordResetEmail(email);
  }
}
