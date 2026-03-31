import 'dart:async';

import 'package:event_countdown/app/theme.dart';
import 'package:event_countdown/features/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

/// Displays a single pomodoro session as a clean subtask card.
///
/// Tap to start/pause (when not completed). Swipe for reset, complete, delete.
/// Timer logic is self-contained: a local ticker recalculates remaining time
/// from the server-side [startedAt] timestamp every second.
class PomodoroTile extends StatefulWidget {
  const PomodoroTile({
    super.key,
    required this.pomodoro,
    required this.todoId,
    this.repository,
    this.onCompleted,
    this.onDeleted,
  });

  final Pomodoro pomodoro;
  final String todoId;

  /// When null, uses [PomodoroService] (signed-in API).
  final PomodoroRepository? repository;

  /// Called after the pomodoro is marked completed in the backend.
  final VoidCallback? onCompleted;

  /// Called when the user confirms deletion via swipe.
  final VoidCallback? onDeleted;

  @override
  State<PomodoroTile> createState() => _PomodoroTileState();
}

class _PomodoroTileState extends State<PomodoroTile> {
  late Pomodoro _pomodoro;

  PomodoroRepository get _repository => widget.repository ?? PomodoroService();
  Timer? _ticker;
  Duration _remaining = Duration.zero;
  bool _isStarting = false;
  bool _isPausing = false;
  bool _isResetting = false;

  @override
  void initState() {
    super.initState();
    _pomodoro = widget.pomodoro;
    _syncTimer();
  }

