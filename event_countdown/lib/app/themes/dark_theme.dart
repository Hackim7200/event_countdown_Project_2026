part of 'package:event_countdown/app/theme.dart';

// Everything for the dark appearance: color list, Material color scheme, fonts,
// and the final ThemeData the app passes to MaterialApp as `darkTheme:`.

// ─────────────────────────────────────────────────────────────────────────────
// Dark theme
// ─────────────────────────────────────────────────────────────────────────────
// Structure (same as [light_theme.dart]):
//   1. [_DarkPalette] — raw colors
//   2. [_darkColorScheme] — Material [ColorScheme]
//   3. [_darkTextTheme] — typography
//   4. [darkTheme] — assembled [ThemeData]
// ─────────────────────────────────────────────────────────────────────────────

/// Raw palette for the dark theme (parallel field names to [_LightPalette]).
/// Scaffold is darker than [surface] so cards and inputs read clearly.
abstract final class _DarkPalette {
  const _DarkPalette._();

  static const Color scaffold = Color(0xFF0F1419);
  static const Color surface = Color(0xFF1A222C);
  static const Color onSurface = Color(0xFFE8EEF4);
  static const Color onSurfaceVariant = Color(0xFFB0BEC9);
  static const Color primary = Color(0xFF9BB8E8);
  static const Color onPrimary = Color(0xFF0D141C);
  static const Color secondary = Color(0xFF7CC4FF);
  static const Color onSecondary = Color(0xFF0D141C);
  static const Color outline = Color(0xFF4A5D73);
  static const Color error = Color(0xFFFFB4AB);
  static const Color onError = Color(0xFF690005);
}

final ColorScheme _darkColorScheme = ColorScheme.dark(
  primary: _DarkPalette.primary,
  onPrimary: _DarkPalette.onPrimary,
  primaryContainer: Color(0xFF2D3A4D),
  onPrimaryContainer: Color(0xFFD6E4FF),
  secondary: _DarkPalette.secondary,
  onSecondary: _DarkPalette.onSecondary,
  secondaryContainer: Color(0xFF1E3A52),
  onSecondaryContainer: Color(0xFFB8E0FF),
  error: _DarkPalette.error,
  onError: _DarkPalette.onError,
  surface: _DarkPalette.surface,
  onSurface: _DarkPalette.onSurface,
  onSurfaceVariant: _DarkPalette.onSurfaceVariant,
  outline: _DarkPalette.outline,
  outlineVariant: Color(0xFF3A4758),
  shadow: Colors.black,
  scrim: Color(0x99000000),
  inverseSurface: _DarkPalette.onSurface,
  onInverseSurface: _DarkPalette.surface,
);

TextTheme get _darkTextTheme => TextTheme(
  headlineSmall: TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: _DarkPalette.onSurface,
  ),
  titleMedium: TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: _DarkPalette.onSurface,
  ),
  titleSmall: TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: _DarkPalette.onSurface,
  ),
  bodyMedium: TextStyle(fontSize: 16, color: _DarkPalette.onSurface),
  bodySmall: TextStyle(fontSize: 13, color: _DarkPalette.onSurfaceVariant),
  labelLarge: TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: _DarkPalette.onSurface,
  ),
);

final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  useMaterial3: true,
  colorScheme: _darkColorScheme,
  scaffoldBackgroundColor: _DarkPalette.scaffold,
  appBarTheme: const AppBarTheme(
    backgroundColor: _DarkPalette.scaffold,
    foregroundColor: _DarkPalette.onSurface,
    elevation: 0,
    surfaceTintColor: Colors.transparent,
  ),
  tabBarTheme: TabBarThemeData(
    dividerColor: Colors.transparent,
    labelColor: _DarkPalette.primary,
    unselectedLabelColor: _DarkPalette.onSurfaceVariant,
    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
    unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal),
  ),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: _DarkPalette.scaffold,
    selectedItemColor: _DarkPalette.primary,
    unselectedItemColor: _DarkPalette.onSurfaceVariant,
    showUnselectedLabels: true,
    type: BottomNavigationBarType.fixed,
  ),
  dividerTheme: DividerThemeData(
    color: _DarkPalette.outline.withValues(alpha: 0.45),
  ),
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: _DarkPalette.primary,
    foregroundColor: _DarkPalette.onPrimary,
  ),
  inputDecorationTheme: _inputDecorationTheme(
    fill: _DarkPalette.surface,
    accent: _DarkPalette.primary,
    label: _DarkPalette.onSurface,
    errorBorder: _LightPalette.error,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: _elevatedButtonStyle(
      background: _DarkPalette.primary,
      foreground: _DarkPalette.onPrimary,
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: _outlinedButtonStyle(
      foreground: _DarkPalette.primary,
      borderAlpha: 0.55,
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(foregroundColor: _DarkPalette.primary),
  ),
  dialogTheme: const DialogThemeData(
    backgroundColor: _DarkPalette.surface,
    surfaceTintColor: Colors.transparent,
    elevation: 3,
  ),
  bottomSheetTheme: const BottomSheetThemeData(
    backgroundColor: _DarkPalette.surface,
    surfaceTintColor: Colors.transparent,
    modalBackgroundColor: _DarkPalette.surface,
  ),
  snackBarTheme: SnackBarThemeData(
    backgroundColor: Color(0xFF2D3542),
    contentTextStyle: TextStyle(color: _DarkPalette.onSurface),
    actionTextColor: _DarkPalette.primary,
    behavior: SnackBarBehavior.floating,
  ),
  listTileTheme: ListTileThemeData(
    iconColor: _DarkPalette.onSurfaceVariant,
    textColor: _DarkPalette.onSurface,
  ),
  popupMenuTheme: PopupMenuThemeData(
    color: _DarkPalette.surface,
    surfaceTintColor: Colors.transparent,
    textStyle: TextStyle(color: _DarkPalette.onSurface),
  ),
  textTheme: _darkTextTheme,
  extensions: const [AppSemanticColors.dark],
);
