import type { DummyTodo } from "../data/todos-dummy";

type TaskItemProps = {
  todo: DummyTodo;
};

export function TaskItem({ todo }: TaskItemProps) {
  return (
    <li className="border-b border-zinc-200 py-4 last:border-b-0">
      <div className="flex gap-3">
        <span
          className="mt-1.5 h-3 w-3 shrink-0 rounded-sm border border-zinc-300 bg-white"
          aria-hidden
        />
        <div>
          <p className="text-[15px] font-medium text-zinc-900">{todo.title}</p>
          <p className="mt-1 text-sm text-zinc-500">{todo.note}</p>
        </div>
      </div>
    </li>
  );
}
