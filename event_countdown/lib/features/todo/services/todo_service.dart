import 'dart:convert';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/models/todo_model.dart';

/// Service class for handling all Todo-related API operations.
/// Backend uses a single-table design; all requests require the current user's id (Cognito sub).
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

  /// Returns the current user's id (Cognito sub) for single-table API requests.
  Future<String?> getUserId() async {
    try {
      final user = await Amplify.Auth.getCurrentUser();
      return user.userId;
    } catch (e) {
      safePrint('Error getting current user: $e');
      return null;
    }
  }

  /// Fetches all todos from the API for the current user.
  /// Returns an empty list if the user is not signed in or if the request fails.
  Future<List<Todo>> getTodos() async {
    try {
      final token = await getIdToken();
      final userId = await getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return [];
      }

      final response = await Amplify.API
          .get(
            _todosEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId},
            headers: {'Authorization': 'Bearer $token'},
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
      final userId = await getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return false;
      }

      safePrint('Completing todo with id: $id');

      final response = await Amplify.API
          .put(
            _todosEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId, 'id': id},
            body: HttpPayload.json({'completed': true}),
            headers: {'Authorization': 'Bearer $token'},
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
  /// Backend expects [date] and [userId] for single-table access.
  Future<bool> addTodo({
    required String title,
    required DateTime dueDate,
    required int pomodoros,
  }) async {
    try {
      final token = await getIdToken();
      final userId = await getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return false;
      }

      final response = await Amplify.API
          .post(
            _todosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'title': title,
              'completed': false,
              'date': dueDate.toIso8601String(),
              'createdAt': DateTime.now().toIso8601String(),
              'pomodoros': pomodoros,
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      safePrint(
        'Todo added (${response.statusCode}): ${response.decodeBody()}',
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } on ApiException catch (e) {
      safePrint('Todo create API error: $e');
      return false;
    } catch (e) {
      safePrint('Error creating todo: $e');
      return false;
    }
  }
}
