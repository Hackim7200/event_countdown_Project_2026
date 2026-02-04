import 'package:event_countdown/features/models/todo_model.dart';
import 'package:flutter/material.dart';

class TodoCard extends StatelessWidget {
  final Todo todo;
  final VoidCallback onToggleComplete;

  const TodoCard({
    super.key,
    required this.todo,
    required this.onToggleComplete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Checkbox
          GestureDetector(
            onTap: onToggleComplete,
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: todo.isCompleted
                    ? theme.colorScheme.primary
                    : Colors.transparent,
                border: Border.all(
                  color: todo.isCompleted
                      ? theme.colorScheme.primary
                      : theme.colorScheme.outline,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(6),
              ),
              child: todo.isCompleted
                  ? Icon(
                      Icons.check,
                      size: 16,
                      color: theme.colorScheme.onPrimary,
                    )
                  : null,
            ),
          ),
          const SizedBox(width: 16),

          // Task details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  todo.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: todo.isCompleted ? Colors.grey : Colors.black87,
                    decoration: todo.isCompleted
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      Icons.timer_outlined,
                      size: 14,
                      color: theme.colorScheme.primary.withValues(alpha: 0.7),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${todo.pomodoros} ${todo.pomodoros == 1 ? 'pomodoro' : 'pomodoros'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
