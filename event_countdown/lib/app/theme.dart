import 'package:flutter/material.dart';

// Core color palette
class AppColors {
  static const Color primaryText = Color.fromRGBO(13, 20, 28, 1);

  static const Color background = Color(0xFFF7FAFC);
  static const Color primary = Color(0xFF4A739C);
  static const Color secondary = Color(0xFF0D80F2);
  static const Color surface = Colors.white;
  static const Color error = Colors.red;

  // Pomodoro specific colors
  static const Color pomodoroRed = Color.fromARGB(255, 251, 160, 160);
  static const Color pomodoroGreen = Color.fromARGB(255, 96, 220, 96);
}

final _fieldRadius = BorderRadius.circular(12);

InputDecorationTheme _inputTheme(Color fill, Color accent, Color label) {
  final soft = BorderSide(color: accent.withValues(alpha: 0.25));
  return InputDecorationTheme(
    filled: true,
    fillColor: fill,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(borderRadius: _fieldRadius, borderSide: soft),
    focusedBorder: OutlineInputBorder(
      borderRadius: _fieldRadius,
      borderSide: BorderSide(color: accent, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: _fieldRadius,
      borderSide: const BorderSide(color: AppColors.error),
    ),
    labelStyle: TextStyle(color: label.withValues(alpha: 0.65)),
    floatingLabelStyle: TextStyle(color: accent),
  );
}

ButtonStyle _elevated(Color bg, Color fg) => ElevatedButton.styleFrom(
      backgroundColor: bg,
      foregroundColor: fg,
      elevation: 0,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: _fieldRadius),
    );

final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  useMaterial3: true,
  colorScheme: ColorScheme.light(
    primary: AppColors.primary,
    onPrimary: Colors.white,
    onSurface: AppColors.primaryText.withValues(alpha: 0.7),
    onSurfaceVariant: AppColors.primaryText.withValues(alpha: 0.55),
    secondary: AppColors.secondary,
    onSecondary: Colors.white,
    surface: AppColors.surface,
    onError: Colors.white,
    error: AppColors.error,
    outline: AppColors.primary.withValues(alpha: 0.35),
  ),
  scaffoldBackgroundColor: AppColors.background,
  appBarTheme: const AppBarTheme(
    backgroundColor: AppColors.background,
    foregroundColor: AppColors.primaryText,
    elevation: 0,
  ),
  tabBarTheme: TabBarThemeData(
    dividerColor: Colors.transparent,
    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
    unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: AppColors.background,
    showUnselectedLabels: true,
  ),
  floatingActionButtonTheme: const FloatingActionButtonThemeData(),
  inputDecorationTheme: _inputTheme(
    AppColors.surface,
    AppColors.primary,
    AppColors.primaryText,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: _elevated(AppColors.primary, Colors.white),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: AppColors.primary,
      side: BorderSide(color: AppColors.primary.withValues(alpha: 0.5)),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: _fieldRadius),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(foregroundColor: AppColors.primary),
  ),
  textTheme: const TextTheme(
    headlineSmall: TextStyle(
      fontSize: 22,
      fontWeight: FontWeight.bold,
      color: AppColors.primaryText,
    ),
    titleMedium: TextStyle(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      color: AppColors.primaryText,
    ),
    bodyMedium: TextStyle(fontSize: 16, color: AppColors.primaryText),
  ),
);

final ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    brightness: Brightness.dark,
    seedColor: AppColors.primary,
  ),
  inputDecorationTheme: _inputTheme(
    const Color(0xFF2A3440),
    const Color(0xFF8FAFD4),
    const Color(0xFFE8EEF4),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: _elevated(const Color(0xFF8FAFD4), const Color(0xFF0D141C)),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: const Color(0xFF8FAFD4),
      side: const BorderSide(color: Color(0x668FAFD4)),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: _fieldRadius),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(foregroundColor: const Color(0xFF8FAFD4)),
  ),
);
