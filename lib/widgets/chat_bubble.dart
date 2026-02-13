import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../models/chat_message.dart';
import '../features/curriculum/presentation/services/tts_service.dart' as tts;

class ChatBubble extends StatelessWidget {
  final ChatMessage message;
  final String? languageCode; // For TTS
  final VoidCallback? onSpeak; // Optional custom speak handler

  const ChatBubble({
    required this.message,
    this.languageCode,
    this.onSpeak,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: message.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        padding: const EdgeInsets.all(12),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: message.isUser
              ? Theme.of(context).colorScheme.primaryContainer
              : Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(16),
        ),
        child: message.isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: MarkdownBody(
                      data: message.content,
                      styleSheet: MarkdownStyleSheet(
                        p: TextStyle(
                          color: message.isUser
                              ? Theme.of(context).colorScheme.onPrimaryContainer
                              : Theme.of(context).colorScheme.onSurface,
                        ),
                        code: TextStyle(
                          backgroundColor: message.isUser
                              ? Theme.of(context).colorScheme.primary.withOpacity(0.2)
                              : Theme.of(context).colorScheme.surface,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ),
                  ),
                  // Speaker icon for AI responses only
                  if (!message.isUser && languageCode != null)
                    IconButton(
                      icon: const Icon(Icons.volume_up, size: 20),
                      onPressed: onSpeak ?? () {
                        tts.WebTtsService.speakMultilingual(
                          message.content,
                          languageCode!,
                          'en-US',
                        );
                      },
                      tooltip: 'Speak',
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                ],
              ),
      ),
    );
  }
}
