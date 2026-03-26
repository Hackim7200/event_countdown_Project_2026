import 'package:flutter/material.dart';

/// Shared chrome for Amplify Authenticator custom steps (header, card, optional footer).
class AuthenticatorLayout extends StatelessWidget {
  const AuthenticatorLayout({
    super.key,
    required this.title,
    required this.subtitle,
    this.belowCard,
    required this.child,
  });

  final String title;
  final String subtitle;
  final Widget child;
  final Widget? belowCard;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final c = t.colorScheme;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 30),
          _AuthBrandMark(color: c.primary),
          const SizedBox(height: 28),
          Text(
            title,
            style: t.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: t.textTheme.bodyMedium?.copyWith(color: c.onSurfaceVariant),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          Material(
            color: c.surface,
            elevation: 1,
            borderRadius: BorderRadius.circular(16),
            clipBehavior: Clip.antiAlias,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
              child: child,
            ),
          ),
          if (belowCard != null) ...[
            const SizedBox(height: 20),
            belowCard!,
          ],
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _AuthBrandMark extends StatelessWidget {
  const _AuthBrandMark({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Icon(Icons.event_rounded, size: 30, color: color),
      ),
    );
  }
}
