/// Todo model for the app
class Todo {
  final String id;
  final String title;
  final bool isCompleted;
  final DateTime dueDate;
  final int pomodoros;

  const Todo({
    required this.id,
    required this.title,
    this.isCompleted = false,
    required this.dueDate,
    this.pomodoros = 1,
  });

  /// Create a Todo from JSON response.
  /// Backend returns [date]; we accept [date] or [dueDate] for compatibility.
  factory Todo.fromJson(Map<String, dynamic> json) {
    final dateStr = json['date'] ?? json['dueDate'];
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      isCompleted: json['completed'] as bool? ?? false,
      dueDate: dateStr != null
          ? DateTime.parse(dateStr as String)
          : DateTime.now(),
      pomodoros: json['pomodoros'] as int? ?? 1,
    );
  }

  /// Convert Todo to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': isCompleted,
      'dueDate': dueDate.toIso8601String(),
      'pomodoros': pomodoros,
    };
  }

  /// Check if todo is due today
  bool get isToday {
    final now = DateTime.now();
    return dueDate.year == now.year &&
        dueDate.month == now.month &&
        dueDate.day == now.day;
  }

  /// Check if todo is due tomorrow
  bool get isTomorrow {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return dueDate.year == tomorrow.year &&
        dueDate.month == tomorrow.month &&
        dueDate.day == tomorrow.day;
  }

  /// Copy with method for immutability
  Todo copyWith({
    String? id,
    String? title,
    bool? isCompleted,
    DateTime? dueDate,
    int? pomodoros,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      dueDate: dueDate ?? this.dueDate,
      pomodoros: pomodoros ?? this.pomodoros,
    );
  }
}

/// Dummy data for testing the UI
class DummyTodos {
  static List<Todo> getAll() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));

    return [
      Todo(
        id: '1',
        title: 'Review pull requests',
        dueDate: today,
        pomodoros: 2,
      ),
      Todo(
        id: '2',
        title: 'Write documentation',
        dueDate: today,
        pomodoros: 3,
        isCompleted: true,
      ),
      Todo(
        id: '3',
        title: 'Team standup meeting',
        dueDate: today,
        pomodoros: 1,
      ),
      Todo(id: '4', title: 'Fix login bug', dueDate: today, pomodoros: 2),
      Todo(
        id: '5',
        title: 'Design review session',
        dueDate: tomorrow,
        pomodoros: 2,
      ),
      Todo(
        id: '6',
        title: 'Update dependencies',
        dueDate: tomorrow,
        pomodoros: 1,
      ),
      Todo(id: '7', title: 'Write unit tests', dueDate: tomorrow, pomodoros: 4),
    ];
  }

  static List<Todo> getTodayTodos() {
    return getAll().where((t) => t.isToday).toList();
  }

  static List<Todo> getTomorrowTodos() {
    return getAll().where((t) => t.isTomorrow).toList();
  }
}
