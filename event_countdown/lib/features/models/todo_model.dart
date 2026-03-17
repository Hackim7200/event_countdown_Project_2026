/// Todo model for the app
///
/// [Todo] is an immutable model representing a task with a due date,
/// completion status, associated pomodoro count, and time period.
///
class Todo {
  final String id;
  final String title;
  final bool isCompleted;
  final DateTime dueDate;
  final int pomodoros;
  final String timePeriod;

  /// The raw date string exactly as returned by the backend.
  /// Used to construct the DynamoDB SK for delete/update operations.
  final String rawDate;

  /// Main constructor for [Todo].
  const Todo({
    required this.id,
    required this.title,
    required this.timePeriod,
    this.isCompleted = false,
    required this.dueDate,
    this.pomodoros = 0,
    this.rawDate = '',
  });

  /// Creates a [Todo] instance from a JSON map.
  ///
  /// Accepts either `date` or `dueDate` fields from backend.
  /// Defaults [isCompleted] to false and [pomodoros] to 0 if missing.
  factory Todo.fromJson(Map<String, dynamic> json) {
    final dateStr = (json['date'] ?? json['dueDate']) as String?;
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      timePeriod: json['timePeriod'] as String? ?? '',
      isCompleted: json['completed'] as bool? ?? false,
      dueDate: dateStr != null ? DateTime.parse(dateStr) : DateTime.now(),
      rawDate: dateStr ?? '',
      pomodoros: json['pomodoros'] as int? ?? 0,
    );
  }

  /// Converts the [Todo] to a JSON-serializable map.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'timePeriod': timePeriod,
      'completed': isCompleted,
      'dueDate': dueDate.toIso8601String(),
      'pomodoros': pomodoros,
    };
  }

  /// Returns true if the todo is due today.
  bool get isToday {
    final now = DateTime.now();
    return dueDate.year == now.year &&
        dueDate.month == now.month &&
        dueDate.day == now.day;
  }

  /// Returns true if the todo is due tomorrow.
  bool get isTomorrow {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return dueDate.year == tomorrow.year &&
        dueDate.month == tomorrow.month &&
        dueDate.day == tomorrow.day;
  }

  /// Returns a copy of this todo with the provided fields replaced.
  Todo copyWith({
    String? id,
    String? title,
    String? timePeriod,
    bool? isCompleted,
    DateTime? dueDate,
    int? pomodoros,
    String? rawDate,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      timePeriod: timePeriod ?? this.timePeriod,
      isCompleted: isCompleted ?? this.isCompleted,
      dueDate: dueDate ?? this.dueDate,
      pomodoros: pomodoros ?? this.pomodoros,
      rawDate: rawDate ?? this.rawDate,
    );
  }
}

/// Dummy data for testing the UI
///
/// Use [DummyTodos.getAll], [getTodayTodos], [getTomorrowTodos]
/// to generate sample lists for previews and development.
class DummyTodos {
  static List<Todo> getAll() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));

    return [
      Todo(
        id: '1',
        title: 'Review pull requests',
        timePeriod: 'morning',
        dueDate: today,
        pomodoros: 2,
      ),
      Todo(
        id: '2',
        title: 'Write documentation',
        timePeriod: 'afternoon',
        dueDate: today,
        pomodoros: 3,
        isCompleted: true,
      ),
      Todo(
        id: '3',
        title: 'Team standup meeting',
        timePeriod: 'morning',
        dueDate: today,
        pomodoros: 1,
      ),
      Todo(
        id: '4',
        title: 'Fix login bug',
        timePeriod: 'evening',
        dueDate: today,
        pomodoros: 2,
      ),
      Todo(
        id: '5',
        title: 'Design review session',
        timePeriod: 'afternoon',
        dueDate: tomorrow,
        pomodoros: 2,
      ),
      Todo(
        id: '6',
        title: 'Update dependencies',
        timePeriod: 'evening',
        dueDate: tomorrow,
        pomodoros: 1,
      ),
      Todo(
        id: '7',
        title: 'Write unit tests',
        timePeriod: 'morning',
        dueDate: tomorrow,
        pomodoros: 4,
      ),
    ];
  }

  static List<Todo> getTodayTodos() {
    return getAll().where((t) => t.isToday).toList();
  }

  static List<Todo> getTomorrowTodos() {
    return getAll().where((t) => t.isTomorrow).toList();
  }
}
