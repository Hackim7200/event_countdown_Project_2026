export type DayTab = "today" | "tomorrow";

export type TimeCategoryId =
  | "morning"
  | "earlyAfternoon"
  | "lateAfternoon"
  | "twilight"
  | "night";

export type ExecutionStepStatus = "completed" | "active" | "pending";

export interface ExecutionStep {
  id: string;
  title: string;
  meta: string;
  status: ExecutionStepStatus;
}

export interface PlannedBlock {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  day: DayTab;
  category: TimeCategoryId;
  completedPomodoros: number;
  totalPomodoros: number;
  /** Shown on tomorrow breakdown only */
  description?: string;
  executionSteps?: ExecutionStep[];
  plannedBlocks?: PlannedBlock[];
  /** `YYYY-MM-DD` from the API — required for server delete/update parity with mobile. */
  serverRawDate?: string;
}

export interface TimeCategoryMeta {
  id: TimeCategoryId;
  label: string;
  range: string;
  icon: "sun" | "sunRays" | "sunLow" | "coffee" | "moon";
}

export const TIME_CATEGORIES: readonly TimeCategoryMeta[] = [
  {
    id: "morning",
    label: "Morning",
    range: "08:00 — 11:00",
    icon: "sun",
  },
  {
    id: "earlyAfternoon",
    label: "Early Afternoon",
    range: "13:00 — 15:00",
    icon: "sunRays",
  },
  {
    id: "lateAfternoon",
    label: "Late Afternoon",
    range: "15:00 — 18:00",
    icon: "sunLow",
  },
  {
    id: "twilight",
    label: "Twilight",
    range: "18:00 — 20:00",
    icon: "coffee",
  },
  {
    id: "night",
    label: "Night",
    range: "20:00 — 23:00",
    icon: "moon",
  },
] as const;

export const DEFAULT_TODAY_EXECUTION_STEPS: Omit<ExecutionStep, "id">[] = [
  {
    title: "Read through initial system notes",
    meta: "COMPLETED • 25M",
    status: "completed",
  },
  {
    title: "Review question paper and structure answers",
    meta: "CURRENT • 12M LEFT ••",
    status: "active",
  },
  {
    title: "Synthesize final response...",
    meta: "PENDING • 25M EST.",
    status: "pending",
  },
  {
    title: "Submit and archive...",
    meta: "PENDING • 25M EST.",
    status: "pending",
  },
];

function executionStepsFromTemplate(): ExecutionStep[] {
  return DEFAULT_TODAY_EXECUTION_STEPS.map((s, i) => ({
    ...s,
    id: `exec-${i}`,
  }));
}

function plannedBlocksTemplate(): PlannedBlock[] {
  return [
    {
      id: "pb-1",
      indexLabel: "01",
      title: "Material Palette Selection",
      description: "Curating slate and wood finishes for the atrium.",
    },
    {
      id: "pb-2",
      indexLabel: "02",
      title: "Global Illumination Setup",
      description: "Adjusting Ray Tracing parameters for sunrise lighting.",
    },
    {
      id: "pb-3",
      indexLabel: "03",
      title: "Post-Processing Review",
      description: "Camera lens flare and color correction pass.",
    },
  ];
}

export function createInitialTasks(): Task[] {
  return [
    {
      id: "today-morning-1",
      title: "Deep Work: Strategy Architecture",
      day: "today",
      category: "morning",
      completedPomodoros: 2,
      totalPomodoros: 5,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-morning-2",
      title: "Review Quarterly Blueprint",
      day: "today",
      category: "morning",
      completedPomodoros: 1,
      totalPomodoros: 3,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-early-1",
      title: "Client Alignment Call",
      day: "today",
      category: "earlyAfternoon",
      completedPomodoros: 0,
      totalPomodoros: 2,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-late-1",
      title: "Email Clearance & Comms",
      day: "today",
      category: "lateAfternoon",
      completedPomodoros: 3,
      totalPomodoros: 4,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-late-2",
      title: "Documentation Audit",
      day: "today",
      category: "lateAfternoon",
      completedPomodoros: 0,
      totalPomodoros: 1,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-twilight-1",
      title: "Twilight",
      day: "today",
      category: "twilight",
      completedPomodoros: 1,
      totalPomodoros: 2,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-night-1",
      title: "Daily Reflection Log",
      day: "today",
      category: "night",
      completedPomodoros: 0,
      totalPomodoros: 1,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "today-night-2",
      title: "Next Day Planning Sequence",
      day: "today",
      category: "night",
      completedPomodoros: 0,
      totalPomodoros: 2,
      executionSteps: executionStepsFromTemplate(),
    },
    {
      id: "tomorrow-morning-1",
      title: "Architectural Rendering Refinement",
      description:
        "Finalizing the light study and material textures for the Nordic Pavillion concept.",
      day: "tomorrow",
      category: "morning",
      completedPomodoros: 0,
      totalPomodoros: 3,
      plannedBlocks: plannedBlocksTemplate(),
    },
    {
      id: "tomorrow-early-1",
      title: "Vendor Coordination Sprint",
      day: "tomorrow",
      category: "earlyAfternoon",
      completedPomodoros: 0,
      totalPomodoros: 2,
      plannedBlocks: [
        {
          id: "tb2-1",
          indexLabel: "01",
          title: "Review vendor proposals",
          description: "Compare timelines and deliverables for phase two.",
        },
        {
          id: "tb2-2",
          indexLabel: "02",
          title: "Draft follow-up brief",
          description: "Outline open questions for the kickoff thread.",
        },
      ],
    },
    {
      id: "tomorrow-late-1",
      title: "Specification Hardening",
      day: "tomorrow",
      category: "lateAfternoon",
      completedPomodoros: 0,
      totalPomodoros: 4,
      plannedBlocks: [
        {
          id: "tb3-1",
          indexLabel: "01",
          title: "Edge-case matrix",
          description: "Document failure modes for the sync layer.",
        },
        {
          id: "tb3-2",
          indexLabel: "02",
          title: "API contract pass",
          description: "Align payloads with the mobile client stubs.",
        },
      ],
    },
    {
      id: "tomorrow-twilight-1",
      title: "Quiet Inbox Sweep",
      day: "tomorrow",
      category: "twilight",
      completedPomodoros: 0,
      totalPomodoros: 1,
      plannedBlocks: [
        {
          id: "tb4-1",
          indexLabel: "01",
          title: "Archive and label",
          description: "Clear low-priority threads before night mode.",
        },
      ],
    },
    {
      id: "tomorrow-night-1",
      title: "Weekly Retrospective Notes",
      day: "tomorrow",
      category: "night",
      completedPomodoros: 0,
      totalPomodoros: 2,
      plannedBlocks: [
        {
          id: "tb5-1",
          indexLabel: "01",
          title: "Capture wins",
          description: "List three outcomes that moved the roadmap.",
        },
        {
          id: "tb5-2",
          indexLabel: "02",
          title: "Define next constraints",
          description: "Note blockers to address in the next sequence.",
        },
      ],
    },
  ];
}
