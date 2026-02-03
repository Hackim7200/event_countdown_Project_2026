import 'package:flutter/material.dart';

class FutureSection extends StatelessWidget {
  const FutureSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        _SimpleEventTile(
          title: 'Demo: Team Meetup',
          subtitle: 'Tomorrow · 10:00 AM',
        ),
        _SimpleEventTile(
          title: 'Demo: Product Review',
          subtitle: 'Next Week · 2:00 PM',
        ),
      ],
    );
  }
}

class _SimpleEventTile extends StatelessWidget {
  const _SimpleEventTile({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(Icons.event_note),
      title: Text(title),
      subtitle: Text(subtitle),
    );
  }
}
