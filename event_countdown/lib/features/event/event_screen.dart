// import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:flutter/material.dart';

class EventScreen extends StatelessWidget {
  const EventScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Event"), centerTitle: true),
      body: const Center(
        child: Text('Event screen', style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
