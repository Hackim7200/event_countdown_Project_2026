import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:event_countdown/app/auth_route_notifier.dart';
import 'package:event_countdown/features/auth/authenticator_step_builder.dart';
import 'package:event_countdown/app/router.dart';
import 'package:event_countdown/app/theme.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class App extends StatefulWidget {
  const App({super.key, required this.authNotifier});

  final AuthRouteNotifier authNotifier;

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  late final GoRouter _router = createAppRouter(widget.authNotifier);

  @override
  void dispose() {
    widget.authNotifier.dispose();
    _router.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Authenticator(
      padding: EdgeInsets.zero,
      authenticatorBuilder: authenticatorStepBuilder,
      child: MaterialApp.router(
        title: 'Event Countdown',
        theme: lightTheme,
        darkTheme: darkTheme,
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        routerConfig: _router,
      ),
    );
  }
}
