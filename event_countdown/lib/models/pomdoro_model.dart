import 'package:flutter/foundation.dart';

/// Model for a pomodoro session stored in the backend.
///
/// Matches [PomodoroEntry] / [CreatePomodoroInput] from CDK (Pomodoros.ts).
@immutable
class Pomodoro {
  final String id;
  final String title;
  final bool completed;
  final int timerDurationInMinutes;

  const Pomodoro({
    required this.id,
    required this.title,
    this.completed = false,
    required this.timerDurationInMinutes,
  });

  /// Create from API JSON (e.g. list/get response).
  factory Pomodoro.fromJson(Map<String, dynamic> json) {
    return Pomodoro(
      id: json['id'] as String,
      title: json['title'] as String,
      completed: json['completed'] as bool? ?? false,
      timerDurationInMinutes: json['timerDurationInMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'timerDurationInMinutes': timerDurationInMinutes,
    };
  }
}

/// Result of creating a pomodoro (POST response).
class CreatePomodoroResult {
  const CreatePomodoroResult({required this.id});
  final String id;

  factory CreatePomodoroResult.fromJson(Map<String, dynamic> json) {
    return CreatePomodoroResult(id: json['id'] as String);
  }
}
