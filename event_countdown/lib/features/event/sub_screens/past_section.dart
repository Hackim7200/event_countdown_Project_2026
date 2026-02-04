import 'package:event_countdown/features/event/widgets/event_card.dart';
import 'package:event_countdown/features/models/event_model.dart';
import 'package:flutter/material.dart';

class PastSection extends StatefulWidget {
  const PastSection({super.key});

  @override
  State<PastSection> createState() => _PastSectionState();
}

class _PastSectionState extends State<PastSection> {
  List<Event> _pastEvents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    // Simulate loading delay
    await Future.delayed(const Duration(milliseconds: 500));
    if (mounted) {
      setState(() {
        _pastEvents = DummyEvents.getPastEvents();
        _isLoading = false;
      });
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _isLoading = true;
    });
    await _loadEvents();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_pastEvents.isEmpty) {
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          children: const [
            SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No past events', style: TextStyle(fontSize: 18)),
                  Text(
                    'Pull down to refresh',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8),
        itemCount: _pastEvents.length,
        itemBuilder: (context, index) {
          final event = _pastEvents[index];
          return EventCard(key: ValueKey(event.id), event: event);
        },
      ),
    );
  }
}
