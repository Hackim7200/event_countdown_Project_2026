export interface EventEntry {
  id: string;
  userId: string; // required for single-table PK
  title: string;
  dueDate: string;
  description: string;
  icon: string;
  location: string;
}
