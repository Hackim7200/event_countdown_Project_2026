import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/app/theme.dart';
import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  Future<String> _getUserEmail() async {
    try {
      final attributes = await Amplify.Auth.fetchUserAttributes();
      return attributes
          .firstWhere(
            (attr) => attr.userAttributeKey == AuthUserAttributeKey.email,
          )
          .value;
    } catch (_) {
      return '';
    }
  }

  Future<void> _signOut(BuildContext context) async {
    Navigator.pop(context);
    await Amplify.Auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          FutureBuilder<String>(
            future: _getUserEmail(),
            builder: (context, snapshot) {
              return DrawerHeader(
                decoration: const BoxDecoration(color: AppColors.primary),
                child: SizedBox(
                  width: double.infinity,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      const CircleAvatar(
                        radius: 28,
                        backgroundColor: Colors.white24,
                        child: Icon(
                          Icons.person,
                          size: 30,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        snapshot.data ?? '',
                        style: Theme.of(
                          context,
                        ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.list),
            title: const Text('Routines'),
          ),
          ListTile(
            leading: const Icon(Icons.event),
            title: const Text('Success Criteria'),
          ),

          const Spacer(),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings [Coming Soon]'),
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign out'),
            onTap: () => _signOut(context),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
