import 'package:flutter/material.dart';

/// Landing screen for users who are not signed in with Cognito.
///
/// Amplify Auth distinguishes **signed-in** users (user pool) from everyone else.
/// This app’s cloud APIs expect a logged-in user, so guests see this screen instead
/// of the main shell until they sign in. This matches the common pattern of offering
/// a lightweight entry point without enabling Cognito “guest / unauthenticated IAM”
/// identities (which is a separate backend option via Identity Pools).
class GuestHomeScreen extends StatelessWidget {
  const GuestHomeScreen({super.key, required this.onSignIn});

  /// Called when the user chooses to open the Amplify Authenticator sign-in flow.
  final VoidCallback onSignIn;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final muted = theme.colorScheme.onSurface.withValues(alpha: 0.75);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(flex: 2),
              Icon(
                Icons.explore_outlined,
                size: 72,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 24),
              Text(
                'Browsing as a guest',
                style: theme.textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'You can look around from here. To sync todos and events across '
                'devices, sign in with your account.',
                style: theme.textTheme.bodyMedium?.copyWith(color: muted),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              // Short note so expectations match how Amplify-protected APIs work.
              Text(
                'Cloud features use Cognito after sign-in.',
                style: theme.textTheme.bodySmall?.copyWith(color: muted),
                textAlign: TextAlign.center,
              ),
              const Spacer(flex: 3),
              FilledButton(
                onPressed: onSignIn,
                child: const Text('Sign in'),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
