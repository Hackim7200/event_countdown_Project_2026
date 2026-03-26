/// Single source of truth for app visuals.
///
/// In simple terms: this is the main theme entry. Your app imports this file only;
/// it pulls in light mode, dark mode, shared form/button styles, and Pomodoro colors
/// so everything looks consistent. You do not import the other `theme_*.dart` files
/// directly.
///
/// **Layout**
/// - [theme_shared.dart]: form fields and buttons used by both themes.
/// - [light_theme.dart]: light palette, [ColorScheme], typography, [lightTheme].
/// - [semantic_colors.dart]: [AppSemanticColors] (Pomodoro extension).
/// - [dark_theme.dart]: dark palette, [ColorScheme], typography, [darkTheme].
///
/// **Usage**
/// - Prefer [Theme.of] / [ColorScheme] / [TextTheme] in widgets.
/// - Pomodoro accents: `Theme.of(context).extension<AppSemanticColors>()`.
/// - Do not duplicate hex values outside this library.
///
/// **Contents**
/// - [_LightPalette] / [_DarkPalette]: raw colors (`scaffold`, `surface`, `onSurface`, …).
/// - [AppSemanticColors]: theme extension for Pomodoro UI states.
/// - [lightTheme] / [darkTheme]: assembled [ThemeData] for the app.
library;

import 'package:flutter/material.dart';

part 'themes/theme_shared.dart';
part 'themes/light_theme.dart';
part 'themes/semantic_colors.dart';
part 'themes/dark_theme.dart';
