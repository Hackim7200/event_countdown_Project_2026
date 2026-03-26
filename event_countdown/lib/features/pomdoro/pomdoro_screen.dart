import 'package:event_countdown/features/pomdoro/forms/pomodoro_form.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
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
  PomodoroRepository get _repository =>
      widget.repository ?? PomodoroService();

  List<Pomodoro> _pomodoros = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPomodoros();
  }

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
      final s = Theme.of(context).colorScheme;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'No task selected. Open Pomodoro from a task.',
            style: TextStyle(color: s.onError),
          ),
          backgroundColor: s.error,
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
    return Scaffold(
      appBar: AppBar(title: Text(widget.title ?? 'Task'), centerTitle: true),
      floatingActionButton: FloatingActionButton(
        onPressed: _openAddPomodoroSheet,
        child: const Icon(Icons.add),
      ),
      body: _buildBody(context),
    );
  }

  Widget _buildBody(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.info_outline,
              size: 64,
              color: scheme.onSurfaceVariant,
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
      );
    }

    if (_pomodoros.isEmpty) {
      return RefreshIndicator(
        onRefresh: _loadPomodoros,
        child: ListView(
          children: [
            const SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.timer_outlined,
                    size: 64,
                    color: scheme.onSurfaceVariant,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No pomodoros yet',
                    style: textTheme.titleMedium?.copyWith(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap + to add one',
                    style: textTheme.bodyMedium?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadPomodoros,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8),
        itemCount: _pomodoros.length,
        itemBuilder: (context, index) {
          final pomodoro = _pomodoros[index];
          return PomodoroTile(
            key: ValueKey(pomodoro.id),
            pomodoro: pomodoro,
            todoId: widget.todoId!,
            repository: widget.repository,
            onCompleted: _loadPomodoros, // reloads list
            onDeleted: () async {
              final messenger = ScaffoldMessenger.of(context);
              final snackScheme = Theme.of(context).colorScheme;
              final removed = _pomodoros[index];
              setState(() => _pomodoros.removeAt(index));

              final success = await _repository.deletePomodoro(
                pomodoroId: pomodoro.id,
                todoId: widget.todoId!,
              );

              if (!success && mounted) {
                setState(() => _pomodoros.insert(index, removed));
                messenger.showSnackBar(
                  SnackBar(
                    content: Text(
                      'Failed to delete pomodoro',
                      style: TextStyle(color: snackScheme.onError),
                    ),
                    backgroundColor: snackScheme.error,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
          );
        },
      ),
    );
  }
}
