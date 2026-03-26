part of 'package:event_countdown/app/theme.dart';

// Everything for the light appearance: color list, Material color scheme, fonts,
// and the final ThemeData the app passes to MaterialApp as `theme:`.

// ─────────────────────────────────────────────────────────────────────────────
// Light theme
// ─────────────────────────────────────────────────────────────────────────────
// Structure (same as [dark_theme.dart]):
//   1. [_LightPalette] — raw colors
//   2. [_lightColorScheme] — Material [ColorScheme]
//   3. [_lightTextTheme] — typography
//   4. [lightTheme] — assembled [ThemeData]
// ─────────────────────────────────────────────────────────────────────────────

/// Raw palette for the light theme (parallel field names to [_DarkPalette]).
abstract final class _LightPalette {
  const _LightPalette._();

  static const Color scaffold = Color(0xFFF7FAFC);
  static const Color surface = Colors.white;
  static const Color onSurface = Color.fromRGBO(13, 20, 28, 1);
  static const Color primary = Color(0xFF4A739C);
  static const Color onPrimary = Colors.white;
  static const Color secondary = Color(0xFF0D80F2);
  static const Color onSecondary = Colors.white;
  static const Color error = Colors.red;

  /// Base swatches for [AppSemanticColors.light] (semantics live in the extension).
  static const Color pomodoroIdle = Color.fromARGB(255, 251, 160, 160);
  static const Color pomodoroComplete = Color.fromARGB(255, 96, 220, 96);
}

final ColorScheme _lightColorScheme = ColorScheme.light(
  primary: _LightPalette.primary,
  onPrimary: _LightPalette.onPrimary,
  onSurface: _LightPalette.onSurface.withValues(alpha: 0.7),
  onSurfaceVariant: _LightPalette.onSurface.withValues(alpha: 0.55),
  secondary: _LightPalette.secondary,
  onSecondary: _LightPalette.onSecondary,
  surface: _LightPalette.surface,
  onError: Colors.white,
  error: _LightPalette.error,
  outline: _LightPalette.primary.withValues(alpha: 0.35),
);

TextTheme get _lightTextTheme => TextTheme(
  headlineSmall: TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: _LightPalette.onSurface,
  ),
  titleMedium: TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: _LightPalette.onSurface,
  ),
  bodyMedium: TextStyle(fontSize: 16, color: _LightPalette.onSurface),
);

final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  useMaterial3: true,
  colorScheme: _lightColorScheme,
  scaffoldBackgroundColor: _LightPalette.scaffold,
  appBarTheme: const AppBarTheme(
    backgroundColor: _LightPalette.scaffold,
    foregroundColor: _LightPalette.onSurface,
    elevation: 0,
    surfaceTintColor: Colors.transparent,
  ),
  dividerTheme: DividerThemeData(
    color: _LightPalette.primary.withValues(alpha: 0.12),
  ),
  tabBarTheme: TabBarThemeData(
    dividerColor: Colors.transparent,
    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
    unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: _LightPalette.scaffold,
    showUnselectedLabels: true,
  ),
  floatingActionButtonTheme: const FloatingActionButtonThemeData(),
  inputDecorationTheme: _inputDecorationTheme(
    fill: _LightPalette.surface,
    accent: _LightPalette.primary,
    label: _LightPalette.onSurface,
    errorBorder: _LightPalette.error,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: _elevatedButtonStyle(
      background: _LightPalette.primary,
      foreground: _LightPalette.onPrimary,
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: _outlinedButtonStyle(
      foreground: _LightPalette.primary,
      borderAlpha: 0.5,
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(foregroundColor: _LightPalette.primary),
  ),
  textTheme: _lightTextTheme,
  extensions: const [AppSemanticColors.light],
);
