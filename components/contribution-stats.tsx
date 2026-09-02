"use client";

import { useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import {
  TYPE_META,
  type Contribution,
  type ContributionType,
} from "@/content/contributions";

// Bars are a single accent hue rather than one colour per category. Every row is
// already direct-labelled with its name and count, so colour would be redundant
// encoding — and the obvious categorical choice (CVE red next to Advisory amber)
// is indistinguishable under deuteranopia. Magnitude lives in the bar length,
// identity lives in the label. The type view keeps the card badge beside the bar
// so the two views of the same data still agree visually.

type Dimension = "type" | "project";

interface Row {
  /** Filter value: a ContributionType for `type`, a repo slug for `project`. */
  key: string;
  count: number;
}

// Long tail of one-off projects would push the panel taller than the cards it
// summarises. Anything past this is rolled into a visible "+N more" note rather
// than silently dropped.
const MAX_PROJECT_ROWS = 8;

interface ContributionStatsProps {
  /** The full, unfiltered dataset — bar counts stay stable as filters change. */
  items: Contribution[];
  selectedType: "All" | ContributionType;
  selectedProject: string | null;
  onSelectType: (type: "All" | ContributionType) => void;
  onSelectProject: (project: string | null) => void;
}

export function ContributionStats({
  items,
  selectedType,
  selectedProject,
  onSelectType,
  onSelectProject,
}: ContributionStatsProps) {
  const [dimension, setDimension] = useState<Dimension>("type");

  const typeRows = useMemo<Row[]>(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  }, [items]);

  const projectRows = useMemo<Row[]>(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.target] = (counts[item.target] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  }, [items]);

  const projectCount = projectRows.length;
  const severityCount = items.filter(
    (item) => item.type === "cve" || item.type === "advisory"
  ).length;

  // `contrib` never appears in TYPE_META order here — rows are ranked by count,
  // so a type with no entries simply has no row.

  // Cap the project list, but never hide the row the reader has selected.
  let rows: Row[];
  let hiddenCount = 0;
  if (dimension === "type") {
    rows = typeRows;
  } else {
    rows = projectRows.slice(0, MAX_PROJECT_ROWS);
    hiddenCount = projectRows.length - rows.length;
    if (selectedProject && !rows.some((row) => row.key === selectedProject)) {
      const selected = projectRows.find((row) => row.key === selectedProject);
      if (selected) {
        rows = [...rows, selected];
        hiddenCount -= 1;
      }
    }
  }

  const max = Math.max(1, ...rows.map((row) => row.count));

  const isActive = (key: string) =>
    dimension === "type" ? selectedType === key : selectedProject === key;

  // Bars run at full strength unless something is selected — dimming is the
  // "filtered out" signal, not the resting state. Held at full opacity the fill
  // clears 3:1 against both surfaces; a permanently dimmed bar would not.
  const hasSelection =
    dimension === "type" ? selectedType !== "All" : selectedProject !== null;

  // Clicking the active row clears that filter, so a bar is a toggle not a trap.
  const handleSelect = (key: string) => {
    if (dimension === "type") {
      const next = selectedType === key ? "All" : (key as ContributionType);
      onSelectType(next);
      track("contribution_chart_filter", { dimension, value: next });
    } else {
      const next = selectedProject === key ? null : key;
      onSelectProject(next);
      track("contribution_chart_filter", { dimension, value: next ?? "All" });
    }
  };

  const toggleClass = (active: boolean) =>
    `rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors ${
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-border bg-muted/40 text-muted-foreground hover:border-accent/50 hover:text-accent"
    }`;

  return (
    <section
      aria-label="Contribution summary"
      className="not-prose mb-6 rounded-lg border border-border bg-muted/20"
    >
      {/* Headline figures */}
      <dl className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { label: "total", value: items.length },
          { label: "projects", value: projectCount },
          { label: "cve + advisory", value: severityCount },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-3">
            <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="mt-0.5 font-mono text-2xl font-bold text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="p-4">
        {/* Dimension toggle */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-accent">❯</span> breakdown
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDimension("type")}
              className={toggleClass(dimension === "type")}
              aria-pressed={dimension === "type"}
            >
              by type
            </button>
            <button
              type="button"
              onClick={() => setDimension("project")}
              className={toggleClass(dimension === "project")}
              aria-pressed={dimension === "project"}
            >
              by project
            </button>
          </div>
        </div>

        <ul className="space-y-1.5">
          {rows.map((row) => {
            const active = isActive(row.key);
            const meta =
              dimension === "type"
                ? TYPE_META[row.key as ContributionType]
                : undefined;
            const label = meta ? meta.label : row.key;

            return (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() => handleSelect(row.key)}
                  aria-pressed={active}
                  title={`${label} — ${row.count} ${
                    row.count === 1 ? "contribution" : "contributions"
                  }`}
                  className="group grid w-full grid-cols-[6.5rem_1fr_1.75rem] items-center gap-3 rounded px-1 py-1 text-left transition-colors hover:bg-accent/5 sm:grid-cols-[11rem_1fr_1.75rem]"
                >
                  {meta ? (
                    <span
                      className={`justify-self-start rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${meta.badge}`}
                    >
                      {label}
                    </span>
                  ) : (
                    <span
                      className={`truncate font-mono text-xs transition-colors ${
                        active
                          ? "text-accent"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  )}

                  <span className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <span
                      className={`block h-full rounded-full bg-accent transition-all duration-500 ease-out ${
                        active || !hasSelection
                          ? "opacity-100"
                          : "opacity-40 group-hover:opacity-75"
                      }`}
                      style={{ width: `${(row.count / max) * 100}%` }}
                    />
                  </span>

                  <span
                    className={`text-right font-mono text-xs tabular-nums transition-colors ${
                      active ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {row.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {hiddenCount > 0 && (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            + {hiddenCount} more {hiddenCount === 1 ? "project" : "projects"} in
            the tail
          </p>
        )}
      </div>
    </section>
  );
}
