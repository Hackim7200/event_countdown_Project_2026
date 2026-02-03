import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_authenticator/amplify_authenticator.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:flutter/material.dart';

class TodoScreen extends StatelessWidget {
  const TodoScreen({super.key});

  Future<void> _addTodos() async {
    try {
      // Check if user is signed in and get token
      final session = await Amplify.Auth.fetchAuthSession();
      if (!session.isSignedIn) {
        safePrint('User is not signed in!');
        return;
      }

      // Get the Cognito ID token
      final cognitoSession = session as CognitoAuthSession;
      final idToken = cognitoSession.userPoolTokensResult.value.idToken.raw;

      final restOperation = Amplify.API.post(
        '/todos',
        apiName: 'CountdownApi',
        body: HttpPayload.json({
          'title': 'New Todo',
          'completed': false,
          'createdAt': DateTime.now().toIso8601String(),
        }),
        headers: {'Authorization': idToken},
      );
      final response = await restOperation.response;
      safePrint('Response status: ${response.statusCode}');
      final responseData = await response.decodeBody();
      safePrint('Todo added: $responseData');
    } on AuthException catch (e) {
      safePrint('Auth error: ${e.message}');
    } on ApiException catch (e) {
      safePrint('API error: ${e.message}');
      safePrint('Underlying: ${e.underlyingException}');
    } catch (e) {
      safePrint('Failed to add todo: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ember'), actions: [SignOutButton()]),
      body: Center(
        child: Column(
          children: [
            const Text('Todo screen', style: TextStyle(fontSize: 18)),
            ElevatedButton(
              onPressed: () => _addTodos(),
              child: const Text('Add Todo'),
            ),
          ],
        ),
      ),
    );
  }
}
