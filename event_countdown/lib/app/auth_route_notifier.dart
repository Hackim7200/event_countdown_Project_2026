import 'dart:async';

import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/foundation.dart';

/// Drives [GoRouter] redirects when the Cognito session changes.
class AuthRouteNotifier extends ChangeNotifier {
  AuthRouteNotifier() {
    _hubSub = Amplify.Hub.listen(HubChannel.Auth, (_) {
      unawaited(refresh());
    });
  }

  StreamSubscription<AuthHubEvent>? _hubSub;
  bool _signedIn = false;

  bool get isSignedIn => _signedIn;

  Future<void> refresh() async {
    try {
      final session =
          await Amplify.Auth.fetchAuthSession() as CognitoAuthSession;
      final next = session.isSignedIn;
      if (next != _signedIn) {
        _signedIn = next;
        notifyListeners();
      }
    } catch (_) {
      if (_signedIn) {
        _signedIn = false;
        notifyListeners();
      }
    }
  }

  @override
  void dispose() {
    unawaited(_hubSub?.cancel());
    super.dispose();
  }
}
