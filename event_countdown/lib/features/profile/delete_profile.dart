import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/profile/profile_service.dart';
import 'package:flutter/material.dart';

/// Explains account deletion: removes app data via API, then [Amplify.Auth.deleteUser].
class DeleteProfile extends StatefulWidget {
  const DeleteProfile({super.key});

  @override
  State<DeleteProfile> createState() => _DeleteProfileState();
}

class _DeleteProfileState extends State<DeleteProfile> {
  bool _acknowledged = false;
  bool _isDeleting = false;
  final ProfileService _profileService = ProfileService();

  Future<void> _confirmAndDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final scheme = Theme.of(dialogContext).colorScheme;
        return AlertDialog(
          title: const Text('Delete account?'),
          content: const Text(
            'This cannot be undone. Your account will be permanently removed.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: scheme.error,
                foregroundColor: scheme.onError,
              ),
              onPressed: () => Navigator.pop(dialogContext, true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
    if (confirmed != true || !mounted) return;

    setState(() => _isDeleting = true);
    try {
      final dataRemoved = await _profileService.deleteAllAppDataForCurrentUser();
      if (!mounted) return;
      if (!dataRemoved) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Could not remove your saved data. Check your connection and try again.',
            ),
          ),
        );
        return;
      }

      await Amplify.Auth.deleteUser();
      if (!mounted) return;
      Navigator.of(context).popUntil((route) => route.isFirst);
    } on AuthException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.message)));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Could not delete account: $e')));
    } finally {
      if (mounted) setState(() => _isDeleting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final scheme = theme.colorScheme;
    final warningFill = scheme.error.withValues(alpha: 0.08);
    final warningBorder = scheme.error.withValues(alpha: 0.35);

    return Scaffold(
      appBar: AppBar(title: const Text('Delete account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: warningFill,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.warning_amber_rounded,
                    size: 48,
                    color: scheme.error,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Delete your account',
                style: textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'You will lose access to your events, todos, and profile. '
                'This action is permanent.',
                style: textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurfaceVariant,
                  height: 1.45,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: warningBorder),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('What happens next', style: textTheme.titleMedium),
                      const SizedBox(height: 14),
                      _ConsequenceRow(
                        icon: Icons.person_off_outlined,
                        text:
                            'Your sign-in will be removed from this app and Cognito.',
                      ),
                      const SizedBox(height: 12),
                      _ConsequenceRow(
                        icon: Icons.cloud_off_outlined,
                        text:
                            'Data tied to your account in the backend will be deleted.',
                      ),
                      const SizedBox(height: 12),
                      _ConsequenceRow(
                        icon: Icons.lock_reset_outlined,
                        text: 'You cannot undo this from the app.',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              CheckboxListTile(
                value: _acknowledged,
                onChanged: _isDeleting
                    ? null
                    : (v) => setState(() => _acknowledged = v ?? false),
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(
                  'I understand my account will be permanently deleted.',
                  style: textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: scheme.error,
                  foregroundColor: scheme.onError,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: (!_acknowledged || _isDeleting)
                    ? null
                    : _confirmAndDelete,
                child: _isDeleting
                    ? SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: scheme.onError,
                        ),
                      )
                    : const Text('Delete my account'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _isDeleting
                    ? null
                    : () => Navigator.of(context).maybePop(),
                child: const Text('Cancel'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ConsequenceRow extends StatelessWidget {
  const _ConsequenceRow({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final scheme = theme.colorScheme;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 22, color: scheme.primary),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: textTheme.bodyMedium?.copyWith(
              color: scheme.onSurface,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}
