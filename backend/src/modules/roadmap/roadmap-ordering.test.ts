import { describe, expect, it } from "vitest";
import {
  assignWeeks,
  buildRoadmapSchedule,
  selectTopGaps,
  sortGapsByPriority,
} from "./roadmap-ordering.js";

type Gap = {
  id: string;
  slug: string;
  priority: number;
  status: string;
};

function gap(slug: string, priority: number, status = "missing"): Gap {
  return { id: `gap-${slug}`, slug, priority, status };
}

describe("sortGapsByPriority", () => {
  it("orders by priority, lowest first", () => {
    const sorted = sortGapsByPriority([
      gap("c", 20),
      gap("a", 0),
      gap("b", 10),
    ]);
    expect(sorted.map((g) => g.slug)).toEqual(["a", "b", "c"]);
  });

  it("breaks ties by slug so the order is reproducible", () => {
    const sorted = sortGapsByPriority([
      gap("testing", 10),
      gap("docker", 10),
      gap("ci-cd", 10),
    ]);
    expect(sorted.map((g) => g.slug)).toEqual(["ci-cd", "docker", "testing"]);
  });

  it("produces the same order regardless of input order", () => {
    const a = sortGapsByPriority([gap("x", 5), gap("y", 5), gap("z", 5)]);
    const b = sortGapsByPriority([gap("z", 5), gap("x", 5), gap("y", 5)]);
    expect(a.map((g) => g.slug)).toEqual(b.map((g) => g.slug));
  });

  it("does not mutate its input", () => {
    const input = [gap("b", 10), gap("a", 0)];
    sortGapsByPriority(input);
    expect(input.map((g) => g.slug)).toEqual(["b", "a"]);
  });
});

describe("selectTopGaps", () => {
  it("takes the four most urgent gaps by default", () => {
    const selected = selectTopGaps([
      gap("a", 0),
      gap("b", 1),
      gap("c", 2),
      gap("d", 10),
      gap("e", 11),
      gap("f", 12),
    ]);
    expect(selected.map((g) => g.slug)).toEqual(["a", "b", "c", "d"]);
  });

  it("excludes skills the candidate is already strong in", () => {
    const selected = selectTopGaps([
      gap("already-good", 30, "strong"),
      gap("needs-work", 0, "missing"),
    ]);
    expect(selected.map((g) => g.slug)).toEqual(["needs-work"]);
  });

  it("returns fewer than the limit when there are not enough gaps", () => {
    const selected = selectTopGaps([gap("a", 0), gap("b", 1)]);
    expect(selected).toHaveLength(2);
  });

  it("returns nothing when every skill is already strong", () => {
    const selected = selectTopGaps([
      gap("a", 30, "strong"),
      gap("b", 31, "strong"),
    ]);
    expect(selected).toEqual([]);
  });

  it("honours an explicit limit", () => {
    const selected = selectTopGaps([gap("a", 0), gap("b", 1), gap("c", 2)], 2);
    expect(selected.map((g) => g.slug)).toEqual(["a", "b"]);
  });
});

describe("assignWeeks", () => {
  it("puts one gap in each successive week", () => {
    const scheduled = assignWeeks([gap("a", 0), gap("b", 1), gap("c", 2)]);
    expect(scheduled.map((g) => g.weekNumber)).toEqual([1, 2, 3]);
    expect(scheduled.every((g) => g.orderInWeek === 0)).toBe(true);
  });

  it("starts weeks at 1, not 0", () => {
    const scheduled = assignWeeks([gap("a", 0)]);
    expect(scheduled[0].weekNumber).toBe(1);
  });
});

describe("buildRoadmapSchedule", () => {
  it("selects, orders, and schedules in one pass", () => {
    const scheduled = buildRoadmapSchedule([
      gap("strong-skill", 30, "strong"),
      gap("minor", 12, "weak_evidence"),
      gap("urgent", 0, "missing"),
      gap("moderate", 10, "weak_evidence"),
    ]);

    expect(scheduled.map((g) => [g.slug, g.weekNumber])).toEqual([
      ["urgent", 1],
      ["moderate", 2],
      ["minor", 3],
    ]);
  });

  it("never schedules past the requested week count", () => {
    const scheduled = buildRoadmapSchedule(
      [gap("a", 0), gap("b", 1), gap("c", 2), gap("d", 3), gap("e", 4)],
      4,
    );
    expect(scheduled).toHaveLength(4);
    expect(Math.max(...scheduled.map((g) => g.weekNumber))).toBe(4);
  });

  it("returns an empty schedule when there is nothing worth working on", () => {
    expect(buildRoadmapSchedule([gap("a", 30, "strong")])).toEqual([]);
  });
});
