import 'package:event_countdown/features/todo/sub_screens/today_screen.dart';
import 'package:event_countdown/features/todo/sub_screens/tomorrow_screen.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  /// Incremented when a todo is added so tab sections refetch from the API.

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(title: const Text("Todo"), centerTitle: true),

        body: Column(
          children: [
            const TabBar(
              tabs: [
                Tab(text: "Today"),
                Tab(text: "Tomorrow"),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: const [TodaySection(), TomorrowSection()],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
