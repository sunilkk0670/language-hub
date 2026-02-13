import 'package:flutter/material.dart';

class QuickActionButtons extends StatelessWidget {
  final Function(String) onAction;

  const QuickActionButtons({required this.onAction, super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      {'icon': Icons.school_rounded, 'label': 'Explain grammar', 'query': 'Can you explain a grammar concept?'},
      {'icon': Icons.lightbulb_outline_rounded, 'label': 'Give example', 'query': 'Can you give me an example?'},
      {'icon': Icons.chat_bubble_outline_rounded, 'label': 'Practice conversation', 'query': 'Let\'s practice a conversation'},
      {'icon': Icons.quiz_rounded, 'label': 'Quiz me', 'query': 'Can you quiz me on what I\'ve learned?'},
    ];

    return Container(
      height: 80,
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).colorScheme.outlineVariant,
            width: 1,
          ),
        ),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        itemCount: actions.length,
        itemBuilder: (context, index) {
          final action = actions[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: ActionChip(
              avatar: Icon(
                action['icon'] as IconData,
                size: 18,
              ),
              label: Text(action['label'] as String),
              onPressed: () => onAction(action['query'] as String),
            ),
          );
        },
      ),
    );
  }
}
