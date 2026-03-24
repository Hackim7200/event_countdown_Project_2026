import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key, required this.title});

  final String title;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      centerTitle: true,
      // these open the drawers that are defined below
      // leading: Builder(
      //   builder: (context) => IconButton(
      //     icon: const Icon(Icons.menu_rounded),
      //     tooltip: 'Menu',
      //     onPressed: () => Scaffold.of(context).openDrawer(),
      //   ),
      // ),
      actions: [
        Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.account_circle_outlined),
            tooltip: 'Profile',
            onPressed: () => Scaffold.of(context).openEndDrawer(),
          ),
        ),
      ],
    );
  }
}
