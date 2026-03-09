import 'package:event_countdown/features/todo/sortTodos.dart';
import 'package:event_countdown/models/todo_model.dart';
import 'package:event_countdown/features/pomdoro/pomdoro_screen.dart';
import 'package:event_countdown/features/pomdoro/pomdoro_screen_2.dart';
import 'package:event_countdown/features/todo/services/todo_service.dart';
import 'package:event_countdown/features/todo/widgets/todo_card.dart';
import 'package:event_countdown/features/todo/widgets/period_countdown_text.dart';
import 'package:flutter/material.dart';

class TodaySection extends StatefulWidget {
  const TodaySection({super.key});

  @override
  State<TodaySection> createState() => _TodaySectionState();
}

class _TodaySectionState extends State<TodaySection> {
  final _todoService = TodoService();
  List<Todo> _todos = [];

  List<Todo> _morningTodos = [];
  List<Todo> _earlyAfternoonTodos = [];
  List<Todo> _lateAfternoonTodos = [];
  List<Todo> _twilightTodos = [];
  List<Todo> _nightTodos = [];

  /// Prayer times in decimal hours (e.g. 5.09 = 5:05, 12.44 = 12:44).
  /// Order: [0] Fajr, [1] Dhuhr, [2] Asr, [3] Maghrib, [4] Isha.
  static const List<double> _dummySalahTimes = [
    5.09,
    12.44,
    15.18,
    17.46,
    19.05,
  ];
  static const List<String> _periodNames = [
    'Morning',
    'Early Afternoon',
    'Late Afternoon',
    'Twilight',
    'Night',
  ];

  // final List<String> _timePeriods = [
  //   'Morning', // fajr to dhur
  //   'Early Afternoon', // dhur to asr
  //   'Late Afternoon', // asr to maghrib
  //   'Twilight', // maghrib to isha
  //   'Night', // isha to fajr
  // ];
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
      final now = DateTime.now();
      final todayTodos = await _todoService.getTodos(forDate: now);

