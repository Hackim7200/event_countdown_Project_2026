import 'package:event_countdown/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:flutter/material.dart';

/// Bottom sheet to start a new Pomodoro session for a todo.
///
/// Requires [todoId] and [title] of the todo this session belongs to.
/// User can edit the title and choose timer duration; session start time is set when they tap Start.
class AddPomodoroBottomSheet extends StatefulWidget {
  const AddPomodoroBottomSheet({
    super.key,
    required this.todoId,
    required this.title,
  });

  final String todoId;
  final String title;

  @override
  State<AddPomodoroBottomSheet> createState() => _AddPomodoroBottomSheetState();
}

class _AddPomodoroBottomSheetState extends State<AddPomodoroBottomSheet> {
  static const int _defaultDurationMinutes = 25;
  static const List<int> _durationOptions = [15, 25, 45];
  final _taskNameController = TextEditingController();

  int _durationMinutes = _defaultDurationMinutes;
  bool _isLoading = false;

  @override
  void dispose() {
    _taskNameController.dispose();
    super.dispose();
  }

  void _addPomodoro() async {
    final title = _taskNameController.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a task name'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final newId = await PomodoroService().addPomodoro(
        todoId: widget.todoId,
        title: title,
        timerDurationInMinutes: _durationMinutes,
      );

      if (!mounted) return;

      if (newId != null && newId.isNotEmpty) {
        final session = Pomodoro(
          id: newId,
          title: title,
          completed: false,
          timerDurationInMinutes: _durationMinutes,
        );
        Navigator.of(context).pop(session);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pomodoro session started')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Failed to start session. Check sign-in and try again.',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to start session: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Draggable handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: theme.colorScheme.outline.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Text(
              'Add a pomodoro',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.onSurface,
              ),
            ),
          ),

          // Task name input (same pattern as AddTaskBottomSheet)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: TextField(
              controller: _taskNameController,
              decoration: InputDecoration(
                hintText: 'Task name',
                filled: true,
                fillColor: theme.colorScheme.onSurface.withValues(alpha: 0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
              ),
            ),
          ),

          // Duration section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Duration',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: _durationOptions.map((minutes) {
                    final isSelected = _durationMinutes == minutes;
                    return Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(
                          right: minutes != _durationOptions.last ? 8 : 0,
                        ),
                        child: _buildDurationOption(
                          theme,
                          '$minutes min',
                          minutes,
                          isSelected,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          // Action buttons
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _isLoading
                        ? null
                        : () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      side: BorderSide(color: theme.colorScheme.primary),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Cancel',
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _addPomodoro,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: theme.colorScheme.onPrimary,
                            ),
                          )
                        : Text(
                            'Add Session',
                            style: theme.textTheme.labelLarge?.copyWith(
                              color: theme.colorScheme.onPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom safe area
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  Widget _buildDurationOption(
    ThemeData theme,
    String label,
    int minutes,
    bool isSelected,
  ) {
    return InkWell(
      onTap: () => setState(() => _durationMinutes = minutes),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary.withValues(alpha: 0.1)
              : theme.colorScheme.onSurface.withValues(alpha: 0.05),
          border: Border.all(
            color: isSelected
                ? theme.colorScheme.primary
                : theme.colorScheme.outline.withValues(alpha: 0.3),
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: theme.textTheme.bodyLarge?.copyWith(
            color: isSelected
                ? theme.colorScheme.primary
                : theme.colorScheme.onSurface,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
