import 'dart:convert';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/core/service/auth_service.dart';
import 'package:event_countdown/features/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';

/// Service class for handling all Pomodoro-related API operations.
/// Backend uses a single-table design; all requests require the current user's id (Cognito sub).
class PomodoroService implements PomodoroRepository {
  static const String _apiName = 'CountdownApi';
  static const String _pomodorosEndpoint = '/pomodoros';

  final AuthService authService = AuthService();

  /// Fetches all pomodoro sessions for a todo.
  /// Returns empty list on auth/API errors.
  @override
  Future<List<Pomodoro>> getPomodoros(String todoId) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        throw Exception('Not signed in');
      }

      final response = await Amplify.API
          .get(
            _pomodorosEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId, 'todoId': todoId},
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Get pomodoros failed: ${response.statusCode}');
        throw Exception('Failed to load pomodoros: ${response.statusCode}');
      }

      final body = response.decodeBody();
      final list = jsonDecode(body) as List<dynamic>;
      return list
          .map((e) => Pomodoro.fromJson(e as Map<String, dynamic>))
          .toList();
    } on ApiException catch (e) {
      safePrint('Pomodoro get API error: $e');
      rethrow;
    } catch (e) {
      safePrint('Error fetching pomodoros: $e');
      rethrow;
    }
  }

  /// Adds a new pomodoro session for a todo.
  /// Returns the new pomodoro id if successful, null otherwise.
  /// Backend expects [userId], [todoId], [title], [timerDurationInMinutes].
  @override
  Future<String?> addPomodoro({
    required String todoId,
    required String title,
    required int timerDurationInMinutes,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return null;
      }

      final response = await Amplify.API
          .post(
            _pomodorosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'todoId': todoId,
              'title': title,
              'timerDurationInMinutes': timerDurationInMinutes,
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      safePrint(
        'Pomodoro added (${response.statusCode}): ${response.decodeBody()}',
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        return null;
      }

      final body = response.decodeBody();
      final json = jsonDecode(body) as Map<String, dynamic>;
      return json['id'] as String?;
    } on ApiException catch (e) {
      safePrint('Pomodoro create API error: $e');
      return null;
    } catch (e) {
      safePrint('Error creating pomodoro: $e');
      return null;
    }
  }

  /// Starts the timer for a pomodoro by saving a startedAt timestamp in the DB.
  /// Returns the server-assigned [startedAt] DateTime on success.
  @override
  Future<DateTime?> startPomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) return null;

      final response = await Amplify.API
          .put(
            _pomodorosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'todoId': todoId,
              'pomodoroId': pomodoroId,
              'action': 'start',
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Start pomodoro failed: ${response.statusCode}');
        return null;
      }

      final body = jsonDecode(response.decodeBody()) as Map<String, dynamic>;
      return DateTime.parse(body['startedAt'] as String);
    } catch (e) {
      safePrint('Error starting pomodoro: $e');
      return null;
    }
  }

  /// Pauses a running pomodoro. The server accumulates elapsed time and clears
  /// startedAt. Returns the new total [elapsedSeconds], or null on failure.
  @override
  Future<int?> pausePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) return null;

      final response = await Amplify.API
          .put(
            _pomodorosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'todoId': todoId,
              'pomodoroId': pomodoroId,
              'action': 'pause',
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) return null;

      final body = jsonDecode(response.decodeBody()) as Map<String, dynamic>;
      return (body['elapsedSeconds'] as num).toInt();
    } catch (e) {
      safePrint('Error pausing pomodoro: $e');
      return null;
    }
  }

  /// Resets a pomodoro back to its initial state: clears startedAt,
  /// sets elapsedSeconds to 0, and sets status to "stopped".
  @override
  Future<bool> resetPomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) return false;

      final response = await Amplify.API
          .put(
            _pomodorosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'todoId': todoId,
              'pomodoroId': pomodoroId,
              'action': 'reset',
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      return response.statusCode == 200;
    } catch (e) {
      safePrint('Error resetting pomodoro: $e');
      return false;
    }
  }

  /// Deletes a pomodoro session.
  /// Returns true if successful, false otherwise.
  @override
  Future<bool> deletePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) return false;

      final response = await Amplify.API
          .delete(
            _pomodorosEndpoint,
            apiName: _apiName,
            queryParameters: {
              'userId': userId,
              'todoId': todoId,
              'pomodoroId': pomodoroId,
            },
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Delete pomodoro failed: ${response.statusCode}');
        return false;
      }
      return true;
    } on ApiException catch (e) {
      safePrint('Delete pomodoro API error: $e');
      return false;
    } catch (e) {
      safePrint('Error deleting pomodoro: $e');
      return false;
    }
  }

  /// Marks a pomodoro as completed in the DB.
  @override
  Future<bool> completePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) return false;

      final response = await Amplify.API
          .put(
            _pomodorosEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'todoId': todoId,
              'pomodoroId': pomodoroId,
              'action': 'complete',
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      return response.statusCode == 200;
    } catch (e) {
      safePrint('Error completing pomodoro: $e');
      return false;
    }
  }
}
