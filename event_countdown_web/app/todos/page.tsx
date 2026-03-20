import { AppShell } from "@/features/shared/components/app-shell";
import { TodoScreen } from "@/features/todos/screens/todo-screen";

export default function TodosPage() {
  return (
    <AppShell>
      <TodoScreen />
    </AppShell>
  );
}
