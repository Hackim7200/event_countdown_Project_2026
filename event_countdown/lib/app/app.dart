import 'dart:async';

import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/app/app_shell.dart';
import 'package:event_countdown/app/guest_home_screen.dart';
import 'package:event_countdown/app/onboarding_screen.dart';
import 'package:event_countdown/app/theme.dart';
import 'package:flutter/material.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  /// When false, show [OnboardingScreen] instead of the default sign-in step.
  bool _onboardingDismissed = false;

  /// When true (and still unauthenticated), [GuestHomeScreen] replaces Cognito UI.
  bool _guestMode = false;

  StreamSubscription<AuthHubEvent>? _authHubSub;

  @override
  void initState() {
    super.initState();
    _authHubSub = Amplify.Hub.listen(HubChannel.Auth, (AuthHubEvent event) {
      if (event.type == AuthHubEventType.signedOut ||
          event.type == AuthHubEventType.userDeleted) {
        if (mounted) {
          setState(() {
            _onboardingDismissed = false;
            _guestMode = false;
          });
        }
      }
    });
  }

  @override
  void dispose() {
    unawaited(_authHubSub?.cancel());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Authenticator(
      authenticatorBuilder: (context, state) {
        if (state.currentStep == AuthenticatorStep.loading) {
          return null;
        }
        // Guest home: custom UI while unauthenticated (see [GuestHomeScreen]).
        if (state.currentStep == AuthenticatorStep.signIn &&
            _onboardingDismissed &&
            _guestMode) {
          return GuestHomeScreen(
            onSignIn: () => setState(() => _guestMode = false),
          );
        }
        if (state.currentStep == AuthenticatorStep.signIn &&
            !_onboardingDismissed) {
          return OnboardingScreen(
            onContinue: () => setState(() => _onboardingDismissed = true),
            onContinueAsGuest: () {
              setState(() {
                _onboardingDismissed = true;
                _guestMode = true;
              });
            },
          );
        }
        return null;
      },
      child: MaterialApp(
        builder: Authenticator.builder(),
        title: 'Boilerplate',
        theme: lightTheme,
        darkTheme: darkTheme,
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        home: const AppShell(),
      ),
    );
  }
}
