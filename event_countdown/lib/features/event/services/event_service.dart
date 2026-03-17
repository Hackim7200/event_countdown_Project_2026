import 'dart:convert';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/core/service/auth_service.dart';
import 'package:event_countdown/features/models/event_model.dart';

/// Service class for handling all Event-related API operations.
/// Backend uses a single-table design; all requests require the current user's id (Cognito sub).
class EventService {
  static const String _apiName = 'CountdownApi';
  static const String _eventsEndpoint = '/events';

  final AuthService authService = AuthService();

  /// Fetches events from the API for the current user.
  /// [futureOrPast]: use `'future'` for future events (SK > now), `'past'` for past (SK < now).
  /// Returns an empty list if the user is not signed in or if the request fails.
  Future<List<Event>> getEvents({required String futureOrPast}) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return [];
      }

      final response = await Amplify.API
          .get(
            _eventsEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId, 'futureOrPast': futureOrPast},
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
          .map((json) => Event.fromJson(json as Map<String, dynamic>))
          .toList();
    } on ApiException catch (e) {
      safePrint('Query failed: $e');
      return [];
    } catch (e) {
      safePrint('Error fetching events: $e');
      return [];
    }
  }

  /// Fetches a single event by id.
  /// Returns null if not found, not signed in, or on error.
  Future<Event?> getEventById(String id) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return null;
      }

      final response = await Amplify.API
          .get(
            _eventsEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId, 'id': id},
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        if (response.statusCode == 404) {
          safePrint('Event not found: $id');
        } else {
          safePrint('Request failed with status: ${response.statusCode}');
        }
        return null;
      }

      final body = response.decodeBody();
      final json = jsonDecode(body) as Map<String, dynamic>;
      return Event.fromJson(json);
    } on ApiException catch (e) {
      safePrint('Query failed: $e');
      return null;
    } catch (e) {
      safePrint('Error fetching event: $e');
      return null;
    }
  }

  /// Deletes an event by id.
  /// Returns true if the deletion was successful, false otherwise.
  Future<bool> deleteEvent(String id) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return false;
      }

      final response = await Amplify.API
          .delete(
            _eventsEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId, 'id': id},
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Delete failed with status: ${response.statusCode}');
        return false;
      }
      return true;
    } on ApiException catch (e) {
      safePrint('Delete event API error: $e');
      return false;
    } catch (e) {
      safePrint('Error deleting event: $e');
      return false;
    }
  }

  /// Adds a new event.
  /// Returns the new event id if successful, null otherwise.
  /// Backend expects [userId], [title], [dueDate], [description], [icon], [location].
  Future<String?> addEvent({
    required String title,
    required DateTime dueDate,
    String? description,
    required int icon,
    String? location,
  }) async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return null;
      }

      final dueDateStr = dueDate.toIso8601String();

      final response = await Amplify.API
          .post(
            _eventsEndpoint,
            apiName: _apiName,
            body: HttpPayload.json({
              'userId': userId,
              'title': title,
              'dueDate': dueDateStr,
              'description': description ?? '',
              'icon': icon,
              'location': location ?? '',
            }),
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      safePrint(
        'Event added (${response.statusCode}): ${response.decodeBody()}',
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        return null;
      }

      final body = response.decodeBody();
      final json = jsonDecode(body) as Map<String, dynamic>;
      return json['id'] as String?;
    } on ApiException catch (e) {
      safePrint('Event create API error: $e');
      return null;
    } catch (e) {
      safePrint('Error creating event: $e');
      return null;
    }
  }
}
