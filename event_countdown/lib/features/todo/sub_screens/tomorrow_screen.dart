import 'package:event_countdown/features/models/todo_model.dart';
import 'package:event_countdown/features/todo/widgets/todo_card.dart';
import 'package:flutter/material.dart';

class TomorrowSection extends StatefulWidget {
  const TomorrowSection({super.key});

  @override
  State<TomorrowSection> createState() => _TomorrowSectionState();
}

class _TomorrowSectionState extends State<TomorrowSection> {
  List<Todo> _todos = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTodos();
  }

  Future<void> _loadTodos() async {
    // Simulate loading delay
    await Future.delayed(const Duration(milliseconds: 500));
    if (mounted) {
      setState(() {
        _todos = DummyTodos.getTomorrowTodos();
        _isLoading = false;
      });
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _isLoading = true;
    });
    await _loadTodos();
  }

  void _toggleComplete(String id) {
    setState(() {
      _todos = _todos.map((todo) {
        if (todo.id == id) {
          return todo.copyWith(isCompleted: !todo.isCompleted);
        }
        return todo;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_todos.isEmpty) {
      return RefreshIndicator(
        onRefresh: _refresh,
        child: ListView(
          children: const [
            SizedBox(height: 100),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_available, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No tasks for tomorrow', style: TextStyle(fontSize: 18)),
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
        itemCount: _todos.length,
        itemBuilder: (context, index) {
          final todo = _todos[index];
          return TodoCard(
            key: ValueKey(todo.id),
            todo: todo,
            onToggleComplete: () => _toggleComplete(todo.id),
          );
        },
      ),
    );
  }
}