      if (mounted) {
        final morning = FilterByPeriod.filterByPeriod(todayTodos, 'Morning');
        final early = FilterByPeriod.filterByPeriod(
          todayTodos,
          'Early Afternoon',
        );
        final late = FilterByPeriod.filterByPeriod(
          todayTodos,
          'Late Afternoon',
        );
        final twilight = FilterByPeriod.filterByPeriod(todayTodos, 'Twilight');
        final night = FilterByPeriod.filterByPeriod(todayTodos, 'Night');

        setState(() {
          _todos = todayTodos;
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

  /// Current time as decimal hours (e.g. 14:30 -> 14.5).
  double _currentTimeAsDecimal() {
    final now = DateTime.now();
    return now.hour + now.minute / 60.0 + now.second / 3600.0;
  }

  /// Converts HH.MM format (e.g. 12.44 = 12:44) to decimal hours.
  double _salahTimeToDecimalHours(double hhMm) {
    final h = hhMm.floor();
    final m = ((hhMm - h) * 100).round().clamp(0, 99);
    return h + m / 60.0;
  }

  /// End time of period [index] in decimal hours (next prayer).
  /// Night (index 4) ends at Fajr next day, so +24.
  double _periodEndTime(int index) {
    final s = _dummySalahTimes.map(_salahTimeToDecimalHours).toList();
    if (index < 4) return s[index + 1];
    return s[0] + 24.0; // Night ends at Fajr next day
  }

  /// Active period based on current time within [_dummySalahTimes] windows:
  /// [0]-[1] Morning, [1]-[2] Early Afternoon, [2]-[3] Late Afternoon,
  /// [3]-[4] Twilight, [4] to [0] next day Night.
  String _getActiveTimePeriodFromSalahTimes() {
    final t = _currentTimeAsDecimal();
    final s = _dummySalahTimes.map(_salahTimeToDecimalHours).toList();
    if (t >= s[0] && t < s[1]) return _periodNames[0]; // Morning
    if (t >= s[1] && t < s[2]) return _periodNames[1]; // Early Afternoon
    if (t >= s[2] && t < s[3]) return _periodNames[2]; // Late Afternoon
    if (t >= s[3] && t < s[4]) return _periodNames[3]; // Twilight
    if (t >= s[4] || t < s[0]) return _periodNames[4]; // Night
    return _periodNames[0];
  }

  // Future<void> _toggleComplete(String id) async {
  //   // Optimistic update
  //   setState(() {
  //     _todos = _todos.map((todo) {
  //       if (todo.id == id) {
  //         return todo.copyWith(isCompleted: !todo.isCompleted);
  //       }
  //       return todo;
  //     }).toList();
  //   });

  //   // Call API
  //   final success = await _todoService.completeTodo(id);

  //   if (!success && mounted) {
  //     // Revert on failure
  //     setState(() {
  //       _todos = _todos.map((todo) {
  //         if (todo.id == id) {
  //           return todo.copyWith(isCompleted: !todo.isCompleted);
  //         }
  //         return todo;
  //       }).toList();
  //     });

  //     ScaffoldMessenger.of(context).showSnackBar(
  //       const SnackBar(
  //         content: Text('Failed to update task'),
  //         backgroundColor: Colors.red,
  //       ),
  //     );
  //   }
  // }

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
                  Icon(
                    Icons.check_circle_outline,
                    size: 64,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text('No tasks for today', style: TextStyle(fontSize: 18)),
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

    final activeTimePeriod = _getActiveTimePeriodFromSalahTimes();

    return RefreshIndicator(
      onRefresh: _refresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.only(top: 20, bottom: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _timePeriodSection(
              _morningTodos,
              'Morning',
              activeTimePeriod,
              _periodEndTime(0),
            ),
            _timePeriodSection(
              _earlyAfternoonTodos,
              'Early Afternoon',
              activeTimePeriod,
              _periodEndTime(1),
            ),
            _timePeriodSection(
              _lateAfternoonTodos,
              'Late Afternoon',
              activeTimePeriod,
              _periodEndTime(2),
            ),
            _timePeriodSection(
              _twilightTodos,
              'Twilight',
              activeTimePeriod,
              _periodEndTime(3),
            ),
            _timePeriodSection(
              _nightTodos,
              'Night',
              activeTimePeriod,
              _periodEndTime(4),
            ),
            if (!hasAnySection && _todos.isNotEmpty)
              _timePeriodSection(
                _todos,
                'Tasks',
                activeTimePeriod,
                _periodEndTime(0),
              ),
          ],
        ),
      ),
    );
  }

  void _navigateToPomodoro(String id, String title) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PomodoroScreen2(todoId: id, title: title),
      ),
    );
  }

  /// Returns a suitable icon for the given time period.
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

  /// Builds a section for a specific time period with a header and list of todos.
  ///
  /// [todos] - Todos to display in this period.
  /// [timePeriod] - Name of the period (e.g. "Morning", "Early Afternoon").
  Widget _timePeriodSection(
    List<Todo> todos,
    String timePeriod,
    String activeTimePeriod,
    double periodEndTimeDecimalHours,
  ) {
    final theme = Theme.of(context);

    // Render nothing if there are no tasks for this period.
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
                child: Row(
                  children: [
                    Icon(
                      _iconForPeriod(timePeriod),
                      size: 22,
                      color: iconColor,
                    ),
                    const SizedBox(width: 8),
                    if (timePeriod == activeTimePeriod)
                      PeriodCountdownText(
                        periodEndTimeDecimalHours: periodEndTimeDecimalHours,
                        color: iconColor,
                      ),
                  ],
                ),
              ),
            ],
          ),
          Divider(color: Colors.grey[300]),

          // Use a fixed height or shrinkwrap to avoid conflicting with parent scrollables.
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
