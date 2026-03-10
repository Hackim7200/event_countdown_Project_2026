import 'package:flutter/foundation.dart';

/// Model for a pomodoro session stored in the backend.
///
/// Matches [PomodoroEntry] / [CreatePomodoroInput] from CDK (Pomodoros.ts).
@immutable
class Pomodoro {
  final String id;
  final String title;
  final String status; // "running", "stopped", "completed"
  final int timerDurationInMinutes;
  final DateTime? startedAt;
  final int elapsedSeconds;

  const Pomodoro({
    required this.id,
    required this.title,
    this.status = 'stopped',
    required this.timerDurationInMinutes,
    this.startedAt,
    this.elapsedSeconds = 0,
  });

  /// Create from API JSON (e.g. list/get response).
  factory Pomodoro.fromJson(Map<String, dynamic> json) {
    return Pomodoro(
      id: json['id'] as String,
      title: json['title'] as String,
      status: json['status'] as String? ?? 'stopped',
      timerDurationInMinutes: json['timerDurationInMinutes'] as int,
      startedAt: json['startedAt'] != null
          ? DateTime.parse(json['startedAt'] as String)
          : null,
      elapsedSeconds: (json['elapsedSeconds'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'status': status,
      'timerDurationInMinutes': timerDurationInMinutes,
      'startedAt': startedAt?.toIso8601String(),
      'elapsedSeconds': elapsedSeconds,
    };
  }

  bool get isRunning => status == 'running';

  bool get isStopped => status == 'stopped';

  bool get isCompleted => status == 'completed';

  /// Total duration as a [Duration].
  Duration get totalDuration => Duration(minutes: timerDurationInMinutes);

  /// Total elapsed time: accumulated from previous cycles + current running segment.
  Duration get elapsed {
    final accumulated = Duration(seconds: elapsedSeconds);
    if (startedAt != null) {
      return accumulated + DateTime.now().toUtc().difference(startedAt!);
    }
    return accumulated;
  }

  /// Remaining time on the timer. Clamped to zero.
  Duration get remaining {
    final left = totalDuration - elapsed;
    return left.isNegative ? Duration.zero : left;
  }

  /// Pass [clearStartedAt] = true to explicitly set startedAt to null (stop/pause).
  Pomodoro copyWith({
    String? title,
    String? status,
    int? timerDurationInMinutes,
    DateTime? startedAt,
    int? elapsedSeconds,
    bool clearStartedAt = false,
  }) {
    return Pomodoro(
      id: id,
      title: title ?? this.title,
      status: status ?? this.status,
      timerDurationInMinutes:
          timerDurationInMinutes ?? this.timerDurationInMinutes,
      startedAt: clearStartedAt ? null : (startedAt ?? this.startedAt),
      elapsedSeconds: elapsedSeconds ?? this.elapsedSeconds,
    );
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
