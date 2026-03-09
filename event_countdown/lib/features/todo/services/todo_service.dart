import 'dart:convert';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/core/service/auth_service.dart';
import 'package:event_countdown/models/todo_model.dart';

/// Service class for handling all Todo-related API operations.
/// Backend uses a single-table design; all requests require the current user's id (Cognito sub).
class TodoService {
  static const String _apiName = 'CountdownApi';
  static const String _todosEndpoint = '/todos';

  final AuthService authService = AuthService();

  /// Fetches todos from the API for the current user.
  /// If [forDate] is provided, only todos for that date are returned (backend query).
  /// If [forDate] is null, no date filter is sent and the backend may return no items
  /// (backend expects date for the list query). Prefer passing [forDate] for the Today screen.
  /// Returns an empty list if the user is not signed in or if the request fails.
  Future<List<Todo>> getTodos({DateTime? forDate}) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return [];
      }

      final queryParams = <String, String>{'userId': userId};
      if (forDate != null) {
        queryParams['date'] = forDate.toIso8601String().split('T')[0];
      }

      final response = await Amplify.API
          .get(
            _todosEndpoint,
            apiName: _apiName,
            queryParameters: queryParams,
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
    } catch (e) {
      safePrint('Error fetching todos: $e');
      return [];
    }
  }

  /// Marks a todo as completed.
  /// Returns true if successful, false otherwise.
  Future<bool> completeTodo(String id) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
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
  /// Returns true if successful, false if not signed in.
  /// Throws on API/network errors so the caller can show the real error.
  /// Backend expects [date], [timePeriod] and [userId] for single-table access.
  Future<bool> addTodo({
    required String title,
    required DateTime dueDate,
    required String timePeriod,
  }) async {
    final token = await authService.getIdToken();
    final userId = await authService.getUserId();
    if (token == null || userId == null) {
      safePrint('User is not signed in');
      return false;
    }

    try {
      final response = await Amplify.API
          .post(
            _todosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'title': title,
              'completed': false,
              'date': dueDate.toIso8601String(),
              'timePeriod': timePeriod,
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      safePrint(
        'Todo added (${response.statusCode}): ${response.decodeBody()}',
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
      final body = response.decodeBody();
      throw Exception(
        'Server returned ${response.statusCode}: ${body.isNotEmpty ? body : "Unknown error"}',
      );
    } on ApiException catch (e) {
      safePrint('Todo create API error: $e');
      throw Exception('Todo API error: ${e.message}');
    } catch (e) {
      if (e is Exception) rethrow;
      safePrint('Error creating todo: $e');
      throw Exception('Failed to create task: $e');
    }
  }
}
