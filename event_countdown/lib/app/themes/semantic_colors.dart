part of 'package:event_countdown/app/theme.dart';

// Defines named Pomodoro colors (idle, complete, reset, text on those colors) for
// light and dark mode. Widgets read them with Theme.of(context).extension<...>()
// instead of hard-coding hex values.

// ─────────────────────────────────────────────────────────────────────────────
// Theme extension — Pomodoro-specific colors per brightness
// ─────────────────────────────────────────────────────────────────────────────

/// Pomodoro tile/button colors accessed via
/// `Theme.of(context).extension<AppSemanticColors>()`.
@immutable
class AppSemanticColors extends ThemeExtension<AppSemanticColors> {
  const AppSemanticColors({
    required this.pomodoroComplete,
    required this.pomodoroReset,
    required this.pomodoroIdle,
    required this.pomodoroStopButton,
    required this.onPomodoroAccent,
  });

  static const AppSemanticColors light = AppSemanticColors(
    pomodoroComplete: _LightPalette.pomodoroComplete,
    pomodoroReset: Color(0xFFFF9800),
    pomodoroIdle: _LightPalette.pomodoroIdle,
    pomodoroStopButton: Color(0xFFE07A5F),
    onPomodoroAccent: Colors.white,
  );

  static const AppSemanticColors dark = AppSemanticColors(
    pomodoroComplete: Color(0xFF66BB6A),
    pomodoroReset: Color(0xFFFFB74D),
    pomodoroIdle: Color(0xFFFF8A80),
    pomodoroStopButton: Color(0xFFFF8A70),
    onPomodoroAccent: Color(0xFF0D141C),
  );

  final Color pomodoroComplete;
  final Color pomodoroReset;
  final Color pomodoroIdle;
  final Color pomodoroStopButton;
  final Color onPomodoroAccent;

  @override
  AppSemanticColors copyWith({
    Color? pomodoroComplete,
    Color? pomodoroReset,
    Color? pomodoroIdle,
    Color? pomodoroStopButton,
    Color? onPomodoroAccent,
  }) {
    return AppSemanticColors(
      pomodoroComplete: pomodoroComplete ?? this.pomodoroComplete,
      pomodoroReset: pomodoroReset ?? this.pomodoroReset,
      pomodoroIdle: pomodoroIdle ?? this.pomodoroIdle,
      pomodoroStopButton: pomodoroStopButton ?? this.pomodoroStopButton,
      onPomodoroAccent: onPomodoroAccent ?? this.onPomodoroAccent,
    );
  }

  @override
  AppSemanticColors lerp(ThemeExtension<AppSemanticColors>? other, double t) {
    if (other is! AppSemanticColors) return this;
    return AppSemanticColors(
      pomodoroComplete: Color.lerp(
        pomodoroComplete,
        other.pomodoroComplete,
        t,
      )!,
      pomodoroReset: Color.lerp(pomodoroReset, other.pomodoroReset, t)!,
      pomodoroIdle: Color.lerp(pomodoroIdle, other.pomodoroIdle, t)!,
      pomodoroStopButton: Color.lerp(
        pomodoroStopButton,
        other.pomodoroStopButton,
        t,
      )!,
      onPomodoroAccent: Color.lerp(
        onPomodoroAccent,
        other.onPomodoroAccent,
        t,
      )!,
    );
  }
}
