import 'package:event_countdown/features/todo/sub_screens/today_screen.dart';
import 'package:event_countdown/features/todo/sub_screens/tomorrow_screen.dart';
import 'package:event_countdown/features/todo/forms/add_todo.dart';
import 'package:event_countdown/features/models/todo_model.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  /// Incremented when a todo is added so tab sections refetch from the API.
  int _refreshKey = 0;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(title: const Text("Todo"), centerTitle: true),
        floatingActionButton: FloatingActionButton(
          child: const Icon(Icons.add),
          onPressed: () async {
            final newTodo = await showModalBottomSheet<Todo>(
              context: context,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (context) => const AddTaskBottomSheet(),
            );
            if (!mounted) return;
            if (newTodo != null) {
              setState(() => _refreshKey++);
            }
          },
        ),
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
                key: ValueKey(_refreshKey),
                children: const [TodaySection(), TomorrowSection()],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
