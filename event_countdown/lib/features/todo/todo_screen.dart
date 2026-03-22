import 'package:event_countdown/core/widgets/app_drawer.dart';
import 'package:event_countdown/features/todo/sub_screens/today_screen.dart';
import 'package:event_countdown/features/todo/sub_screens/tomorrow_screen.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(title: const Text("Todo"), centerTitle: true),
        drawer: const AppDrawer(),

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
