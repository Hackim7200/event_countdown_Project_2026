import 'dart:async';

import 'package:flutter/material.dart';

/// Small widget that shows a live countdown in minutes until a period end time.
///
/// [periodEndTimeDecimalHours] is the end time expressed in decimal hours
/// (e.g. 14.5 == 14:30). The widget recomputes the remaining minutes every
/// minute and only rebuilds itself, not the parent list.
class PeriodCountdownText extends StatefulWidget {
  const PeriodCountdownText({
    super.key,
    required this.periodEndTimeDecimalHours,
    this.color,
  });

  final double periodEndTimeDecimalHours;
  final Color? color;

  @override
  State<PeriodCountdownText> createState() => _PeriodCountdownTextState();
}

class _PeriodCountdownTextState extends State<PeriodCountdownText> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(minutes: 1), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  double _currentTimeAsDecimal() {
    final now = DateTime.now();
    return now.hour + now.minute / 60.0 + now.second / 3600.0;
  }

  @override
  Widget build(BuildContext context) {
    final minutesUntilEnd =
        (widget.periodEndTimeDecimalHours - _currentTimeAsDecimal()) * 60;
    final minsDisplay = (minutesUntilEnd < 0)
        ? 0
        : minutesUntilEnd.round().clamp(0, 9999);

    final theme = Theme.of(context);
    final color = widget.color ?? theme.colorScheme.primary;

    return Text(
      '$minsDisplay mins',
      style: theme.textTheme.bodySmall?.copyWith(color: color),
    );
  }
}
