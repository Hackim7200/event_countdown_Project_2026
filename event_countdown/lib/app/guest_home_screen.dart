import 'package:event_countdown/core/service/prayer_times_service.dart';
import 'package:event_countdown/core/widgets/custom_app_bar.dart';
import 'package:event_countdown/features/guest/services/guest_local_focus_store.dart';
import 'package:event_countdown/features/models/todo_model.dart';
import 'package:event_countdown/features/pomdoro/pomdoro_screen.dart';
import 'package:event_countdown/features/todo/widgets/period_countdown_text.dart';
import 'package:event_countdown/features/todo/widgets/todo_card.dart';
import 'package:flutter/material.dart';

/// Landing screen for users who are not signed in with Cognito.
///
/// Layout mirrors [TodaySection] (todo list + time-period header styling) while
/// data stays on-device via [GuestLocalFocusStore].
class GuestHomeScreen extends StatefulWidget {
  const GuestHomeScreen({super.key, required this.onSignIn});

  /// Called when the user chooses to open the Amplify Authenticator sign-in flow.
  final VoidCallback onSignIn;

  @override
  State<GuestHomeScreen> createState() => _GuestHomeScreenState();
}

class _GuestHomeScreenState extends State<GuestHomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final _prayerTimesService = PrayerTimesService();

  GuestLocalFocusStore? _store;
  List<GuestTodoSummary> _todos = [];
  List<double> _salahTimes = [];

  static const List<String> _periodNames = [
    'Morning',
    'Early Afternoon',
    'Late Afternoon',
    'Twilight',
    'Night',
  ];

  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final store = _store ?? await GuestLocalFocusStore.create();
      final results = await Future.wait([
        store.listTodos(),
        _prayerTimesService.getSalahTimes(date: DateTime.now()),
      ]);
      final todos = results[0] as List<GuestTodoSummary>;
      final times = results[1] as List<double>;

      if (mounted) {
        setState(() {
          _store = store;
          _todos = todos;
          _salahTimes = times;
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
    await _loadData();
  }

  Future<void> _openAddTodoDialog() async {
    final title = await showDialog<String>(
      context: context,
      builder: (context) => const _NewGuestTodoDialog(),
    );

    if (title == null || title.isEmpty || !mounted) return;
    await _store?.addTodo(title);
    await _loadData();
  }

  Future<void> _confirmDeleteTodo(GuestTodoSummary todo) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete task'),
        content: Text(
          'Delete "${todo.title}" and all its pomodoro sessions on this device?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (ok == true && mounted) {
      await _store?.deleteTodo(todo.id);
      await _loadData();
    }
  }

  void _openPomodoro(GuestTodoSummary todo) {
    final store = _store;
    if (store == null) return;
    Navigator.of(context).push<void>(
      MaterialPageRoute<void>(
        builder: (context) => PomodoroScreen(
          todoId: todo.id,
          title: todo.title,
          repository: store,
        ),
      ),
    );
  }

  double _currentTimeAsDecimal() {
    final now = DateTime.now();
    return now.hour + now.minute / 60.0 + now.second / 3600.0;
  }

  double _periodEndTime(int index) {
    if (_salahTimes.length < 5) return 12.0;
    if (index < 4) return _salahTimes[index + 1];
    return _salahTimes[0] + 24.0;
  }

  String _getActiveTimePeriodFromSalahTimes() {
    final t = _currentTimeAsDecimal();
    final s = _salahTimes;
    if (s.length < 5) return _periodNames[0];
    if (t >= s[0] && t < s[1]) return _periodNames[0];
    if (t >= s[1] && t < s[2]) return _periodNames[1];
    if (t >= s[2] && t < s[3]) return _periodNames[2];
    if (t >= s[3] && t < s[4]) return _periodNames[3];
    if (t >= s[4] || t < s[0]) return _periodNames[4];
    return _periodNames[0];
  }

  int _periodIndex(String name) {
    final i = _periodNames.indexOf(name);
    return i < 0 ? 0 : i;
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

  /// Same section chrome as [TodaySection._timePeriodSection]: header row + divider + cards.
  Widget _localTasksSection(
    List<GuestTodoSummary> todos,
    String activeTimePeriod,
    double periodEndTimeDecimalHours,
  ) {
    final theme = Theme.of(context);
    if (todos.isEmpty) return const SizedBox.shrink();

    final iconColor = theme.colorScheme.primary;
    const sectionTitle = 'Local tasks';

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
                  sectionTitle,
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
                      _iconForPeriod(activeTimePeriod),
                      size: 22,
                      color: iconColor,
                    ),
                    const SizedBox(width: 8),
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
          ListView.builder(
            padding: const EdgeInsets.only(top: 8),
            itemCount: todos.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              final g = todos[index];
              final todo = Todo(
                id: g.id,
                title: g.title,
                timePeriod: activeTimePeriod,
                dueDate: DateTime.now(),
                pomodoros: g.pomodoroCount,
                rawDate: '',
              );
              return TodoCard(
                key: ValueKey(g.id),
                pomodoroCount: g.pomodoroCount,
                onDelete: () => _confirmDeleteTodo(g),
                todo: todo,
                onTap: () => _openPomodoro(g),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
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
                    'Failed to load',
                    style: TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: _loadData,
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
                  Text('No local tasks', style: TextStyle(fontSize: 18)),
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

    final activeTimePeriod = _getActiveTimePeriodFromSalahTimes();
    final activeIdx = _periodIndex(activeTimePeriod);

    return RefreshIndicator(
      onRefresh: _refresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.only(top: 20, bottom: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _localTasksSection(
              _todos,
              activeTimePeriod,
              _periodEndTime(activeIdx),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final muted = theme.colorScheme.onSurface.withValues(alpha: 0.7);

    return Scaffold(
      key: _scaffoldKey,
      appBar: CustomAppBar(
        title: 'Todo',
        drawerScaffoldKey: _scaffoldKey,
      ),
      endDrawer: _GuestSignInDrawer(onSignIn: widget.onSignIn),
      floatingActionButton: FloatingActionButton(
        onPressed: _openAddTodoDialog,
        child: const Icon(Icons.add),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Text(
              'Saved on this device only. Sign in from the menu for cloud sync.',
              style: theme.textTheme.bodySmall?.copyWith(color: muted),
            ),
          ),
          Expanded(child: _buildBody()),
        ],
      ),
    );
  }
}

class _GuestSignInDrawer extends StatelessWidget {
  const _GuestSignInDrawer({required this.onSignIn});

  final VoidCallback onSignIn;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(),
              child: Align(
                alignment: Alignment.bottomLeft,
                child: Text(
                  'Account',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.cloud_sync_outlined),
              title: const Text('Sign in for cloud sync'),
              onTap: () {
                Navigator.of(context).pop();
                onSignIn();
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// Owns [TextEditingController] for the add-task dialog so it is disposed only
/// after the route has finished tearing down (avoids use-after-dispose).
class _NewGuestTodoDialog extends StatefulWidget {
  const _NewGuestTodoDialog();

  @override
  State<_NewGuestTodoDialog> createState() => _NewGuestTodoDialogState();
}

class _NewGuestTodoDialogState extends State<_NewGuestTodoDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final t = _controller.text.trim();
    Navigator.of(context).pop(t.isEmpty ? null : t);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('New task'),
      content: TextField(
        controller: _controller,
        autofocus: true,
        decoration: const InputDecoration(
          hintText: 'Task title',
          border: OutlineInputBorder(),
        ),
        onSubmitted: (_) => _submit(),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: _submit,
          child: const Text('Add'),
        ),
      ],
    );
  }
}
