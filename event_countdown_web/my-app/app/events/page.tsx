export default function EventsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-sm text-muted">
            Track upcoming and past events with countdowns.
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
          + Add Event
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-muted hover:text-foreground">
          Past
        </button>
        <button className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
          Future
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="text-sm font-medium">Events list coming soon</p>
        <p className="mt-1 text-xs">Functionality will be implemented next.</p>
      </div>
    </div>
  );
}
