import 'package:flutter/material.dart';

/// Event model for the countdown app
class Event {
  final String id;
  final String title;
  final String? description;
  final DateTime date;
  final int icon;

  Event({
    required this.id,
    required this.title,
    this.description,
    required this.date,
    required this.icon,
  });

  /// Calculate days remaining until the event
  int get daysRemaining {
    final now = DateTime.now();
    final difference = date.difference(now).inDays;
    return difference;
  }

  /// Check if event is in the past
  bool get isPast => date.isBefore(DateTime.now());

  /// Copy with method for immutability
  Event copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? date,
    int? icon,
  }) {
    return Event(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      date: date ?? this.date,
      icon: icon ?? this.icon,
    );
  }
}

/// Dummy data for testing the UI
class DummyEvents {
  static List<Event> getAll() {
    return [
      Event(
        id: '1',
        title: 'Birthday Party',
        description: 'My birthday celebration',
        date: DateTime.now().add(const Duration(days: 15)),
        icon: 7, // cake icon
      ),
      Event(
        id: '2',
        title: 'Team Meeting',
        description: 'Weekly sync with the team',
        date: DateTime.now().add(const Duration(days: 2)),
        icon: 4, // work icon
      ),
      Event(
        id: '3',
        title: 'Flight to Paris',
        description: 'Vacation trip',
        date: DateTime.now().add(const Duration(days: 30)),
        icon: 9, // flight icon
      ),
      Event(
        id: '4',
        title: 'Doctor Appointment',
        description: 'Annual checkup',
        date: DateTime.now().subtract(const Duration(days: 5)),
        icon: 13, // health icon
      ),
      Event(
        id: '5',
        title: 'Concert Night',
        description: 'Live music event',
        date: DateTime.now().subtract(const Duration(days: 10)),
        icon: 15, // music icon
      ),
      Event(
        id: '6',
        title: 'Project Deadline',
        description: 'Submit final deliverables',
        date: DateTime.now().add(const Duration(hours: 5)),
        icon: 18, // code icon
      ),
    ];
  }

  static List<Event> getFutureEvents() {
    return getAll().where((e) => !e.isPast).toList()
      ..sort((a, b) => a.date.compareTo(b.date));
  }

  static List<Event> getPastEvents() {
    return getAll().where((e) => e.isPast).toList()
      ..sort((a, b) => b.date.compareTo(a.date));
  }
}
