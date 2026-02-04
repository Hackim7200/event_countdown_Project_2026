import 'dart:convert';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/models/todo.dart';
import 'package:event_countdown/features/todo/forms/add_todo.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  List<Todo> _todos = [];

  @override
  void initState() {
    super.initState();
    _refreshTodos();
  }

  /// Returns the user's ID token, or null if not signed in.
  Future<String?> _getIdToken() async {
    final session = await Amplify.Auth.fetchAuthSession() as CognitoAuthSession;
    if (!session.isSignedIn) return null;
    return session.userPoolTokensResult.value.idToken.raw;
  }

  Future<void> _refreshTodos() async {
    try {
      final token = await _getIdToken();
      if (token == null) {
        safePrint('User is not signed in');
        return;
      }

      final response = await Amplify.API
          .get(
            '/todos',
            apiName: 'CountdownApi',
            headers: {'Authorization': token},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Request failed with status: ${response.statusCode}');
        return;
      }

      final body = response.decodeBody();
      final jsonList = jsonDecode(body) as List<dynamic>;
      final todos = jsonList
          .map((json) => Todo.fromJson(json as Map<String, dynamic>))
          .toList();

      if (!mounted) return;
      setState(() => _todos = todos);
    } on ApiException catch (e) {
      safePrint('Query failed: $e');
    }
  }

  Future<void> _completeTodo(String id) async {
    try {
      final token = await _getIdToken();
      if (token == null) {
        safePrint('User is not signed in');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please sign in to complete tasks'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      safePrint('Completing todo with id: $id');

      final response = await Amplify.API
          .put(
            '/todos',
            apiName: 'CountdownApi',
            queryParameters: {'id': id},
            body: HttpPayload.json({'completed': true}),
            headers: {'Authorization': token},
          )
          .response;

      safePrint(
        'Complete todo response (${response.statusCode}): ${response.decodeBody()}',
      );

      if (response.statusCode == 200) {
        await _refreshTodos();
      } else {
        safePrint('Failed to complete todo: ${response.statusCode}');
      }
    } catch (e) {
      safePrint('Error completing todo: $e');
    }
  }

  Future<void> _addTodo() async {
    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const AddTaskBottomSheet(),
    );

    // If a task was added successfully, refresh the list
    if (result == true) {
      await _refreshTodos();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ember'), actions: [SignOutButton()]),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _todos.length,
              itemBuilder: (context, index) {
                final todo = _todos[index];
                return ListTile(
                  title: Text(todo.title),
                  trailing: Checkbox(
                    value: todo.isCompleted,
                    onChanged: (value) {
                      if (value == true) {
                        _completeTodo(todo.id);
                      }
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addTodo,
        child: const Icon(Icons.add),
      ),
    );
  }
}
