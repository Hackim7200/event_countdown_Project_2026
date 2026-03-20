import type { DummyTodo } from "../data/todos-dummy";
import { TaskItem } from "./task-item";

type TodoSectionProps = {
  heading: string;
  subtitle: string;
  todos: DummyTodo[];
};

export function TodoSection({ heading, subtitle, todos }: TodoSectionProps) {
  return (
    <section className="mb-14 last:mb-0">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {heading}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>
      <ul className="rounded-lg border border-zinc-200 bg-white px-4">
        {todos.map((todo) => (
          <TaskItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}
