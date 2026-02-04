import 'dart:convert';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/models/todo_model.dart';

/// Service class for handling all Todo-related API operations.
class TodoService {
  static const String _apiName = 'CountdownApi';
  static const String _todosEndpoint = '/todos';

  /// Returns the user's ID token, or null if not signed in.
  Future<String?> getIdToken() async {
    try {
      final session =
          await Amplify.Auth.fetchAuthSession() as CognitoAuthSession;
      if (!session.isSignedIn) return null;
      return session.userPoolTokensResult.value.idToken.raw;
    } catch (e) {
      safePrint('Error fetching auth session: $e');
      return null;
    }
  }

  /// Fetches all todos from the API.
  /// Returns an empty list if the user is not signed in or if the request fails.
  Future<List<Todo>> getTodos() async {
    try {
      final token = await getIdToken();
      if (token == null) {
        safePrint('User is not signed in');
        return [];
      }

      final response = await Amplify.API
          .get(
            _todosEndpoint,
            apiName: _apiName,
            headers: {'Authorization': token},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Request failed with status: ${response.statusCode}');
        return [];
      }

      final body = response.decodeBody();
      final jsonList = jsonDecode(body) as List<dynamic>;
      return jsonList
          .map((json) => Todo.fromJson(json as Map<String, dynamic>))
          .toList();
    } on ApiException catch (e) {
      safePrint('Query failed: $e');
      return [];
    }
  }

  /// Marks a todo as completed.
  /// Returns true if successful, false otherwise.
  Future<bool> completeTodo(String id) async {
    try {
      final token = await getIdToken();
      if (token == null) {
        safePrint('User is not signed in');
        return false;
      }

      safePrint('Completing todo with id: $id');

      final response = await Amplify.API
          .put(
            _todosEndpoint,
            apiName: _apiName,
            queryParameters: {'id': id},
            body: HttpPayload.json({'completed': true}),
            headers: {'Authorization': token},
          )
          .response;

      safePrint(
        'Complete todo response (${response.statusCode}): ${response.decodeBody()}',
      );

      return response.statusCode == 200;
    } catch (e) {
      safePrint('Error completing todo: $e');
      return false;
    }
  }

  /// Adds a new todo.
  /// Returns true if successful, false otherwise.
  Future<bool> addTodo({
    required String title,
    required DateTime dueDate,
    required int pomodoros,
  }) async {
    try {
      final token = await getIdToken();
      if (token == null) {
        safePrint('User is not signed in');
        return false;
      }

      final response = await Amplify.API
          .post(
            _todosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'title': title,
              'completed': false,
              'dueDate': dueDate.toIso8601String(),
              'createdAt': DateTime.now().toIso8601String(),
              'pomodoros': pomodoros,
            }),
            headers: {'Authorization': token},
          )
          .response;

      safePrint(
        'Todo added (${response.statusCode}): ${response.decodeBody()}',
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      safePrint('Error creating todo: $e');
      return false;
    }
  }
}
