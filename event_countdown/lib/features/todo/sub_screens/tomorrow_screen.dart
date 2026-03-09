import 'package:event_countdown/features/todo/sortTodos.dart';
import 'package:event_countdown/models/todo_model.dart';
import 'package:event_countdown/features/pomdoro/pomdoro_screen.dart';
import 'package:event_countdown/features/todo/services/todo_service.dart';
import 'package:event_countdown/features/todo/widgets/todo_card.dart';
import 'package:flutter/material.dart';

class TomorrowSection extends StatefulWidget {
  const TomorrowSection({super.key});

  @override
  State<TomorrowSection> createState() => _TomorrowSectionState();
}

class _TomorrowSectionState extends State<TomorrowSection> {
  final _todoService = TodoService();
  List<Todo> _todos = [];

  List<Todo> _morningTodos = [];
  List<Todo> _earlyAfternoonTodos = [];
  List<Todo> _lateAfternoonTodos = [];
  List<Todo> _twilightTodos = [];
  List<Todo> _nightTodos = [];

  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadTodos();
  }

  Future<void> _loadTodos() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final tomorrow = DateTime.now().add(const Duration(days: 1));
      final tomorrowTodos = await _todoService.getTodos(forDate: tomorrow);

      if (mounted) {
        final morning = FilterByPeriod.filterByPeriod(tomorrowTodos, 'morning');
        final early = FilterByPeriod.filterByPeriod(
          tomorrowTodos,
          'early afternoon',
        );
        final late = FilterByPeriod.filterByPeriod(
          tomorrowTodos,
          'late afternoon',
        );
        final twilight = FilterByPeriod.filterByPeriod(
          tomorrowTodos,
          'twilight',
        );
        final night = FilterByPeriod.filterByPeriod(tomorrowTodos, 'night');

        setState(() {
          _todos = tomorrowTodos;
          _morningTodos = morning;
          _earlyAfternoonTodos = early;
          _lateAfternoonTodos = late;
          _twilightTodos = twilight;
          _nightTodos = night;
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
    await _loadTodos();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
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
                    'Failed to load tasks',
                    style: TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: _loadTodos,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    if (_todos.isEmpty) {
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          children: const [
            SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_available, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No tasks for tomorrow', style: TextStyle(fontSize: 18)),
                  Text(
                    'Pull down to refresh',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    final hasAnySection =
        _morningTodos.isNotEmpty ||
        _earlyAfternoonTodos.isNotEmpty ||
        _lateAfternoonTodos.isNotEmpty ||
        _twilightTodos.isNotEmpty ||
        _nightTodos.isNotEmpty;

    return RefreshIndicator(
      onRefresh: _refresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.only(top: 20, bottom: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _timePeriodSection(_morningTodos, 'Morning'),
            _timePeriodSection(_earlyAfternoonTodos, 'Early Afternoon'),
            _timePeriodSection(_lateAfternoonTodos, 'Late Afternoon'),
            _timePeriodSection(_twilightTodos, 'Twilight'),
            _timePeriodSection(_nightTodos, 'Night'),
            if (!hasAnySection && _todos.isNotEmpty)
              _timePeriodSection(_todos, 'Tasks'),
          ],
        ),
      ),
    );
  }

  void _navigateToPomodoro(String id, String title) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PomodoroScreen(todoId: id, title: title),
      ),
    );
  }

  IconData _iconForPeriod(String timePeriod) {
    switch (timePeriod) {
      case 'Morning':
        return Icons.wb_sunny_outlined;
      case 'Early Afternoon':
        return Icons.light_mode_outlined;
      case 'Late Afternoon':
        return Icons.wb_twilight;
      case 'Twilight':
        return Icons.gradient;
      case 'Night':
        return Icons.nightlight_round;
      default:
        return Icons.list_outlined;
    }
  }

  Widget _timePeriodSection(List<Todo> todos, String timePeriod) {
    final theme = Theme.of(context);

    if (todos.isEmpty) return const SizedBox.shrink();

    final iconColor = theme.colorScheme.primary;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Text(
                  timePeriod,
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.left,
                ),
              ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Icon(
                  _iconForPeriod(timePeriod),
                  size: 22,
                  color: iconColor,
                ),
              ),
            ],
          ),
          Divider(color: Colors.grey[300]),
          ListView.builder(
            padding: const EdgeInsets.only(top: 8),
            itemCount: todos.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              final todo = todos[index];
              return TodoCard(
                key: ValueKey(todo.id),
                pomodoroCount: todo.pomodoros,
                todo: todo,
                onTap: () => _navigateToPomodoro(todo.id, todo.title),
              );
            },
          ),
        ],
      ),
    );
  }
}
