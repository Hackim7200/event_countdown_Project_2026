import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

/// A circular countdown timer with the time in the center.
///
/// Use [initialSeconds] for the duration (e.g. 25 * 60 for 25 minutes).
/// Tap Start to begin the countdown; tap Pause to stop. Progress ring shows
/// elapsed time when running.
class TomatoTimer extends StatefulWidget {
  const TomatoTimer({
    super.key,
    this.initialSeconds = 25 * 60,
    this.size = 200,
    this.strokeWidth = 8,
  });

  final int initialSeconds;
  final double size;
  final double strokeWidth;

  @override
  State<TomatoTimer> createState() => _TomatoTimerState();
}

class _TomatoTimerState extends State<TomatoTimer> {
  late int _secondsRemaining;
  bool _isRunning = false;
  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    _secondsRemaining = widget.initialSeconds;
  }

  @override
  void didUpdateWidget(covariant TomatoTimer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_isRunning && oldWidget.initialSeconds != widget.initialSeconds) {
      _secondsRemaining = widget.initialSeconds;
    }
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  void _start() {
    if (_isRunning) return;
    if (_secondsRemaining <= 0) {
      setState(() => _secondsRemaining = widget.initialSeconds);
    }
    setState(() => _isRunning = true);
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        if (_secondsRemaining <= 1) {
          _secondsRemaining = 0;
          _ticker?.cancel();
          _ticker = null;
          _isRunning = false;
        } else {
          _secondsRemaining--;
        }
      });
    });
  }

  void _pause() {
    _ticker?.cancel();
    _ticker = null;
    setState(() => _isRunning = false);
  }

  static String _formatDuration(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final progress = widget.initialSeconds > 0
        ? (1 - (_secondsRemaining / widget.initialSeconds)).clamp(0.0, 1.0)
        : 0.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: Size(widget.size, widget.size),
                painter: _CircleProgressPainter(
                  progress: progress,
                  strokeWidth: widget.strokeWidth,
                  backgroundColor: theme.colorScheme.surfaceContainerHighest,
                  progressColor: theme.colorScheme.primary,
                ),
              ),
              Text(
                _formatDuration(_secondsRemaining),
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.onSurface,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        FilledButton.icon(
          onPressed: _secondsRemaining > 0 ? (_isRunning ? _pause : _start) : _start,
          icon: Icon(_isRunning ? Icons.pause : Icons.play_arrow),
          label: Text(_isRunning ? 'Pause' : 'Start'),
        ),
      ],
    );
  }
}

class _CircleProgressPainter extends CustomPainter {
  _CircleProgressPainter({
    required this.progress,
    required this.strokeWidth,
    required this.backgroundColor,
    required this.progressColor,
  });

  final double progress;
  final double strokeWidth;
  final Color backgroundColor;
  final Color progressColor;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width / 2) - (strokeWidth / 2);

    // Background circle
    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, backgroundPaint);

    // Progress arc (sweeps clockwise from top)
    if (progress > 0) {
      final progressPaint = Paint()
        ..color = progressColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        -math.pi / 2,
        2 * math.pi * progress,
        false,
        progressPaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _CircleProgressPainter oldDelegate) {
    // fix: check all fields, not just progress
    return oldDelegate.progress != progress ||
        oldDelegate.strokeWidth != strokeWidth ||
        oldDelegate.backgroundColor != backgroundColor ||
        oldDelegate.progressColor != progressColor;
  }
}
