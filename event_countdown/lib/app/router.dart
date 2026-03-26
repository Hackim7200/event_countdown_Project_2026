import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:event_countdown/app/app_layout.dart';
import 'package:event_countdown/app/auth_route_notifier.dart';
import 'package:event_countdown/app/onboarding_screen.dart';
import 'package:event_countdown/features/guest/guest_todo_screen.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Route paths for navigation and redirects.
abstract final class AppRoutes {
  static const onboarding = '/';
  static const guest = '/guest';
  static const home = '/home';
}

GoRouter createAppRouter(AuthRouteNotifier authNotifier) {
  return GoRouter(
    initialLocation: AppRoutes.onboarding,
    refreshListenable: authNotifier,
    redirect: (BuildContext context, GoRouterState state) {
      final loc = state.matchedLocation;
      if (authNotifier.isSignedIn &&
          (loc == AppRoutes.onboarding || loc == AppRoutes.guest)) {
        return AppRoutes.home;
      }
      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, _) => OnboardingScreen(
          onContinue: () => context.go(AppRoutes.home),
          onContinueAsGuest: () => context.go(AppRoutes.guest),
        ),
      ),
      GoRoute(
        path: AppRoutes.guest,
        builder: (context, _) =>
            GuestTodoScreen(onSignIn: () => context.go(AppRoutes.home)),
      ),
      GoRoute(
        path: AppRoutes.home,
        builder: (_, __) => const AuthenticatedView(child: AppLayout()),
      ),
    ],
  );
}
