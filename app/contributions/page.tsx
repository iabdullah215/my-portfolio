"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { SpotlightCard } from "@/components/spotlight-card";
import { Reveal } from "@/components/reveal";
import { ContributionStats } from "@/components/contribution-stats";
import {
  contributions,
  TYPE_META,
  type ContributionType,
} from "@/content/contributions";

// "All" plus the concrete types, in display order. Only show a type filter if
// at least one entry uses it.
const TYPE_ORDER: ContributionType[] = [
  "cve",
  "advisory",
  "pr",
  "issue",
  "contrib",
];

export default function ContributionsPage() {
  const [selectedType, setSelectedType] = useState<"All" | ContributionType>(
    "All"
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const availableTypes = TYPE_ORDER.filter((type) =>
    contributions.some((c) => c.type === type)
  );

  const filtered = contributions
    .filter((c) => selectedType === "All" || c.type === selectedType)
    .filter((c) => selectedProject === null || c.target === selectedProject)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
      active
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-border bg-muted/40 text-muted-foreground hover:border-accent/50 hover:text-accent"
    }`;

  return (
    <div>
      <h1 className="font-mono text-3xl font-bold mt-4 mb-2 pt-6">
        Contributions
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        CVEs, advisories, pull requests, issues, and other open-source
        contributions.
      </p>

      <ContributionStats
        items={contributions}
        selectedType={selectedType}
        selectedProject={selectedProject}
        onSelectType={setSelectedType}
        onSelectProject={setSelectedProject}
      />

      {/* Type filter — mirrors the blog's chip styling */}
      {availableTypes.length > 0 && (
        <div className="not-prose mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">type:</span>
          {(["All", ...availableTypes] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedType(type);
                track("contribution_filter", { type });
              }}
              className={chipClass(selectedType === type)}
            >
              {type === "All" ? "All" : TYPE_META[type].label}
            </button>
          ))}
        </div>
      )}

      {/* Active project filter — set from the chart, clearable from here too */}
      {selectedProject && (
        <div className="not-prose mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            project:
          </span>
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/15 px-3 py-1 font-mono text-xs text-accent transition-colors hover:border-accent"
            aria-label={`Clear the ${selectedProject} filter`}
          >
            {selectedProject}
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      )}

      <p className="not-prose mb-5 font-mono text-xs text-muted-foreground">
        <span className="text-accent">❯</span> {filtered.length} of{" "}
        {contributions.length} contributions
      </p>

      {filtered.length === 0 && (
        <p className="not-prose font-mono text-sm text-muted-foreground">
          <span className="text-accent">$</span> nothing here yet.
        </p>
      )}

      <div className="not-prose grid gap-5 sm:grid-cols-2">
        {filtered.map((c, index) => {
          const meta = TYPE_META[c.type];
          return (
            <Reveal
              key={`${c.type}-${c.ref}-${index}`}
              delay={Math.min(index, 4) * 70}
              className="h-full"
            >
              <SpotlightCard className="h-full">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col no-underline"
                >
                  {/* Window chrome with the contribution reference */}
                  <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                    <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                      ~{c.ref}
                    </span>
                  </div>

                  <div className="flex h-full flex-col p-5">
                    {/* Type badge + status pill */}
                    <div className="mb-3 flex items-center gap-2 font-mono text-xs">
                      <span
                        className={`rounded border px-2 py-0.5 uppercase tracking-wide ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {c.status}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-muted-foreground">
                      {c.target}
                    </p>
                    <h2 className="mt-0.5 font-mono text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                      {c.title}
                    </h2>
                    {c.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.description}
                      </p>
                    )}

                    {c.tags && c.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        {c.tags.map((tag) => (
                          <span
                            key={`${c.ref}-${tag}`}
                            className="rounded border border-border bg-muted px-2 py-1 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer: date + hover-revealed open arrow */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4 font-mono text-xs text-muted-foreground">
                      <span>
                        <span className="text-accent">$</span>{" "}
                        {new Date(c.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                      <span className="shrink-0 -translate-x-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        open ↗
                      </span>
                    </div>
                  </div>
                </a>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
