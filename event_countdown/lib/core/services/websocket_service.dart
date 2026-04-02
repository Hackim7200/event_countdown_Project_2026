import 'dart:async';
import 'dart:convert';

import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:event_countdown/features/auth/service/auth_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

/// WebSocket URL from CDK WebSocketStack output.
const String _webSocketUrl =
    'wss://6rugea58rk.execute-api.eu-west-2.amazonaws.com/prod';

/// A generic real-time event pushed from the backend via WebSocket.
/// Matches the shape sent by [WebSocketNotifier] in CDK lambdas.
class WsEvent {
  final String type;
  final String action;
  final Map<String, dynamic> data;

  const WsEvent({
    required this.type,
    required this.action,
    required this.data,
  });

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
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  Timer? _reconnectTimer;
  bool _disposed = false;
  int _reconnectAttempt = 0;

  final _controller = StreamController<WsEvent>.broadcast();

  /// Stream of all real-time events from the backend.
  Stream<WsEvent> get events => _controller.stream;

  /// Opens the WebSocket connection. Safe to call multiple times (no-op if already connected).
  Future<void> connect() async {
    if (_disposed || _channel != null) return;

    final token = await _auth.getIdToken();
    if (token == null) {
      safePrint('WebSocket: skipping connect — not signed in');
      return;
    }

    final uri = Uri.parse('$_webSocketUrl?token=$token');

    try {
      _channel = WebSocketChannel.connect(uri);
      await _channel!.ready;
      _reconnectAttempt = 0;
      safePrint('WebSocket: connected');

      _subscription = _channel!.stream.listen(
        _onMessage,
        onError: _onError,
        onDone: _onDone,
      );
    } catch (e) {
      safePrint('WebSocket: connection failed — $e');
      _channel = null;
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
    safePrint('WebSocket: stream error — $error');
    _cleanup();
    _scheduleReconnect();
  }

  void _onDone() {
    safePrint('WebSocket: disconnected');
    _cleanup();
    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    if (_disposed) return;
    _reconnectAttempt++;
    final delay = Duration(
      seconds: _reconnectAttempt.clamp(1, 30),
    );
    safePrint('WebSocket: reconnecting in ${delay.inSeconds}s');
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(delay, connect);
  }

  void _cleanup() {
    _subscription?.cancel();
    _subscription = null;
    _channel?.sink.close().ignore();
    _channel = null;
  }

  /// Tears down the connection and all streams permanently.
  void dispose() {
    _disposed = true;
    _reconnectTimer?.cancel();
    _cleanup();
    _controller.close();
  }
}
