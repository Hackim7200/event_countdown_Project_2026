import 'dart:convert';

import 'package:event_countdown/features/models/pomdoro_model.dart';
import 'package:event_countdown/features/pomdoro/services/pomodoro_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

/// Summary row for the guest todo list (local only).
class GuestTodoSummary {
  const GuestTodoSummary({
    required this.id,
    required this.title,
    this.pomodoroCount = 0,
  });

  final String id;
  final String title;
  final int pomodoroCount;
}

class _GuestTodoRecord {
  _GuestTodoRecord({
    required this.id,
    required this.title,
    required this.pomodoros,
  });

  final String id;
  String title;
  List<Pomodoro> pomodoros;
}

/// Guest-mode todos and pomodoros stored as JSON in [SharedPreferences].
///
/// Same role as [PomodoroService] for pomodoros—both implement
/// [PomodoroRepository]—but this is the **device-local (offline)** implementation
/// (no API). Also exposes guest todo list helpers ([listTodos], [addTodo],
/// [deleteTodo]).
///
/// Shape matches API-friendly [Pomodoro.toJson] for easier future sync.
class GuestLocalFocusStore implements PomodoroRepository {
  GuestLocalFocusStore._(this._prefs);

  static const _prefsKey = 'guest_focus_v1';
  static final _uuid = Uuid();

  final SharedPreferences _prefs;
  final List<_GuestTodoRecord> _todos = [];
  bool _loaded = false;

  static Future<GuestLocalFocusStore> create() async {
    final prefs = await SharedPreferences.getInstance();
    final store = GuestLocalFocusStore._(prefs);
    await store._loadFromPrefs();
    return store;
  }

  Future<void> _loadFromPrefs() async {
    if (_loaded) return;
    _loaded = true;
    final raw = _prefs.getString(_prefsKey);
    if (raw == null || raw.isEmpty) return;

    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      final list = decoded['todos'] as List<dynamic>? ?? [];
      for (final e in list) {
        final m = e as Map<String, dynamic>;
        final pomos = (m['pomodoros'] as List<dynamic>? ?? [])
            .map((p) => Pomodoro.fromJson(Map<String, dynamic>.from(p as Map)))
            .toList();
        _todos.add(
          _GuestTodoRecord(
            id: m['id'] as String,
            title: m['title'] as String,
            pomodoros: pomos,
          ),
        );
      }
    } catch (_) {
      // Corrupt prefs: start fresh rather than crash.
      _todos.clear();
    }
  }

  Future<void> _persist() async {
    final payload = jsonEncode({
      'version': 1,
      'todos': _todos
          .map(
            (t) => {
              'id': t.id,
              'title': t.title,
              'pomodoros': t.pomodoros.map((p) => p.toJson()).toList(),
            },
          )
          .toList(),
    });
    await _prefs.setString(_prefsKey, payload);
  }

  _GuestTodoRecord? _todo(String todoId) {
    try {
      return _todos.firstWhere((t) => t.id == todoId);
    } catch (_) {
      return null;
    }
  }

  Future<List<GuestTodoSummary>> listTodos() async {
    await _loadFromPrefs();
    return _todos
        .map(
          (t) => GuestTodoSummary(
            id: t.id,
            title: t.title,
            pomodoroCount: t.pomodoros.length,
          ),
        )
        .toList();
  }

  Future<void> addTodo(String title) async {
    await _loadFromPrefs();
    final trimmed = title.trim();
    if (trimmed.isEmpty) return;
    _todos.add(
      _GuestTodoRecord(id: _uuid.v4(), title: trimmed, pomodoros: []),
    );
    await _persist();
  }

  Future<void> deleteTodo(String id) async {
    await _loadFromPrefs();
    _todos.removeWhere((t) => t.id == id);
    await _persist();
  }

  @override
  Future<List<Pomodoro>> getPomodoros(String todoId) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return [];
    return List<Pomodoro>.from(t.pomodoros);
  }

  @override
  Future<String?> addPomodoro({
    required String todoId,
    required String title,
    required int timerDurationInMinutes,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return null;
    final id = _uuid.v4();
    t.pomodoros.add(
      Pomodoro(
        id: id,
        title: title.trim(),
        status: 'stopped',
        timerDurationInMinutes: timerDurationInMinutes,
      ),
    );
    await _persist();
    return id;
  }

  @override
  Future<DateTime?> startPomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return null;
    final i = t.pomodoros.indexWhere((p) => p.id == pomodoroId);
    if (i < 0) return null;
    final p = t.pomodoros[i];
    if (p.isCompleted) return null;
    final now = DateTime.now().toUtc();
    final updated = p.copyWith(startedAt: now, status: 'running');
    t.pomodoros[i] = updated;
    await _persist();
    return now;
  }

  @override
  Future<int?> pausePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return null;
    final i = t.pomodoros.indexWhere((p) => p.id == pomodoroId);
    if (i < 0) return null;
    final p = t.pomodoros[i];
    if (p.startedAt == null) return p.elapsedSeconds;
    final now = DateTime.now().toUtc();
    final segment = now.difference(p.startedAt!);
    final newElapsed = p.elapsedSeconds + segment.inSeconds;
    final updated = p.copyWith(
      clearStartedAt: true,
      elapsedSeconds: newElapsed,
      status: 'stopped',
    );
    t.pomodoros[i] = updated;
    await _persist();
    return newElapsed;
  }

  @override
  Future<bool> resetPomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return false;
    final i = t.pomodoros.indexWhere((p) => p.id == pomodoroId);
    if (i < 0) return false;
    final p = t.pomodoros[i];
    t.pomodoros[i] = p.copyWith(
      clearStartedAt: true,
      elapsedSeconds: 0,
      status: 'stopped',
    );
    await _persist();
    return true;
  }

  @override
  Future<bool> deletePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return false;
    final before = t.pomodoros.length;
    t.pomodoros.removeWhere((p) => p.id == pomodoroId);
    if (t.pomodoros.length == before) return false;
    await _persist();
    return true;
  }

  @override
  Future<bool> completePomodoro({
    required String pomodoroId,
    required String todoId,
  }) async {
    await _loadFromPrefs();
    final t = _todo(todoId);
    if (t == null) return false;
    final i = t.pomodoros.indexWhere((p) => p.id == pomodoroId);
    if (i < 0) return false;
    final p = t.pomodoros[i];
    t.pomodoros[i] = p.copyWith(clearStartedAt: true, status: 'completed');
    await _persist();
    return true;
  }
}
