part of 'package:event_countdown/app/theme.dart';

// Reusable building blocks for text fields and buttons (corners, padding, borders).
// Both light and dark themes use these so inputs and buttons match in shape and feel.

// ─────────────────────────────────────────────────────────────────────────────
// Shared form & button styling (both themes)
// ─────────────────────────────────────────────────────────────────────────────

const double _kFieldCornerRadius = 12;
final BorderRadius _fieldRadius = BorderRadius.circular(_kFieldCornerRadius);

InputDecorationTheme _inputDecorationTheme({
  required Color fill,
  required Color accent,
  required Color label,
  required Color errorBorder,
}) {
  final softBorder = BorderSide(color: accent.withValues(alpha: 0.25));
  return InputDecorationTheme(
    filled: true,
    fillColor: fill,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(
      borderRadius: _fieldRadius,
      borderSide: softBorder,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: _fieldRadius,
      borderSide: BorderSide(color: accent, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: _fieldRadius,
      borderSide: BorderSide(color: errorBorder),
    ),
    labelStyle: TextStyle(color: label.withValues(alpha: 0.65)),
    floatingLabelStyle: TextStyle(color: accent),
  );
}

ButtonStyle _elevatedButtonStyle({required Color background, required Color foreground}) {
  return ElevatedButton.styleFrom(
    backgroundColor: background,
    foregroundColor: foreground,
    elevation: 0,
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: _fieldRadius),
  );
}

ButtonStyle _outlinedButtonStyle({
  required Color foreground,
  required double borderAlpha,
}) {
  return OutlinedButton.styleFrom(
    foregroundColor: foreground,
    side: BorderSide(color: foreground.withValues(alpha: borderAlpha)),
    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
    shape: RoundedRectangleBorder(borderRadius: _fieldRadius),
  );
}
