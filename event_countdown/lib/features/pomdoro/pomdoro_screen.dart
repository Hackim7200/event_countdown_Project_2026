import 'dart:async';

import 'package:event_countdown/features/pomdoro/forms/pomodoro_form.dart';
import 'package:event_countdown/features/pomdoro/pomodoro_screen_widgets.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:event_countdown/core/services/websocket_service.dart';
import 'package:event_countdown/features/pomdoro/widget/pomodoro_tile.dart';
import 'package:event_countdown/features/models/pomdoro_model.dart';
import 'package:flutter/material.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({
    super.key,
    required this.todoId,
    this.title,
    this.repository,
  });

  final String? todoId;
  final String? title;

  /// When null, uses [PomodoroService] (cloud).
  final PomodoroRepository? repository;

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  PomodoroRepository get _repository => widget.repository ?? PomodoroService();

  List<Pomodoro> _pomodoros = [];
  bool _isLoading = true;
  String? _error;

  WebSocketService? _wsService;
  StreamSubscription<WsEvent>? _wsSub;

  bool get _isCloudMode => widget.repository == null;

  @override
  void initState() {
    super.initState();
    _loadPomodoros();
    if (_isCloudMode) _connectWebSocket();
  }

  @override
  void dispose() {
    _wsSub?.cancel();
    _wsService?.dispose();
    super.dispose();
  }

  Future<void> _connectWebSocket() async {
    _wsService = WebSocketService();
    await _wsService!.connect();

    _wsSub = _wsService!.events
        .where((e) => e.type == 'pomodoro_update')
        .listen((event) {
      final todoId = event.data['todoId'] as String?;
      if ((todoId == null || todoId == widget.todoId) && mounted) {
        _loadPomodoros();
      }
    });
  }

  int get _completedCount => _pomodoros.where((p) => p.isCompleted).length;

  Future<void> _loadPomodoros() async {
    final todoId = widget.todoId;
    if (todoId == null || todoId.isEmpty) {
      setState(() {
        _isLoading = false;
        _error = 'No task selected. Open Pomodoro from a task.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final list = await _repository.getPomodoros(todoId);
      if (mounted) {
        setState(() {
          _pomodoros = list;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _openAddPomodoroSheet() async {
    final todoId = widget.todoId ?? '';
    if (todoId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No task selected. Open Pomodoro from a task.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
    final result = await showModalBottomSheet<Pomodoro?>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddPomodoroBottomSheet(
        todoId: todoId,
        title: widget.title ?? 'Task',
        repository: widget.repository,
      ),
    );
    if (!mounted) return;
    if (result != null) {
      await _loadPomodoros();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      floatingActionButton: PomodoroFab(onPressed: _openAddPomodoroSheet),
      body: SafeArea(
        child: Column(
          children: [
            PomodoroScreenTopBar(onBack: () => Navigator.of(context).pop()),
            Expanded(child: _buildMainContent(context)),
          ],
        ),
      ),
    );
  }

  Widget _buildMainContent(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (_isLoading) {
      return Center(child: CircularProgressIndicator(color: scheme.primary));
    }

    if (_error != null) {
      return _buildErrorState(context);
    }

    return RefreshIndicator(
      onRefresh: _loadPomodoros,
      color: scheme.primary,
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 8),
          PomodoroSessionHeader(title: widget.title ?? 'Task'),
          const SizedBox(height: 32),
          PomodoroTimerSection(
            timeDisplay: _timerUiState.timeDisplay,
            statusText: _timerUiState.statusText,
            progress: _timerUiState.progress,
            isRunning: _timerUiState.isRunning,
            onPrimaryButtonPressed: () {
              // TODO: Timer start/pause — user will implement
            },
          ),
          const SizedBox(height: 40),
          PomodoroSubtasksHeader(
            completedCount: _completedCount,
            totalCount: _pomodoros.length,
          ),
          const SizedBox(height: 16),
          ..._buildSubtaskCards(),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.info_outline,
              size: 64,
              color: scheme.onSurfaceVariant.withValues(alpha: 0.7),
            ),
            const SizedBox(height: 16),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: textTheme.titleMedium?.copyWith(fontSize: 18),
            ),
            const SizedBox(height: 16),
            if (!_error!.contains('No task'))
              ElevatedButton(
                onPressed: _loadPomodoros,
                child: const Text('Retry'),
              ),
          ],
        ),
      ),
    );
  }

  PomodoroTimerUiState get _timerUiState {
    String timeDisplay = '25:00';
    String statusText = 'Ready';
    double progress = 0.0;
    bool isRunning = false;

    final running = _pomodoros.cast<Pomodoro?>().firstWhere(
      (p) => p!.isRunning,
      orElse: () => null,
    );

    if (running != null) {
      timeDisplay = _formatDuration(running.remaining);
      statusText = 'Focusing...';
      isRunning = true;
      final total = running.totalDuration;
      if (total.inSeconds > 0) {
        progress = 1.0 - (running.remaining.inSeconds / total.inSeconds);
      }
    } else if (_pomodoros.isNotEmpty) {
      final first = _pomodoros.cast<Pomodoro?>().firstWhere(
        (p) => p!.isStopped,
        orElse: () => _pomodoros.first,
      );
      if (first != null) {
        timeDisplay = _formatDuration(first.remaining);
        if (first.isCompleted) {
          statusText = 'Completed';
          progress = 1.0;
        } else if (first.elapsedSeconds > 0) {
          statusText = 'Paused';
          final total = first.totalDuration;
          if (total.inSeconds > 0) {
            progress = 1.0 - (first.remaining.inSeconds / total.inSeconds);
          }
        }
      }
    }

    return PomodoroTimerUiState(
      timeDisplay: timeDisplay,
      statusText: statusText,
      progress: progress,
      isRunning: isRunning,
    );
  }

  List<Widget> _buildSubtaskCards() {
    if (_pomodoros.isEmpty) {
      return [const SizedBox(height: 32), const PomodoroEmptySubtasks()];
    }

    return List.generate(_pomodoros.length, (index) {
      final pomodoro = _pomodoros[index];
      return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: PomodoroTile(
          key: ValueKey(pomodoro.id),
          pomodoro: pomodoro,
          todoId: widget.todoId!,
          repository: widget.repository,
          onCompleted: _loadPomodoros,
          onDeleted: () async {
            final messenger = ScaffoldMessenger.of(context);
            final removed = _pomodoros[index];
            setState(() => _pomodoros.removeAt(index));

            final success = await _repository.deletePomodoro(
              pomodoroId: pomodoro.id,
              todoId: widget.todoId!,
            );

            if (!success && mounted) {
              setState(() => _pomodoros.insert(index, removed));
              messenger.showSnackBar(
                const SnackBar(
                  content: Text('Failed to delete pomodoro'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            }
          },
        ),
      );
    });
  }

  static String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}
