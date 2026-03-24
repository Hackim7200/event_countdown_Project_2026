import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/core/service/auth_service.dart';

/// Deletes all app data for the current user via REST (DynamoDB), then the client
/// should call [Amplify.Auth.deleteUser] to remove the Cognito account.
class ProfileService {
  static const String _apiName = 'CountdownApi';
  static const String _profileEndpoint = '/profile';

  final AuthService authService = AuthService();

  /// Calls `DELETE /profile?userId=` with the signed-in user's id.
  /// Returns `true` when the API responds with 200.
  Future<bool> deleteAllAppDataForCurrentUser() async {
    try {
      final token = await authService.getIdToken();
      final userId = await authService.getUserId();
      if (token == null || userId == null) {
        safePrint('User is not signed in');
        return false;
      }

      final response = await Amplify.API
          .delete(
            _profileEndpoint,
            apiName: _apiName,
            queryParameters: {'userId': userId},
            headers: {'Authorization': 'Bearer $token'},
          )
          .response;

      if (response.statusCode != 200) {
        safePrint('Delete profile data failed: ${response.statusCode}');
        return false;
      }
      return true;
    } on ApiException catch (e) {
      safePrint('Delete profile data API error: $e');
      return false;
    } catch (e) {
      safePrint('Error deleting profile data: $e');
      return false;
    }
  }
}
