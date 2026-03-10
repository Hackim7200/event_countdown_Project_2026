import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Fetches prayer times from the Aladhan API and caches results per date.
///
/// Returns salah times as a list of 5 decimal-hour values in order:
/// [Fajr, Dhuhr, Asr, Maghrib, Isha].
class PrayerTimesService {
  PrayerTimesService({
    this.city = 'London',
    this.country = 'GB',
    this.method = 3,
  });

  final String city;
  final String country;

  /// Calculation method (see https://aladhan.com/prayer-times-api#tag/Timings).
  final int method;

  /// In-memory cache keyed by "YYYY-MM-DD".
  static final Map<String, List<double>> _cache = {};

  static const List<double> _fallbackTimes = [
    5.15, // Fajr   05:09
    12.733, // Dhuhr  12:44
    15.30, // Asr    15:18
    17.767, // Maghrib 17:46
    19.083, // Isha   19:05
  ];

  /// Fetches salah times for [date] (defaults to today).
  ///
  /// Returns 5 decimal-hour values: [Fajr, Dhuhr, Asr, Maghrib, Isha].
  /// Falls back to hardcoded defaults if the API is unreachable.
  Future<List<double>> getSalahTimes({DateTime? date}) async {
    final d = date ?? DateTime.now();
    final key = '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

    if (_cache.containsKey(key)) return _cache[key]!;

    try {
      final dateParam = '${d.day.toString().padLeft(2, '0')}-${d.month.toString().padLeft(2, '0')}-${d.year}';
      final url = Uri.parse(
        'https://api.aladhan.com/v1/timingsByCity/$dateParam'
        '?city=$city&country=$country&method=$method',
      );

      final response = await http.get(url).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final body = json.decode(response.body) as Map<String, dynamic>;
        final timings = body['data']['timings'] as Map<String, dynamic>;

        final times = [
          _parseTime(timings['Fajr'] as String),
          _parseTime(timings['Dhuhr'] as String),
          _parseTime(timings['Asr'] as String),
          _parseTime(timings['Maghrib'] as String),
          _parseTime(timings['Isha'] as String),
        ];

        _cache[key] = times;
        return times;
      }
    } catch (e) {
      debugPrint('PrayerTimesService: failed to fetch for $key – $e');
    }

    return _fallbackTimes;
  }

  /// Parses "HH:mm" (e.g. "12:44") into decimal hours (12.7333…).
  static double _parseTime(String hhmm) {
    // API may append " (PKT)" timezone suffixes — strip anything after the time.
    final cleaned = hhmm.trim().split(' ').first;
    final parts = cleaned.split(':');
    final h = int.parse(parts[0]);
    final m = int.parse(parts[1]);
    return h + m / 60.0;
  }

  /// Clears the cached prayer times (useful for testing or when location changes).
  static void clearCache() => _cache.clear();
}
