export type DummyTodo = {
  id: string;
  title: string;
  note: string;
};

export const todayTodos: DummyTodo[] = [
  {
    id: "t1",
    title: "Draft weekly summary",
    note: "Due before stand-up",
  },
  {
    id: "t2",
    title: "Reply to design feedback",
    note: "Three open threads",
  },
  {
    id: "t3",
    title: "Book train tickets",
    note: "Return trip, flexible times",
  },
];

export const tomorrowTodos: DummyTodo[] = [
  {
    id: "t4",
    title: "1:1 with Alex",
    note: "Career goals check-in",
  },
  {
    id: "t5",
    title: "Order office supplies",
    note: "Keyboard tray, cable ties",
  },
];
