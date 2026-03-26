import 'dart:async';

import 'package:event_countdown/app/theme.dart';

import 'package:event_countdown/features/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

/// Displays a single pomodoro session with a live countdown driven by the
/// server-side [startedAt] timestamp.
///
/// When the user taps "Start", the service writes a timestamp to DynamoDB.
/// A local ticker recalculates remaining = duration - (now - startedAt) every
/// second. If the app is reopened while the timer is running the countdown
/// automatically resumes because elapsed is derived from the persisted timestamp.
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
  //when in guest mode, use GuestLocalFocusStore but when signed in, use PomodoroService

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

  /// Start or resume the local ticker based on the current model state.
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
        final s = Theme.of(context).colorScheme;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to start timer. Try again.',
              style: TextStyle(color: s.onError),
            ),
            backgroundColor: s.error,
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
        final s = Theme.of(context).colorScheme;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to pause timer. Try again.',
              style: TextStyle(color: s.onError),
            ),
            backgroundColor: s.error,
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
        final s = Theme.of(context).colorScheme;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to reset timer. Try again.',
              style: TextStyle(color: s.onError),
            ),
            backgroundColor: s.error,
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
        final s = Theme.of(dialogContext).colorScheme;
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
              child: Text('Delete', style: TextStyle(color: s.error)),
            ),
          ],
        );
      },
    );
    if (confirmed == true) {
      widget.onDeleted?.call();
    }
  }

  static String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  Widget _buildLoadingIndicator() {
    return const SizedBox(
      width: 24,
      height: 24,
      child: CircularProgressIndicator(strokeWidth: 2),
    );
  }

  Widget? _buildTrailing({
    required bool notStarted,
    required bool isRunning,
    required bool isStopped,
  }) {
    if (notStarted) {
      return _isStarting
          ? _buildLoadingIndicator()
          : IconButton(
              icon: const Icon(Icons.play_arrow),
              onPressed: _handleStart,
            );
    }
    if (isStopped) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _isStarting
              ? _buildLoadingIndicator()
              : IconButton(
                  icon: const Icon(Icons.play_arrow),
                  onPressed: _handleStart,
                ),
          _isResetting
              ? _buildLoadingIndicator()
              : IconButton(
                  icon: const Icon(Icons.restart_alt),
                  onPressed: _handleReset,
                ),
        ],
      );
    }
    if (isRunning) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _isPausing
              ? _buildLoadingIndicator()
              : IconButton(
                  icon: const Icon(Icons.pause),
                  onPressed: _handlePause,
                ),
          _isResetting
              ? _buildLoadingIndicator()
              : IconButton(
                  icon: const Icon(Icons.restart_alt),
                  onPressed: _handleReset,
                ),
        ],
      );
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final sem = theme.extension<AppSemanticColors>() ?? AppSemanticColors.light;
    final isRunning = _pomodoro.isRunning;
    final isStopped = _pomodoro.isStopped;
    final isCompleted = _pomodoro.isCompleted;
    final notStarted = isStopped && _pomodoro.elapsedSeconds == 0;

    final IconData icon;
    final Color iconColor;
    if (isCompleted) {
      icon = Icons.check_circle;
      iconColor = sem.pomodoroComplete;
    } else if (isRunning) {
      icon = Icons.timer;
      iconColor = scheme.primary;
    } else if (isStopped && _pomodoro.elapsedSeconds > 0) {
      icon = Icons.pause_circle;
      iconColor = sem.pomodoroReset;
    } else {
      icon = Icons.circle_outlined;
      iconColor = sem.pomodoroIdle;
    }

    final String subtitle;
    if (isCompleted) {
      subtitle = 'Completed';
    } else if (isRunning) {
      subtitle = '${_formatDuration(_remaining)} remaining';
    } else if (isStopped && _pomodoro.elapsedSeconds > 0) {
      subtitle = '${_formatDuration(_remaining)} remaining · Paused';
    } else {
      subtitle = '${_pomodoro.timerDurationInMinutes} min';
    }

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
              // label: 'Reset',
            ),
          if (!isCompleted)
            SlidableAction(
              onPressed: (_) => _markCompleted(),
              backgroundColor: sem.pomodoroComplete,
              foregroundColor: sem.onPomodoroAccent,
              icon: Icons.check,
              // label: 'Complete',
            ),
          if (widget.onDeleted != null)
            SlidableAction(
              onPressed: (_) => _confirmDelete(),
              backgroundColor: scheme.error,
              foregroundColor: scheme.onError,
              icon: Icons.delete,
              // label: 'Delete',
            ),
        ],
      ),
      child: ListTile(
        leading: Icon(icon, size: 40, color: iconColor),
        title: Text(_pomodoro.title),
        subtitle: Text(subtitle, style: theme.textTheme.bodySmall),
        trailing: _buildTrailing(
          notStarted: notStarted,
          isRunning: isRunning,
          isStopped: isStopped,
        ),
      ),
    );
  }
}
