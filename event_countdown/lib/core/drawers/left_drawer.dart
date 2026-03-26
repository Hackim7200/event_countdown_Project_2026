import 'package:flutter/material.dart';

class LeftDrawer extends StatelessWidget {
  const LeftDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: scheme.primary),
            child: SizedBox(
              width: double.infinity,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    'Functions',
                    style: textTheme.bodyMedium?.copyWith(
                      color: scheme.onPrimary.withValues(alpha: 0.85),
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
          const ListTile(
            leading: Icon(Icons.list),
            title: Text('Routines'),
          ),
          const ListTile(
            leading: Icon(Icons.event),
            title: Text('Success Criteria'),
          ),
        ],
      ),
    );
  }
}
