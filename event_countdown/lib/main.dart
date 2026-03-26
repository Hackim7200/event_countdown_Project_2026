import 'dart:async';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:event_countdown/app/app.dart';
import 'package:event_countdown/app/auth_route_notifier.dart';
import 'amplifyconfiguration.dart';

Future<void> main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    await _configureAmplify();
    final authNotifier = AuthRouteNotifier();
    // Restore session before first frame so GoRouter redirect sees the right route.
    // Without this, cold start stays on `/` until fetchAuthSession finishes (feels “stuck”).
    //this code below prevents the app from getting stuck on the logo screen before starting the app

    try {
      await authNotifier.refresh().timeout(const Duration(seconds: 15));
    } on TimeoutException {
      // Continue; user can retry from onboarding or auth UI.
    }
    runApp(App(authNotifier: authNotifier));
  } on AmplifyException catch (e) {
    runApp(Text("Error configuring Amplify: ${e.message}"));
  }
}

Future<void> _configureAmplify() async {
  try {
    await Amplify.addPlugin(AmplifyAuthCognito());
    await Amplify.addPlugin(AmplifyAPI());

    await Amplify.configure(amplifyconfig);
    safePrint('Successfully configured');
  } on Exception catch (e) {
    safePrint('Error configuring Amplify: $e');
  }
}

// Amplify
