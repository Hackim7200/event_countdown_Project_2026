import 'package:flutter/material.dart';

/// Centralized list of Material icons for reuse across the app.
///
/// Iterate over [AppIcons.ALL] to render pickers or reference icons by index.
class AppIcons {
  AppIcons._();

  /// A convenient flat list of icons for pickers.
  static const List<IconData> all = [
    Icons.calendar_today,
    Icons.event,
    Icons.alarm,
    Icons.notifications,
    Icons.work,
    Icons.school,
    Icons.people_alt,
    Icons.cake,
    Icons.travel_explore,
    Icons.flight_takeoff,
    Icons.hotel,
    Icons.local_cafe,
    Icons.shopping_bag,
    Icons.health_and_safety,
    Icons.sports_soccer,
    Icons.music_note,
    Icons.movie,
    Icons.menu_book,
    Icons.code,
    Icons.check_circle,
    Icons.location_on,
    Icons.phone,
    Icons.email,
    Icons.chat,
    Icons.photo_camera,
    Icons.photo_library,
    Icons.settings,
    Icons.star,
    Icons.favorite,
    Icons.home,
  ];
}
