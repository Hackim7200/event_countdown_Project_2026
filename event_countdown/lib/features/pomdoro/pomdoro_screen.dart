import 'package:event_countdown/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/forms/pomodoro_form.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:event_countdown/features/pomdoro/widget/pomodoro_tile.dart';
import 'package:event_countdown/features/pomdoro/widget/timer.dart';
import 'package:flutter/material.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({super.key, required this.todoId, this.title});

  final String? todoId;
  final String? title;

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  final _pomodoroService = PomodoroService();
  List<Pomodoro> _pomodoros = [];
  bool _isLoading = true;
  String? _error;
  int _selectedPomodoroDuration = 0;

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
      final list = await _pomodoroService.getPomodoros(todoId);
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

  Future<void> _refresh() async {
    await _loadPomodoros();
  }

  Future<void> _openAddPomodoroSheet() async {
    final todoId = widget.todoId ?? '';
    if (todoId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No task selected. Open Pomodoro from a task.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    final result = await showModalBottomSheet<Pomodoro?>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) =>
          AddPomodoroBottomSheet(todoId: todoId, title: widget.title ?? 'Task'),
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
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final noTaskSelected =
        widget.todoId == null ||
        widget.todoId!.isEmpty ||
        (_error != null && _error!.contains('No task'));

    if (noTaskSelected) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.info_outline, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              _error ?? 'No task selected. Open Pomodoro from a task.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 18),
            ),
          ],
        ),
      );
    }

    if (_error != null) {
      
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          children: [
            const SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text(
                    'Failed to load pomodoros',
                    style: TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: _loadPomodoros,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        Expanded(
          child: Center(
            child: TomatoTimer(initialSeconds: _selectedPomodoroDuration * 60),
          ),
        ),
        Expanded(
          child: _pomodoros.isEmpty
              ? RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView(
                    children: const [
                      SizedBox(height: 100),
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.timer_outlined,
                              size: 64,
                              color: Colors.grey,
                            ),
                            SizedBox(height: 16),
                            Text(
                              'No pomodoros yet',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Pull down to refresh',
                              style: TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView.builder(
                    padding: const EdgeInsets.only(top: 8),
                    itemCount: _pomodoros.length,
                    itemBuilder: (context, index) {
                      final pomodoro = _pomodoros[index];
                      return PomodoroTile(
                        key: ValueKey(pomodoro.id),
                        pomodoro: pomodoro,
                        // onTap: () => _selectPomodoroTime(pomodoro),
                      );
                    },
                  ),
                ),
        ),
      ],
    );
  }

  _selectPomodoroTime(Pomodoro pomodoro) {
    _selectedPomodoroDuration = pomodoro.timerDurationInMinutes;
    setState(() {});
  }
}
