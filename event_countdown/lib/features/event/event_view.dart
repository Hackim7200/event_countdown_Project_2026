import 'package:event_countdown/core/app_icons.dart';
import 'package:event_countdown/features/models/event_model.dart';
import 'package:flutter/material.dart';

class EventView extends StatelessWidget {
  const EventView({super.key, required this.event});

  final Event event;

  static const _months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  String _formatDate(DateTime date) {
    return '${_months[date.month - 1]} ${date.day}, ${date.year}';
  }

  String _formatTime(DateTime date) {
    final hour = date.hour % 12 == 0 ? 12 : date.hour % 12;
    final minute = date.minute.toString().padLeft(2, '0');
    final period = date.hour < 12 ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final daysRemaining = event.daysRemaining;
    final isPast = event.isPast;

    return Scaffold(
      appBar: AppBar(title: Text(event.title), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 16),

            // Icon
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                AppIcons.all[event.icon],
                size: 40,
                color: theme.colorScheme.primary,
              ),
            ),

            const SizedBox(height: 24),

            // Countdown
            Text(
              isPast ? '${daysRemaining.abs()} days ago' : '$daysRemaining',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            if (!isPast)
              Text(
                daysRemaining == 1 ? 'day remaining' : 'days remaining',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),

            const SizedBox(height: 32),

            // Date
            _InfoRow(
              icon: Icons.calendar_today,
              label: 'Date',
              value: _formatDate(event.dueDate),
            ),

            _InfoRow(
              icon: Icons.access_time,
              label: 'Time',
              value: _formatTime(event.dueDate),
            ),

            // Description
            if (event.description != null && event.description!.isNotEmpty)
              _InfoRow(
                icon: Icons.notes,
                label: 'Description',
                value: event.description!,
              ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final muted = theme.colorScheme.onSurfaceVariant;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Icon(icon, size: 22, color: muted),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: muted,
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 2),
              Text(value, style: theme.textTheme.titleMedium),
            ],
          ),
        ],
      ),
    );
  }
}
