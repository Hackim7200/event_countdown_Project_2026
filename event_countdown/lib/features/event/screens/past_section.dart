import 'package:flutter/material.dart';

class PastSection extends StatelessWidget {
  const PastSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        _SimpleEventTile(
          title: 'Demo: Design Sync',
          subtitle: 'Last Week · 3:30 PM',
        ),
        _SimpleEventTile(
          title: 'Demo: Sprint Retro',
          subtitle: 'Two Weeks Ago · 11:00 AM',
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
      leading: const Icon(Icons.history),
      title: Text(title),
      subtitle: Text(subtitle),
    );
  }
}
