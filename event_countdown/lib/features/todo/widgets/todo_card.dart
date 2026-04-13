import 'package:event_countdown/features/models/todo_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class TodoCard extends StatelessWidget {
  final Todo todo;
  final VoidCallback onTap;
  final VoidCallback? onDelete;

  /// Pomodoro count when available (e.g. from PomodoroService); decided programmatically.
  final int pomodoroCount;

  /// Completed pomodoros (grey dots). When null, uses [Todo.isCompleted]: all done or none.
  final int? completedPomodoros;

  const TodoCard({
    super.key,
    required this.todo,
    required this.onTap,
    required this.pomodoroCount,
    this.completedPomodoros,
    this.onDelete,
  });

  static const double _titleHeight = 48;
  static const double _pomodoroRowHeight = 20;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    final completed = completedPomodoros ??
        (todo.isCompleted ? pomodoroCount : 0);
    final greyCount = completed.clamp(0, pomodoroCount);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Slidable(
        key: ValueKey(todo.id),
        endActionPane: ActionPane(
          motion: const DrawerMotion(),
          children: [
            if (onDelete != null)
              SlidableAction(
                onPressed: (_) => onDelete!(),
                backgroundColor: scheme.error,
                foregroundColor: scheme.onError,
                icon: Icons.delete,
                label: 'Delete',
                borderRadius: BorderRadius.only(
                  topRight: const Radius.circular(12),
                  bottomRight: const Radius.circular(12),
                ),
              ),
          ],
        ),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onTap,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: scheme.outline.withValues(alpha: 0.22)),
              boxShadow: [
                BoxShadow(
                  color: scheme.shadow.withValues(alpha: 0.07),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  height: _titleHeight,
                  child: Text(
                    todo.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      height: 1.25,
                      color: todo.isCompleted
                          ? scheme.onSurfaceVariant
                          : scheme.onSurface,
                      decoration: todo.isCompleted
                          ? TextDecoration.lineThrough
                          : null,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: _pomodoroRowHeight,
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: pomodoroCount == 0
                        ? Text(
                            'No pomodoros',
                            style: TextStyle(
                              fontSize: 12,
                              color: scheme.onSurfaceVariant,
                              fontWeight: FontWeight.w500,
                            ),
                          )
                        : Row(
                            mainAxisSize: MainAxisSize.min,
                            children: List.generate(pomodoroCount, (i) {
                              final isDone = i < greyCount;
                              return Padding(
                                padding: EdgeInsets.only(left: i == 0 ? 0 : 5),
                                child: _PomodoroDot(
                                  completed: isDone,
                                  colorScheme: scheme,
                                ),
                              );
                            }),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PomodoroDot extends StatelessWidget {
  const _PomodoroDot({
    required this.completed,
    required this.colorScheme,
  });

  static const Color _incompleteLightRed = Color(0xFFFF8A8A);

  final bool completed;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 7,
      height: 7,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: completed
            ? colorScheme.outline.withValues(alpha: 0.55)
            : _incompleteLightRed,
      ),
    );
  }
}
