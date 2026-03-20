import { TodoSection } from "../components/todo-section";
import { todayTodos, tomorrowTodos } from "../data/todos-dummy";

export function TodoScreen() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Todos
      </h1>
      <p className="mb-12 max-w-md text-sm leading-relaxed text-zinc-500">
        Tasks grouped by day. Today and tomorrow are shown below.
      </p>
      <TodoSection
        heading="Today"
        subtitle="Friday, March 20"
        todos={todayTodos}
      />
      <TodoSection
        heading="Tomorrow"
        subtitle="Saturday, March 21"
        todos={tomorrowTodos}
      />
    </div>
  );
}
