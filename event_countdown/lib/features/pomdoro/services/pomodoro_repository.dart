import 'package:event_countdown/features/models/pomdoro_model.dart';

/// Abstraction for pomodoro persistence and timer actions.
///
/// Implemented by [PomodoroService] (API) and [GuestLocalFocusStore] (device).
abstract class PomodoroRepository {
  Future<List<Pomodoro>> getPomodoros(String todoId);

  Future<String?> addPomodoro({
    required String todoId,
    required String title,
    required int timerDurationInMinutes,
  });

  Future<DateTime?> startPomodoro({
    required String pomodoroId,
    required String todoId,
  });

  Future<int?> pausePomodoro({
    required String pomodoroId,
    required String todoId,
  });

  Future<bool> resetPomodoro({
    required String pomodoroId,
    required String todoId,
  });

  Future<bool> deletePomodoro({
    required String pomodoroId,
    required String todoId,
  });

  Future<bool> completePomodoro({
    required String pomodoroId,
    required String todoId,
  });
}
