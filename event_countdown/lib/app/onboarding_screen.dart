import 'package:flutter/material.dart';

/// Shown before the Amplify sign-in UI until the user taps through.
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({
    super.key,
    required this.onContinue,
    required this.onContinueAsGuest,
  });

  final VoidCallback onContinue;
  final VoidCallback onContinueAsGuest;

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
                Icons.event_available_rounded,
                size: 72,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 24),
              Text(
                'Plan events & todos',
                style: theme.textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Use the focus timer without an account. Sign in only if you want '
                'todos and events synced across devices.',
                style: theme.textTheme.bodyMedium?.copyWith(color: muted),
                textAlign: TextAlign.center,
              ),
              const Spacer(flex: 3),

              // Guideline 5.1.1(v): non–account-based features (timer) must not
              // require registration — this path collects no personal data.
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: onContinue,
                child: const Text('Sign in to sync'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: onContinueAsGuest,
                child: const Text('Continue as guest'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
