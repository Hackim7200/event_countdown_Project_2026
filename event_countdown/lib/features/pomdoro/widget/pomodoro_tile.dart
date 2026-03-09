import 'package:event_countdown/features/pomdoro/services/pomodoro_service.dart';
import 'package:event_countdown/models/pomdoro_model.dart';
import 'package:flutter/material.dart';

/// Displays a single pomodoro session (title and duration).
class PomodoroTile extends StatelessWidget {
  const PomodoroTile({super.key, required this.pomodoro});

  final Pomodoro pomodoro;
  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: () {
        PomodoroService().startPomodoro(pomodoro.id);
        PomodoroService().stopPomodoro(pomodoro.id);
      },
      leading: Icon(
        Icons.circle,
        size: 40,
        color: const Color.fromARGB(255, 249, 130, 130),
      ),
      title: Text(pomodoro.title),
      subtitle: Text(
        '${pomodoro.timerDurationInMinutes} min',
        style: Theme.of(context).textTheme.bodySmall,
      ),
      trailing: Text("12min left"),
    );
  }
  double (Pomodoro pomodoro) {







  }

}
