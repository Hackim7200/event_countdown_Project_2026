import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({
    super.key,
    required this.title,
    /// When the screen is inside another [Scaffold] (e.g. Amplify Authenticator),
    /// [Scaffold.of] can resolve to the parent and [openEndDrawer] will not open
    /// your [endDrawer]. Pass the same key you set on your inner [Scaffold].
    this.drawerScaffoldKey,
    /// When set, the account action runs this instead of opening an [endDrawer]
    /// (e.g. guest mode with no drawer).
    this.onAccountTap,
  });

  final String title;
  final GlobalKey<ScaffoldState>? drawerScaffoldKey;
  final VoidCallback? onAccountTap;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      centerTitle: true,
      actions: [
        IconButton(
          icon: const Icon(Icons.account_circle_outlined),
          tooltip: onAccountTap != null ? 'Sign in for sync' : 'Profile',
          onPressed: () {
            final custom = onAccountTap;
            if (custom != null) {
              custom();
              return;
            }
            final key = drawerScaffoldKey;
            if (key?.currentState != null) {
              key!.currentState!.openEndDrawer();
              return;
            }
            Scaffold.of(context).openEndDrawer();
          },
        ),
      ],
    );
  }
}
