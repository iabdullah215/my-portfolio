// Hand-curated list of open-source contributions surfaced on /contributions.
// These are short, link-out "impact" items (CVEs, merged PRs, reported issues,
// misc contributions) — not long-form posts. Edit this array to add entries;
// the page reads it directly. Newest `date` renders first.

export type ContributionType = "cve" | "advisory" | "pr" | "issue" | "contrib";

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
  advisory: {
    label: "Advisory",
    badge: "border-orange-400/40 bg-orange-400/10 text-orange-400",
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
    type: "cve",
    ref: "CVE-2026-70407",
    title:
      "Token scope bypass on GET /api/v1/orgs: the read:organization check ran after the handler that answered the request",
    target: "go-gitea/gitea",
    description:
      "Gitea listed the scope check after the handler that answered the request, so GET /api/v1/orgs never enforced read:organization. Any token could list organization metadata, and a site-admin token also returned private and limited orgs. Fixed in 1.27.3.",
    date: "2026-08-31",
    status: "Published",
    url: "https://github.com/go-gitea/gitea/security/advisories/GHSA-ww9q-7j5q-hrv5",
    tags: ["go", "security", "access-control", "cwe-285"],
  },
  {
    type: "advisory",
    ref: "GHSA-5293-mq8x-g3xj",
    title:
      "Malicious OpenAPI documents can cause arbitrary code generation, executed when anyone imports the generated client",
    target: "openapi-generators/openapi-python-client",
    description:
      "The generator interpolated strings from an OpenAPI document into its Jinja templates without escaping, so a crafted document could break out of a literal and write arbitrary Python into the generated client, which then runs on import. CVSS 8.4, fixed in 0.29.1.",
    date: "2026-08-31",
    status: "Published",
    url: "https://github.com/openapi-generators/openapi-python-client/security/advisories/GHSA-5293-mq8x-g3xj",
    tags: ["python", "security", "code-injection", "cwe-94"],
  },
  {
    type: "advisory",
    ref: "GHSA-f689-h8m7-3jp2",
    title:
      "ContainerizationOCI accepts unvalidated OCI descriptor digests, enabling path traversal in the local content store",
    target: "apple/containerization",
    description:
      "OCI descriptor digests were never validated, and the helper that turns a digest into a path only stripped the prefix, so sha256:../../etc/hosts escaped the content store. A malicious registry got a file read oracle on the macOS host. Fixed in containerization 0.41.0.",
    date: "2026-08-30",
    status: "Published",
    url: "https://github.com/apple/containerization/security/advisories/GHSA-f689-h8m7-3jp2",
    tags: ["swift", "security", "path-traversal", "oci"],
  },
  {
    type: "cve",
    ref: "CVE-2026-71184",
    title:
      "Gitea Actions: fork pull request approval bypass via pull_request_review_comment (missing WithPullRequest)",
    target: "go-gitea/gitea",
    description:
      "The review notifier left the pull request off its notification, so a pull_request_review_comment run skipped the fork approval gate. Forking a repository and leaving a review comment ran attacker workflow code on its runners. CVSS 8.8, fixed in 1.27.3.",
    date: "2026-08-29",
    status: "Published",
    url: "https://github.com/go-gitea/gitea/security/advisories/GHSA-7w2r-xwp6-mh6c",
    tags: ["go", "security", "ci-cd", "cwe-863"],
  },
  {
    type: "cve",
    ref: "CVE-2026-66874",
    title:
      "A fork pull request author can satisfy a required Actions status check without any workflow running",
    target: "go-gitea/gitea",
    description:
      "Gitea writes a synthetic skipped status for workflows excluded by their own filters, and skipped counts as success. A fork author could name a workflow after a required check and give it filters that never match, turning the check green with no run. Fixed in 1.27.3.",
    date: "2026-08-29",
    status: "Published",
    url: "https://github.com/go-gitea/gitea/security/advisories/GHSA-5xp7-r6cr-39ff",
    tags: ["go", "security", "ci-cd", "branch-protection"],
  },
  {
    type: "cve",
    ref: "CVE-2026-78433",
    title:
      "Attachments created before the January 2026 cutoff skip the cross repository check, serving private attachments through any public repository's path",
    target: "go-gitea/gitea",
    description:
      "The cross repository check on attachments was gated on the creation timestamp instead of the owning repository ID, so anyone with an attachment UUID could pull a private repository's attachments through a public repository's path, unauthenticated. Fixed in 1.27.3.",
    date: "2026-08-29",
    status: "Published",
    url: "https://github.com/go-gitea/gitea/security/advisories/GHSA-frpv-2xgv-wxpq",
    tags: ["go", "security", "access-control", "cwe-639"],
  },
  {
    type: "pr",
    ref: "#38686",
    title: "Verify the Fluentd server identity in the fluent-forward module",
    target: "wazuh/wazuh",
    description:
      "The fluent-forward module verified the collector's certificate chain but never that the certificate matched the configured address, and it parsed the shared key digest out of the PONG without comparing it. The fix authenticates both. Credited as reporter.",
    date: "2026-08-28",
    status: "Merged",
    url: "https://github.com/wazuh/wazuh/pull/38686",
    tags: ["c", "security", "tls", "authentication"],
  },
  {
    type: "issue",
    ref: "#38684",
    title:
      "Agent HTTPS transport defaults to verification_mode none, so a default install performs no TLS certificate verification",
    target: "wazuh/wazuh",
    description:
      "The 5.x agent sets verification_mode to none and no shipped template overrides it, so a default install does no TLS verification at all. Anyone on the path can impersonate the manager, force re-enrollment, and reach root through active_response.",
    date: "2026-08-28",
    status: "Open",
    url: "https://github.com/wazuh/wazuh/issues/38684",
    tags: ["c", "security", "tls", "insecure-defaults"],
  },
  {
    type: "issue",
    ref: "#38683",
    title:
      "remoted /download serves any group's merged.mg to any authenticated agent, no membership check",
    target: "wazuh/wazuh",
    description:
      "remoted's POST /download authenticates the calling agent but never checks that it belongs to the group it asks for, so any agent can fetch any group's merged.mg and the credentials inside its agent.conf. Filed as an issue since the code is unreleased.",
    date: "2026-08-28",
    status: "Open",
    url: "https://github.com/wazuh/wazuh/issues/38683",
    tags: ["cpp", "security", "access-control", "idor"],
  },
  {
    type: "advisory",
    ref: "GHSA-f2v7-35mm-3hx7",
    title:
      "manager/maven-wrapper: Command injection via unescaped distributionType",
    target: "renovatebot/renovate",
    description:
      "The Maven Wrapper manager interpolated distributionType out of a repository's maven-wrapper.properties into the command it runs without escaping, so a crafted value executed arbitrary code as the Renovate user. CVSS 7.8, fixed in 44.14.7.",
    date: "2026-08-27",
    status: "Published",
    url: "https://github.com/renovatebot/renovate/security/advisories/GHSA-f2v7-35mm-3hx7",
    tags: ["typescript", "security", "command-injection", "cwe-78"],
  },
  {
    type: "advisory",
    ref: "GHSA-v85g-rq5w-c46q",
    title: "manager/mix: Command injection via unescaped organization",
    target: "renovatebot/renovate",
    description:
      "The Mix manager built its hex authentication command from an unescaped organization parsed out of a private dependency name, allowing argument injection and, under binarySource=docker, shell metacharacters. CVSS 7.0, fixed in 44.14.7.",
    date: "2026-08-27",
    status: "Published",
    url: "https://github.com/renovatebot/renovate/security/advisories/GHSA-v85g-rq5w-c46q",
    tags: ["typescript", "security", "command-injection", "cwe-78"],
  },
  {
    type: "pr",
    ref: "#849",
    title:
      "Guard ext4 extent-tree parsing against out-of-bounds reads on malformed images",
    target: "apple/containerization",
    description:
      "getExtents trusted the entry counts in the on-disk extent headers, but the inode block region holds only 60 bytes, so a header claiming more entries than fit read past the buffer and trapped the process. Bounds-checks every read, with four tests.",
    date: "2026-08-24",
    status: "Open",
    url: "https://github.com/apple/containerization/pull/849",
    tags: ["swift", "security", "ext4", "memory-safety"],
  },
  {
    type: "pr",
    ref: "#848",
    title:
      "Guard ext4 directory-entry parsing against out-of-bounds reads on malformed images",
    target: "apple/containerization",
    description:
      "getDirEntries read directory headers and entry names at attacker-controlled offsets without bounds checks, so a malformed ext4 image was a crash denial of service against any caller listing a directory. Adds two guards and four tests.",
    date: "2026-08-24",
    status: "Open",
    url: "https://github.com/apple/containerization/pull/848",
    tags: ["swift", "security", "ext4", "memory-safety"],
  },
  {
    type: "pr",
    ref: "#10919",
    title: "Deny inherited object members in access-control checks instead of throwing",
    target: "better-auth/better-auth",
    description:
      "Permission resources come straight from the request body, so naming an Object.prototype member like constructor made the lookup return a function, slipped past the unknown-resource guard, and threw a 500 where the contract is fail-closed. Now denies instead.",
    date: "2026-08-21",
    status: "Open",
    url: "https://github.com/better-auth/better-auth/pull/10919",
    tags: ["typescript", "security", "access-control", "prototype-pollution"],
  },
  {
    type: "pr",
    ref: "#10917",
    title: "Support hashed and encrypted OTP storage in the phone-number plugin",
    target: "better-auth/better-auth",
    description:
      "phone-number was the only OTP plugin still storing its code in plain text and comparing it with !==. Adds the same storeOTP option the other plugins have, plus constant-time verification, defaulting to plain so no migration is needed.",
    date: "2026-08-21",
    status: "Open",
    url: "https://github.com/better-auth/better-auth/pull/10917",
    tags: ["typescript", "security", "otp", "cryptography"],
  },
  {
    type: "pr",
    ref: "#38180",
    title: "Enforce password validation for empty passwords in update_user",
    target: "wazuh/wazuh",
    description:
      "update_user gated its password checks behind a truthiness test, so an empty string skipped the length, complexity, and reserved-user rules and was accepted as a password. Fixed by checking for None instead. Credited as reporter.",
    date: "2026-08-05",
    status: "Merged",
    url: "https://github.com/wazuh/wazuh/pull/38180",
    tags: ["python", "security", "auth", "input-validation"],
  },
  {
    type: "pr",
    ref: "#38135",
    title: "Improve login attempt limiting under concurrent requests",
    target: "wazuh/wazuh",
    description:
      "The API counted failed logins only after credential validation finished, so concurrent requests could clear the gate before any of them were recorded and exceed the attempt limit. Counting moved ahead of authentication, under the existing lock.",
    date: "2026-08-04",
    status: "Merged",
    url: "https://github.com/wazuh/wazuh/pull/38135",
    tags: ["python", "security", "race-condition", "auth"],
  },
  {
    type: "pr",
    ref: "#7910",
    title:
      "Normalize request path in remote admin access-control check (defense-in-depth)",
    target: "caddyserver/caddy",
    description:
      "Fix for issue #7909. Cleans both the request path and the allowed path before the segment-boundary check, so dot-dot traversal can no longer satisfy an admin prefix. Regression tests cover encoded, sibling, and collapsed-slash cases.",
    date: "2026-08-25",
    status: "Merged",
    url: "https://github.com/caddyserver/caddy/pull/7910",
    tags: ["go", "security", "hardening"],
  },
  {
    type: "issue",
    ref: "#7909",
    title:
      "Normalize request path in remote admin access-control check (defense-in-depth)",
    target: "caddyserver/caddy",
    description:
      "RemoteAdmin's access-control check did a lexical prefix match on the raw request path, so /pki/ca/prod/../../../../load satisfied a prefix scoped to /pki/ca/prod. Not exploitable today, but authorization should not rely on the router. Resolved by #7910.",
    date: "2026-07-30",
    status: "Resolved",
    url: "https://github.com/caddyserver/caddy/issues/7909",
    tags: ["go", "security", "hardening"],
  },
  {
    type: "pr",
    ref: "#3419",
    title: "Add NSE script to detect WordPress \"wp2shell\" pre-auth RCE",
    target: "nmap/nmap",
    description:
      "New http-vuln-cve2026-63030 NSE script that fingerprints WordPress versions affected by the pre-auth RCE chain (CVE-2026-63030 plus CVE-2026-60137). Detection is version-based only, so it sends no crafted requests.",
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
      "readMap() panicked when a RESP3 map reply used an unhashable key such as a map or array. It now validates each key and returns a clear parse error instead, with a fuzz test and regression coverage.",
    date: "2026-07-10",
    status: "Merged",
    url: "https://github.com/redis/go-redis/pull/3873",
    tags: ["go", "bugfix", "resp3"],
  },
];
