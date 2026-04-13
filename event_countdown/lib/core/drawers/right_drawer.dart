import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/profile/delete_profile.dart';
import 'package:flutter/material.dart';

/// Right-side or dedicated drawer focused on the signed-in user (account + sign out).
class RightDrawer extends StatelessWidget {
  const RightDrawer({super.key});

  static String _attribute(
    List<AuthUserAttribute> attributes,
    AuthUserAttributeKey key,
  ) {
    for (final attr in attributes) {
      if (attr.userAttributeKey == key) return attr.value;
    }
    return '';
  }

  Future<_ProfileInfo> _loadProfile() async {
    try {
      final attributes = await Amplify.Auth.fetchUserAttributes();
      final email = _attribute(attributes, AuthUserAttributeKey.email);
      final name = _attribute(attributes, AuthUserAttributeKey.name);
      final username = _attribute(
        attributes,
        AuthUserAttributeKey.preferredUsername,
      );
      final displayName = name.isNotEmpty
          ? name
          : (username.isNotEmpty ? username : 'Account');
      return _ProfileInfo(displayName: displayName, email: email);
    } catch (_) {
      return const _ProfileInfo(displayName: 'Account', email: '');
    }
  }

  Future<void> _signOut(BuildContext context) async {
    Navigator.pop(context);
    await Amplify.Auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final scheme = theme.colorScheme;

    return Drawer(
      child: SafeArea(
        child: FutureBuilder<_ProfileInfo>(
          future: _loadProfile(),
          builder: (context, snapshot) {
            final info =
                snapshot.data ??
                const _ProfileInfo(displayName: '…', email: '');

            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DrawerHeader(
                  margin: EdgeInsets.zero,
                  decoration: BoxDecoration(color: scheme.primary),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundColor: scheme.onPrimary.withValues(
                          alpha: 0.2,
                        ),
                        child: Icon(
                          Icons.person,
                          size: 36,
                          color: scheme.onPrimary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        info.email,
                        style: textTheme.titleSmall?.copyWith(
                          color: scheme.onPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text(
                    'Profile',
                    style: textTheme.titleSmall?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ),

                ListTile(
                  leading: const Icon(Icons.manage_accounts_outlined),
                  title: const Text('Delete profile'),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const DeleteProfile(),
                    ),
                  ),
                ),

                const Spacer(),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.logout),
                  title: const Text('Sign out'),
                  onTap: () => _signOut(context),
                ),
                const SizedBox(height: 8),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _ProfileInfo {
  const _ProfileInfo({required this.displayName, required this.email});

  final String displayName;
  final String email;
}
