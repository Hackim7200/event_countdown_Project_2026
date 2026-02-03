// import 'package:amplify_authenticator/amplify_authenticator.dart';

import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatelessWidget {
  const TodoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ember'), actions: [SignOutButton()]),
      body: const Center(
        child: Text('Todo screen', style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
