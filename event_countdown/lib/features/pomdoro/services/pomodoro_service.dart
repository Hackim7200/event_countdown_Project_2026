import 'dart:convert';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/core/service/auth_service.dart';
import 'package:event_countdown/models/pomdoro_model.dart';

/// Service class for handling all Pomodoro-related API operations.
/// Backend uses a single-table design; all requests require the current user's id (Cognito sub).
class PomodoroService {
  static const String _apiName = 'CountdownApi';
  static const String _pomodorosEndpoint = '/pomodoros';

  final AuthService authService = AuthService();

  /// Fetches all pomodoro sessions for a todo.
  /// Returns empty list on auth/API errors.
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

   Future<void> startPomodoro(String pomodoroId) async {}
   Future<void> stopPomodoro(String pomodoroId) async {}

}