  @override
  void didUpdateWidget(covariant PomodoroTile oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.repository != widget.repository ||
        oldWidget.pomodoro.id != widget.pomodoro.id ||
        oldWidget.pomodoro.startedAt != widget.pomodoro.startedAt ||
        oldWidget.pomodoro.status != widget.pomodoro.status) {
      _pomodoro = widget.pomodoro;
      _syncTimer();
    }
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  void _syncTimer() {
    _ticker?.cancel();
    _ticker = null;

    if (_pomodoro.isCompleted) {
      _remaining = Duration.zero;
      return;
    }

    if (_pomodoro.startedAt == null) {
      _remaining = _pomodoro.remaining;
      return;
    }

    _remaining = _pomodoro.remaining;
    if (_remaining <= Duration.zero) {
      _markCompleted();
      return;
    }

    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      final left = _pomodoro.remaining;
      setState(() => _remaining = left);
      if (left <= Duration.zero) {
        _ticker?.cancel();
        _ticker = null;
        _markCompleted();
      }
    });
  }

  Future<void> _handleStart() async {
    setState(() => _isStarting = true);
    final startedAt = await _repository.startPomodoro(
      pomodoroId: _pomodoro.id,
      todoId: widget.todoId,
    );
    if (!mounted) return;

    if (startedAt != null) {
      setState(() {
        _pomodoro = _pomodoro.copyWith(startedAt: startedAt, status: 'running');
        _isStarting = false;
      });
      _syncTimer();
    } else {
      setState(() => _isStarting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to start timer. Try again.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Future<void> _handlePause() async {
    setState(() => _isPausing = true);
    final newElapsed = await _repository.pausePomodoro(
      pomodoroId: _pomodoro.id,
      todoId: widget.todoId,
    );
    if (!mounted) return;

    if (newElapsed != null) {
      _ticker?.cancel();
      _ticker = null;
      setState(() {
        _pomodoro = _pomodoro.copyWith(
          clearStartedAt: true,
          elapsedSeconds: newElapsed,
          status: 'stopped',
        );
        _remaining = _pomodoro.remaining;
        _isPausing = false;
      });
    } else {
      setState(() => _isPausing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to pause timer. Try again.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Future<void> _handleReset() async {
    setState(() => _isResetting = true);
    final success = await _repository.resetPomodoro(
      pomodoroId: _pomodoro.id,
      todoId: widget.todoId,
    );
    if (!mounted) return;

    if (success) {
      _ticker?.cancel();
      _ticker = null;
      setState(() {
        _pomodoro = _pomodoro.copyWith(
          clearStartedAt: true,
          elapsedSeconds: 0,
          status: 'stopped',
        );
        _remaining = _pomodoro.totalDuration;
        _isResetting = false;
      });
    } else {
      setState(() => _isResetting = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to reset timer. Try again.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Future<void> _markCompleted() async {
    final success = await _repository.completePomodoro(
      pomodoroId: _pomodoro.id,
      todoId: widget.todoId,
    );
    if (!mounted) return;
    if (success) {
      setState(() {
        _pomodoro = _pomodoro.copyWith(status: 'completed');
        _remaining = Duration.zero;
      });
      widget.onCompleted?.call();
    }
  }

  Future<void> _confirmDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Delete Pomodoro'),
          content: const Text('Are you sure you want to delete this session?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text(
                'Delete',
                style: TextStyle(
                  color: Theme.of(dialogContext).colorScheme.error,
                ),
              ),
            ),
          ],
        );
      },
    );
    if (confirmed == true) {
      widget.onDeleted?.call();
    }
  }

  void _handleTap() {
    if (_pomodoro.isCompleted) return;
    if (_pomodoro.isRunning) {
      _handlePause();
    } else {
      _handleStart();
    }
  }

  static String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final sem = theme.extension<AppSemanticColors>() ?? AppSemanticColors.light;
    final isCompleted = _pomodoro.isCompleted;
    final isRunning = _pomodoro.isRunning;
    final isPaused = _pomodoro.isStopped && _pomodoro.elapsedSeconds > 0;
    final isLoading = _isStarting || _isPausing || _isResetting;

    return Slidable(
      key: ValueKey(_pomodoro.id),
      endActionPane: ActionPane(
        motion: const DrawerMotion(),
        children: [
          if (!isCompleted)
            SlidableAction(
              onPressed: (_) => _handleReset(),
              backgroundColor: sem.pomodoroReset,
              foregroundColor: sem.onPomodoroAccent,
              icon: Icons.restart_alt,
            ),
          if (!isCompleted)
            SlidableAction(
              onPressed: (_) => _markCompleted(),
              backgroundColor: sem.pomodoroComplete,
              foregroundColor: sem.onPomodoroAccent,
              icon: Icons.check,
            ),
          if (widget.onDeleted != null)
            SlidableAction(
              onPressed: (_) => _confirmDelete(),
              backgroundColor: const Color(0xFFEF5350),
              foregroundColor: Colors.white,
              icon: Icons.delete,
            ),
        ],
      ),
      child: GestureDetector(
        onTap: _handleTap,
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: scheme.surface,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              _buildStatusIcon(
                isCompleted: isCompleted,
                isRunning: isRunning,
                isPaused: isPaused,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  _pomodoro.title,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: isCompleted
                        ? scheme.onSurfaceVariant
                        : scheme.onSurface,
                    decoration: isCompleted
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                    decorationColor: scheme.onSurfaceVariant.withValues(
                      alpha: 0.4,
                    ),
                  ),
                ),
              ),
              if (isLoading) ...[
                const SizedBox(width: 8),
                SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: scheme.primary,
                  ),
                ),
              ] else if (isRunning || isPaused) ...[
                const SizedBox(width: 8),
                Text(
                  _formatDuration(_remaining),
                  style: textTheme.bodySmall?.copyWith(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: scheme.onSurfaceVariant,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusIcon({
    required bool isCompleted,
    required bool isRunning,
    required bool isPaused,
  }) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final sem = theme.extension<AppSemanticColors>() ?? AppSemanticColors.light;
    final IconData icon;
    final Color bgColor;
    final Color iconColor;

    if (isCompleted) {
      icon = Icons.check_circle;
      bgColor = sem.pomodoroComplete.withValues(alpha: 0.15);
      iconColor = sem.pomodoroComplete;
    } else if (isRunning) {
      icon = Icons.timer;
      bgColor = scheme.primary.withValues(alpha: 0.14);
      iconColor = scheme.primary;
    } else if (isPaused) {
      icon = Icons.pause_circle_outline;
      bgColor = sem.pomodoroReset.withValues(alpha: 0.15);
      iconColor = sem.pomodoroReset;
    } else {
      icon = Icons.circle_outlined;
      bgColor = sem.pomodoroIdle.withValues(alpha: 0.15);
      iconColor = sem.pomodoroIdle;
    }

    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Center(child: Icon(icon, size: 18, color: iconColor)),
    );
  }
}
