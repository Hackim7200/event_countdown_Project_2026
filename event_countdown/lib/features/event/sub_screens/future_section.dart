import 'package:event_countdown/features/event/services/event_service.dart';
import 'package:event_countdown/features/event/widgets/event_card.dart';
import 'package:event_countdown/features/models/event_model.dart';
import 'package:flutter/material.dart';

class FutureSection extends StatefulWidget {
  const FutureSection({super.key});

  @override
  State<FutureSection> createState() => _FutureSectionState();
}

class _FutureSectionState extends State<FutureSection> {
  final EventService _eventService = EventService();
  List<Event> _futureEvents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    if (mounted) {
      setState(() => _isLoading = true);
    }
    final events = await _eventService.getEvents(futureOrPast: 'future');
    if (mounted) {
      setState(() {
        _futureEvents = events;
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

    if (_futureEvents.isEmpty) {
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          children: const [
            SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_note, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No upcoming events', style: TextStyle(fontSize: 18)),
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
        itemCount: _futureEvents.length,
        itemBuilder: (context, index) {
          final event = _futureEvents[index];
          return EventCard(key: ValueKey(event.id), event: event);
        },
      ),
    );
  }
}
