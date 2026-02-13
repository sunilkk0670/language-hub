import 'package:flutter/material.dart';

class RateLimitIndicator extends StatelessWidget {
  final int remaining;
  final int total;

  const RateLimitIndicator({
    required this.remaining,
    required this.total,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final percentage = remaining / total;
    final color = percentage > 0.5
        ? Colors.green
        : percentage > 0.2
            ? Colors.orange
            : Colors.red;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.bolt_rounded,
            size: 16,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            '$remaining/$total requests',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
