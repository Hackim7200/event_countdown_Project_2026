import 'package:event_countdown/core/app_icons.dart';
import 'package:event_countdown/features/event/event_view.dart';
import 'package:event_countdown/features/models/event_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback? onDelete;

  const EventCard({super.key, required this.event, this.onDelete});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Slidable(
        key: ValueKey(event.id),
        endActionPane: ActionPane(
          motion: const DrawerMotion(),
          children: [
            if (onDelete != null)
              SlidableAction(
                onPressed: (_) => onDelete!(),
                backgroundColor: scheme.error,
                foregroundColor: scheme.onError,
                icon: Icons.delete,
                label: 'Delete',
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
              ),
          ],
        ),
        child: GestureDetector(
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => EventView(event: event)),
          ),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: scheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: scheme.outline.withValues(alpha: 0.22)),
              boxShadow: [
                BoxShadow(
                  color: scheme.shadow.withValues(alpha: 0.07),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: scheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    AppIcons.all[event.icon],
                    color: scheme.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        event.title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: scheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _getTimeDifferenceText(),
                        style: TextStyle(
                          fontSize: 14,
                          color: scheme.primary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getTimeDifferenceText() {
    final DateTime now = DateTime.now();
    final Duration difference = event.dueDate.difference(now);

    final int days = difference.inDays;
    final int hours = difference.inHours % 24;
    final int minutes = difference.inMinutes % 60;

    if (difference.isNegative) {
      if (days.abs() > 1) {
        return '${days.abs()} days ago';
      } else if (days.abs() == 1) {
        return '1 day ${hours.abs()} hours ago';
      } else if (hours.abs() > 0) {
        return '${hours.abs()} hours ${minutes.abs()} minutes ago';
      } else if (minutes.abs() > 0) {
        return '${minutes.abs()} minutes ago';
      } else {
        return 'Less than a minute ago';
      }
    } else {
      if (days > 1) {
        return '$days days';
      } else if (days == 1) {
        return '1 day $hours hours';
      } else if (hours > 0) {
        return '$hours hours $minutes minutes';
      } else if (minutes > 0) {
        return '$minutes minutes';
      } else {
        return 'Less than a minute';
      }
    }
  }
}
