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

final ThemeData lightTheme = ThemeData(
  brightness: Brightness.light,
  useMaterial3: true,

  colorScheme: ColorScheme.light(
    primary: AppColors.primary, // Selected states, buttons, active elements
    onSurface: AppColors.primaryText.withValues(alpha: 0.7), // Unselected text

    secondary: AppColors.secondary, // FAB, accent elements
    surface: AppColors.surface, // Card backgrounds, sheets
    error: AppColors.error, // Error states
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

final ThemeData darkTheme = ThemeData();
