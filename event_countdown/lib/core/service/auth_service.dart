import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

/// Service for authentication and current user identity.
/// Provides the user's ID (Cognito sub) and ID token for API requests.
class AuthService {
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
}
