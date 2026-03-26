import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:event_countdown/features/auth/widget/auth_screen_secondary_button.dart';
import 'package:event_countdown/features/auth/authenticator_layout.dart';
import 'package:flutter/material.dart';

/// Custom Amplify Authenticator chrome for primary auth steps.
///
/// Other steps (MFA, TOTP, etc.) use the default Authenticator UI.
Widget? authenticatorStepBuilder(
  BuildContext context,
  AuthenticatorState state,
) {
  switch (state.currentStep) {
    case AuthenticatorStep.signIn:
      return AuthenticatorLayout(
        title: 'Welcome back',
        subtitle: 'Sign in to sync events and todos across your devices.',
        belowCard: AuthScreenSecondayButton(
          prompt: 'No account yet?',
          actionLabel: 'Sign up',
          onPressed: () => state.changeStep(AuthenticatorStep.signUp),
        ),
        child: SignInForm(),
      );
    case AuthenticatorStep.signUp:
      return AuthenticatorLayout(
        title: 'Create an account',
        subtitle: 'One account for cloud sync and backups.',
        belowCard: AuthScreenSecondayButton(
          prompt: 'Already have an account?',
          actionLabel: 'Sign in',
          onPressed: () => state.changeStep(AuthenticatorStep.signIn),
        ),
        child: SignUpForm(),
      );
    case AuthenticatorStep.confirmSignUp:
      return AuthenticatorLayout(
        title: 'Confirm sign up',
        subtitle: 'Enter the verification code we sent you.',
        child: ConfirmSignUpForm(),
      );
    case AuthenticatorStep.resetPassword:
      return AuthenticatorLayout(
        title: 'Reset password',
        subtitle: 'We’ll email a code to confirm it’s you.',
        child: ResetPasswordForm(),
      );
    case AuthenticatorStep.confirmResetPassword:
      return AuthenticatorLayout(
        title: 'New password',
        subtitle: 'Choose a new password for your account.',
        child: const ConfirmResetPasswordForm(),
      );
    default:
      return null;
  }
}
