class Todo {
  final String id;
  final String title;
  final bool isCompleted;
  final DateTime createdAt;

  const Todo({
    required this.id,
    required this.title,
    this.isCompleted = false,
    required this.createdAt,
  });

  factory Todo.fromJson(Map<String, dynamic> json) => Todo(
    id: json['id'] as String,
    title: json['title'] as String,
    isCompleted: json['completed'] as bool? ?? false,
    createdAt: DateTime.parse(json['createdAt'] as String),
  );
}
