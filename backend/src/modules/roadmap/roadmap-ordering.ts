// Decides which gaps become roadmap work, and in what order.
//
// This is deliberately application logic rather than AI judgement: the model
// is handed a already-chosen, already-ordered set of gaps and writes task
// content for them. It never picks what matters most. Isolating the selection
// here means the prioritization policy can change without touching the agent,
// the service, or the schema.
//
// Pure module: no Prisma, no Express, no AI.
export const DEFAULT_ROADMAP_WEEKS = 4;

export type SelectableGap = {
  id: string;
  slug: string;
  priority: number;
  status: string;
};

export type ScheduledGap<T extends SelectableGap> = T & {
  weekNumber: number;
  orderInWeek: number;
};

// Lowest priority number first; slug breaks ties.
//
// The slug tiebreak is what makes this deterministic rather than merely
// sorted: Array.prototype.sort is stable, but the gaps arrive in whatever
// order the role snapshot happened to list them, so without an explicit
// second key two runs over the same data could schedule different weeks.
export function sortGapsByPriority<T extends SelectableGap>(gaps: T[]): T[] {
  return [...gaps].sort(
    (a, b) => a.priority - b.priority || a.slug.localeCompare(b.slug),
  );
}

// The top N gaps worth spending the roadmap on.
//
// Skills already rated `strong` are excluded: a roadmap week spent on
// something the candidate has already demonstrated is a wasted week, and the
// product's whole claim is that it tells you what to do *next*.
export function selectTopGaps<T extends SelectableGap>(
  gaps: T[],
  limit: number = DEFAULT_ROADMAP_WEEKS,
): T[] {
  const worthAddressing = gaps.filter((gap) => gap.status !== "strong");
  return sortGapsByPriority(worthAddressing).slice(0, limit);
}

// One gap per week, most urgent first.
//
// orderInWeek is always 0 in V1 (one gap per week) but is assigned here rather
// than defaulted in the schema, so the day a week holds two tasks this
// function is the only thing that changes.
export function assignWeeks<T extends SelectableGap>(
  selected: T[],
): ScheduledGap<T>[] {
  return selected.map((gap, index) => ({
    ...gap,
    weekNumber: index + 1,
    orderInWeek: 0,
  }));
}

// The full selection pipeline: filter, sort, take, schedule.
export function buildRoadmapSchedule<T extends SelectableGap>(
  gaps: T[],
  weekCount: number = DEFAULT_ROADMAP_WEEKS,
): ScheduledGap<T>[] {
  return assignWeeks(selectTopGaps(gaps, weekCount));
}
