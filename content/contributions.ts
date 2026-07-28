// Hand-curated list of open-source contributions surfaced on /contributions.
// These are short, link-out "impact" items (CVEs, merged PRs, reported issues,
// misc contributions) — not long-form posts. Edit this array to add entries;
// the page reads it directly. Newest `date` renders first.

export type ContributionType = "cve" | "pr" | "issue" | "contrib";

export interface Contribution {
  /** Drives the badge colour + the "All / CVE / PR / Issue" filter. */
  type: ContributionType;
  /** Short reference shown in the window chrome, e.g. "CVE-2024-1234" or "#1423". */
  ref: string;
  /** Human title / one-liner headline. */
  title: string;
  /** Project or vendor the work landed in, e.g. "go-redis" or "kubernetes/kubernetes". */
  target: string;
  /** One or two sentences on what it was. */
  description: string;
  /** ISO date (YYYY-MM-DD). Used for sorting + display. */
  date: string;
  /** Free-text state pill, e.g. "Published", "Merged", "Open", "Acknowledged". */
  status: string;
  /** Outbound link to NVD / GitHub / advisory. */
  url: string;
  /** Optional extra labels rendered as chips. */
  tags?: string[];
}

// Labels + accent hues per type. Colours are Tailwind utility classes so they
// respect light/dark automatically.
export const TYPE_META: Record<
  ContributionType,
  { label: string; badge: string }
> = {
  cve: {
    label: "CVE",
    badge: "border-red-400/40 bg-red-400/10 text-red-400",
  },
  pr: {
    label: "PR",
    badge: "border-accent/40 bg-accent/10 text-accent",
  },
  issue: {
    label: "Issue",
    badge: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  },
  contrib: {
    label: "Contrib",
    badge: "border-sky-400/40 bg-sky-400/10 text-sky-400",
  },
};

// --- Entries -----------------------------------------------------------------
export const contributions: Contribution[] = [
  {
    type: "issue",
    ref: "#7909",
    title:
      "Normalize request path in remote admin access-control check (defense-in-depth)",
    target: "caddyserver/caddy",
    description:
      "Reported that RemoteAdmin's access-control check does a lexical prefix match against the raw, un-normalized request path, so a path like /pki/ca/prod/../../../../load satisfies a prefix scoped to /pki/ca/prod. Not exploitable today because the admin ServeMux redirects .. paths before dispatch, but the authorization layer shouldn't depend on the router to sanitize its input. Proposed cleaning both paths with path.Clean before the boundary check, with regression tests.",
    date: "2026-07-27",
    status: "Open",
    url: "https://github.com/caddyserver/caddy/issues/7909",
    tags: ["go", "security", "hardening"],
  },
  {
    type: "pr",
    ref: "#3419",
    title: "Add NSE script to detect WordPress \"wp2shell\" pre-auth RCE",
    target: "nmap/nmap",
    description:
      "New http-vuln-cve2026-63030 NSE script that fingerprints WordPress core versions affected by the pre-auth RCE chain (CVE-2026-63030 route confusion + CVE-2026-60137 SQLi). Detection is version-based via the generator meta tag and RSS feed, sending no crafted requests, so it is safe against production hosts.",
    date: "2026-07-27",
    status: "Open",
    url: "https://github.com/nmap/nmap/pull/3419",
    tags: ["nse", "lua", "wordpress", "cve"],
  },
  {
    type: "pr",
    ref: "#3873",
    title: "Reject unhashable keys in RESP3 map parsing",
    target: "redis/go-redis",
    description:
      "Fixed a panic in RESP3 map reply parsing when a map key is an unhashable type (map or array). readMap() now validates each key and returns a clear parse error instead of panicking, with a fuzz test and regression coverage.",
    date: "2026-07-10",
    status: "Merged",
    url: "https://github.com/redis/go-redis/pull/3873",
    tags: ["go", "bugfix", "resp3"],
  },
];
