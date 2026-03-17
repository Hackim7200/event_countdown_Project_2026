export default function TodosPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Todos</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your daily tasks.
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
          + Add Todo
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
          Today
        </button>
        <button className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-muted hover:text-foreground">
          Tomorrow
        </button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-muted">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 opacity-40"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <p className="text-sm font-medium">Todo list coming soon</p>
        <p className="mt-1 text-xs">Functionality will be implemented next.</p>
      </div>
    </div>
  );
}
