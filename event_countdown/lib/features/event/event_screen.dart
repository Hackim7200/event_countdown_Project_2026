import 'package:event_countdown/features/event/forms/add_event_bottom_sheet.dart';
import 'package:event_countdown/features/event/sub_screens/future_section.dart';
import 'package:event_countdown/features/event/sub_screens/past_section.dart';
import 'package:flutter/material.dart';

class EventScreen extends StatefulWidget {
  const EventScreen({super.key});

  @override
  State<EventScreen> createState() => _EventScreenState();
}

class _EventScreenState extends State<EventScreen> {
  int _refreshKey = 0;

  Future<void> _openAddEventSheet() async {
    final created = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const AddEventBottomSheet(),
    );
    if (!mounted) return;
    if (created == true) {
      setState(() => _refreshKey++);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(title: const Text("Events"), centerTitle: true),

        floatingActionButton: FloatingActionButton(
          onPressed: _openAddEventSheet,
          child: const Icon(Icons.add),
        ),
        body: Column(
          children: [
            const TabBar(
              tabs: [
                Tab(text: "Past"),
                Tab(text: "Future"),
              ],
            ),
            Expanded(
              child: TabBarView(
                key: ValueKey(_refreshKey),
                children: const [PastSection(), FutureSection()],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
