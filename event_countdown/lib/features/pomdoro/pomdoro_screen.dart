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

  // -- State --
  List<Pomodoro> _pomodoros = [];
  bool _isLoading = true;
  String? _error;

  // -- WebSocket (real-time sync) --
  WebSocketService? _wsService;
  StreamSubscription<WsEvent>? _wsSub;

  // -- Timer tick (refreshes UI every second while a pomodoro is running) --
  Timer? _tickTimer;

  /// Which pomodoro is shown in the main timer ring (Pomofocus-style).
  String? _selectedPomodoroId;

  bool get _isCloudMode => widget.repository == null;

  /// Resolves [_selectedPomodoroId] to the actual model, or null.
  Pomodoro? get _selectedPomodoro {
    if (_selectedPomodoroId == null) return null;
    return _pomodoros.cast<Pomodoro?>().firstWhere(
      (p) => p!.id == _selectedPomodoroId,
      orElse: () => null,
    );
  }

  @override
  void initState() {
    super.initState();
    _loadPomodoros();
    if (_isCloudMode) _connectWebSocket();
  }

  @override
  void dispose() {
    _tickTimer?.cancel();
    _wsSub?.cancel();
    _wsService?.dispose();
    super.dispose();
  }

  Future<void> _connectWebSocket() async {
    _wsService = WebSocketService();
    await _wsService!.connect();

    _wsSub = _wsService!.events
        .where((e) => e.type == 'pomodoro_update')
        .listen(_handleWsEvent);
  }

  // ---------------------------------------------------------------------------
  // WebSocket event handling — syncs timer selection across devices
  // ---------------------------------------------------------------------------

  void _handleWsEvent(WsEvent event) {
    final todoId = event.data['todoId'] as String?;
    if (todoId != null && todoId != widget.todoId) return;
    if (!mounted) return;

    final pomodoroId = event.data['pomodoroId'] as String?;

    switch (event.action) {
      case 'started':
        _handleRemoteStart(pomodoroId);
      case 'completed':
        _handleRemoteComplete(pomodoroId);
      default:
        _loadPomodoros(silent: true);
    }
  }

  /// Another device started a pomodoro — swap the timer to it and alert the user.
  Future<void> _handleRemoteStart(String? pomodoroId) async {
    // Same pomodoro or unknown id — just refresh
    if (pomodoroId == null || pomodoroId == _selectedPomodoroId) {
      await _loadPomodoros(silent: true);
      return;
    }

    // Reload first so we have fresh data (previous timer was already reset by
    // the other device before starting the new one).
    await _loadPomodoros(silent: true);

    setState(() => _selectedPomodoroId = pomodoroId);

    if (!mounted) return;
    final title = _selectedPomodoro?.title ?? 'another session';
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Timer switched to: $title'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  /// Another device completed the active pomodoro — notify the user.
  Future<void> _handleRemoteComplete(String? pomodoroId) async {
    await _loadPomodoros(silent: true);

    if (pomodoroId == _selectedPomodoroId && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Timer completed!'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  int get _completedCount => _pomodoros.where((p) => p.isCompleted).length;

  /// Auto-select a pomodoro for the main timer display.
  /// Keeps current selection if still valid; otherwise picks running > non-completed > first.
  void _autoSelectPomodoro() {
    if (_selectedPomodoroId != null &&
        _pomodoros.any((p) => p.id == _selectedPomodoroId)) {
      return;
    }
    final running = _pomodoros.cast<Pomodoro?>().firstWhere(
      (p) => p!.isRunning,
      orElse: () => null,
    );
    if (running != null) {
      _selectedPomodoroId = running.id;
      return;
    }
    final notCompleted = _pomodoros.cast<Pomodoro?>().firstWhere(
      (p) => !p!.isCompleted,
      orElse: () => null,
    );
    _selectedPomodoroId = notCompleted?.id ?? _pomodoros.firstOrNull?.id;
  }

  /// The Pomodoro model computes remaining time from DateTime.now(), so the
  /// values are always correct — but the UI only updates on setState. This
  /// ticker triggers a rebuild every second while any pomodoro is running.
  void _syncTickTimer() {
    final hasRunning = _pomodoros.any((p) => p.isRunning);
    if (hasRunning && _tickTimer == null) {
      _tickTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (!mounted) return;
        setState(() {});
      });
    } else if (!hasRunning && _tickTimer != null) {
      _tickTimer?.cancel();
      _tickTimer = null;
    }
  }

  /// When [silent] is true (e.g. WebSocket-triggered refresh), skip the
  /// loading spinner so the current UI stays visible during the fetch.
  Future<void> _loadPomodoros({bool silent = false}) async {
    final todoId = widget.todoId;
    if (todoId == null || todoId.isEmpty) {
      setState(() {
        _isLoading = false;
        _error = 'No task selected. Open Pomodoro from a task.';
      });
      return;
    }

    if (!silent) {
      setState(() {
        _isLoading = true;
        _error = null;
      });
    }

    try {
      final list = await _repository.getPomodoros(todoId);
      if (mounted) {
        setState(() {
          _pomodoros = list;
          _isLoading = false;
          _autoSelectPomodoro();
        });
        _syncTickTimer();
      }
    } catch (e) {
      if (mounted && !silent) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Timer actions — selecting, switching, and start/stop
  // ---------------------------------------------------------------------------

  /// Handles a tile tap following the Pomofocus pattern:
  ///  - Same tile: toggle start/pause.
  ///  - Different tile: reset the previous (if running), select + start the new one.
  Future<void> _onTileTapped(Pomodoro tapped) async {
    final todoId = widget.todoId!;

    // Tapped the already-selected tile → toggle start / pause
    if (tapped.id == _selectedPomodoroId) {
      await _toggleSelectedPomodoro(tapped, todoId);
      return;
    }

    // Switching to a different tile → reset previous, select & start new
    await _switchToPomodoro(tapped, todoId);
  }

  /// Toggles start/pause on the currently selected pomodoro.
  Future<void> _toggleSelectedPomodoro(Pomodoro pom, String todoId) async {
    if (pom.isRunning) {
      await _repository.pausePomodoro(pomodoroId: pom.id, todoId: todoId);
    } else if (!pom.isCompleted) {
      await _repository.startPomodoro(pomodoroId: pom.id, todoId: todoId);
    }
    await _loadPomodoros(silent: true);
  }

  /// Switches the active timer to [next]. Resets the previous one if it was
  /// still running (completed timers are left as-is).
  Future<void> _switchToPomodoro(Pomodoro next, String todoId) async {
    final prev = _selectedPomodoro;
    if (prev != null && prev.isRunning && !prev.isCompleted) {
      await _repository.resetPomodoro(pomodoroId: prev.id, todoId: todoId);
    }

    setState(() => _selectedPomodoroId = next.id);

    if (!next.isCompleted) {
      await _repository.startPomodoro(pomodoroId: next.id, todoId: todoId);
    }
    await _loadPomodoros(silent: true);
  }

  /// Start/Stop button in the main timer ring.
  Future<void> _handleStartStop() async {
    final selected = _selectedPomodoro;
    if (selected == null) return;
    await _toggleSelectedPomodoro(selected, widget.todoId!);
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

  // ---------------------------------------------------------------------------
  // Build
  // ---------------------------------------------------------------------------

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
            onPrimaryButtonPressed: _handleStartStop,
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

  // ---------------------------------------------------------------------------
  // Timer UI state — derives display values from the selected pomodoro
  // ---------------------------------------------------------------------------

  PomodoroTimerUiState get _timerUiState {
    final selected = _selectedPomodoro;
    if (selected == null) {
      return const PomodoroTimerUiState(
        timeDisplay: '25:00',
        statusText: 'Ready',
        progress: 0.0,
        isRunning: false,
      );
    }

    final total = selected.totalDuration;
    double progress = 0.0;
    if (total.inSeconds > 0) {
      progress = 1.0 - (selected.remaining.inSeconds / total.inSeconds);
    }

    String statusText;
    if (selected.isCompleted) {
      statusText = 'Completed';
      progress = 1.0;
    } else if (selected.isRunning) {
      statusText = 'Focusing...';
    } else if (selected.elapsedSeconds > 0) {
      statusText = 'Paused';
    } else {
      statusText = 'Ready';
    }

    return PomodoroTimerUiState(
      timeDisplay: _formatDuration(selected.remaining),
      statusText: statusText,
      progress: progress,
      isRunning: selected.isRunning,
    );
  }

  // ---------------------------------------------------------------------------
  // Subtask list
  // ---------------------------------------------------------------------------

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
          isSelected: pomodoro.id == _selectedPomodoroId,
          onTileTapped: () => _onTileTapped(pomodoro),
          onCompleted: _loadPomodoros,
          onDeleted: () => _handleDelete(index, pomodoro),
        ),
      );
    });
  }

  /// Optimistic delete: removes immediately, re-inserts on failure.
  Future<void> _handleDelete(int index, Pomodoro pomodoro) async {
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
  }

  static String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}
