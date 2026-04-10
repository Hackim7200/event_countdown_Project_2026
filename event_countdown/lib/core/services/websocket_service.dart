import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/auth/service/auth_service.dart';

/// WebSocket URL from CDK WebSocketStack output.
/// Updated to match outputs.json [`"WebSocketUrl": "wss://xmcg9tn5r3.execute-api.eu-west-2.amazonaws.com/prod"`]
const String _webSocketUrl =
    'wss://xmcg9tn5r3.execute-api.eu-west-2.amazonaws.com/prod';

/// A generic real-time event pushed from the backend via WebSocket.
/// Matches the shape sent by [WebSocketNotifier] in CDK lambdas.
class WsEvent {
  final String type;
  final String action;
  final Map<String, dynamic> data;

  const WsEvent({required this.type, required this.action, required this.data});

  factory WsEvent.fromJson(Map<String, dynamic> json) {
    return WsEvent(
      type: json['type'] as String? ?? '',
      action: json['action'] as String? ?? '',
      data: (json['data'] as Map<String, dynamic>?) ?? {},
    );
  }
}

/// Maintains a single WebSocket connection to the backend and exposes
/// a broadcast stream of [WsEvent]s.
///
/// Authenticates via the Cognito ID token passed as a query parameter.
/// Automatically reconnects with linear back-off on disconnect.
class WebSocketService {
  WebSocketService();

  final AuthService _auth = AuthService();
  WebSocket? _socket;
  StreamSubscription? _subscription;
  Timer? _reconnectTimer;
  bool _disposed = false;
  int _reconnectAttempt = 0;

  final _controller = StreamController<WsEvent>.broadcast();

  /// Stream of all real-time events from the backend.
  Stream<WsEvent> get events => _controller.stream;

  /// Opens the WebSocket connection. Safe to call multiple times (no-op if already connected).
  Future<void> connect() async {
    if (_disposed || _socket != null) return;

    final token = await _auth.getIdToken();
    if (token == null) return;

    try {
      _socket = await WebSocket.connect('$_webSocketUrl?token=$token');
      _reconnectAttempt = 0;

      _subscription = _socket!.listen(
        _onMessage,
        onError: _onError,
        onDone: _onDone,
      );
    } catch (e) {
      safePrint('WebSocket: connection failed — $e');
      _socket = null;
      _scheduleReconnect();
    }
  }

  void _onMessage(dynamic raw) {
    try {
      final json = jsonDecode(raw as String) as Map<String, dynamic>;
      _controller.add(WsEvent.fromJson(json));
    } catch (e) {
      safePrint('WebSocket: failed to parse message — $e');
    }
  }

  void _onError(Object error) {
    safePrint('WebSocket error: $error');
    _cleanup();
    _scheduleReconnect();
  }

  void _onDone() {
    _cleanup();
    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    if (_disposed) return;
    _reconnectAttempt++;
    final delay = Duration(seconds: _reconnectAttempt.clamp(1, 30));
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(delay, connect);
  }

  void _cleanup() {
    _subscription?.cancel();
    _subscription = null;
    _socket?.close().ignore();
    _socket = null;
  }

  /// Tears down the connection and all streams permanently.
  void dispose() {
    _disposed = true;
    _reconnectTimer?.cancel();
    _cleanup();
    _controller.close();
  }
}
