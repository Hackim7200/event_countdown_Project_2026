"use client";

import { TodoProvider } from "@/features/todo/context/todo-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TodoProvider>{children}</TodoProvider>;
}
