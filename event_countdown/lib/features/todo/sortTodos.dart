import 'package:event_countdown/models/todo_model.dart';

/// Utility class for sorting or filtering todo items by time period.
///
/// Returns a new list containing only those todos that match the given timePeriod.
/// This method does not mutate the input list.
class FilterByPeriod {
  /// Filters the [todos] list to include only items with the specified [timePeriod].
  static List<Todo> filterByPeriod(List<Todo> todos, String timePeriod) {
    return todos
        .where(
          (todo) => todo.timePeriod.toLowerCase() == timePeriod.toLowerCase(),
        )
        .toList();
  }
}
