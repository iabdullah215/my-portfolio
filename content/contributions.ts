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
    type: "advisory",
    ref: "GHSA-f2v7-35mm-3hx7",
    title:
      "manager/maven-wrapper: Command injection via unescaped distributionType",
    target: "renovatebot/renovate",
    description:
      "Reported privately: the Maven Wrapper manager took distributionType straight out of a repository's maven/maven-wrapper.properties and interpolated it into the command Renovate executes, without escaping. Under binarySource=docker a crafted value such as \"script; cp /etc/passwd /tmp/passwd\" breaks out of the intended command and runs arbitrary code as the Renovate process user, so any repository Renovate is pointed at can execute code on a self-hosted bot. CWE-78, CVSS 7.8 High. Fixed in 44.14.7, and in 15.4.0 / 10.4.0 for the Mend editions.",
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
      "Reported privately: the Mix manager builds its hex authentication command from the organization parsed out of a private dependency's package name and never escapes it, so a name like \"private_package:evil --key leaked_or_arbitrary\" injects extra arguments into the command and, under binarySource=docker, arbitrary shell metacharacters. Enough to leak the organization key or run commands as the Renovate process user, though a conformant Mix registry would reject such a package name, which keeps practical exploitation to an insider scenario. CVSS 7.0 High. Fixed in 44.14.7 alongside GHSA-f2v7-35mm-3hx7.",
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
      "Companion to #848 on the same untrusted-input reader. getExtents walked 0..<entries reading fixed 12-byte records with subdata, trusting the entry counts in the on-disk extent headers without checking them against the bytes available, but the inode block region holds only 60 bytes, so a depth-0 header claiming more than four leaves (or a depth-1 header claiming more than four indices, or a leaf block trusting its own header) reads past the buffer and traps the process. Bounds-checks every fixed-size read and throws EXT4.Error.invalidExtents so corruption surfaces rather than silently truncating, and fixes a latent reversed range when reading a leaf header that was benign only because the offset happened to be zero. Decode is extracted into an internal helper so the four new tests can drive crafted inode blocks directly.",
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
      "An ext4 image is untrusted input, but EXT4Reader.getDirEntries read at attacker-controlled offsets without bounds checks: the fixed 8-byte header was loaded whenever offset < block length, so a crafted recordLength landing 1–7 bytes from the end ran past the buffer, and the entry name was read using a nameLength taken straight from the image and never validated. Data.subdata traps on an out-of-range slice, so a malformed image is a SIGTRAP denial of service against any caller listing a directory. Adds two guards that break out of the parse loop like the adjacent recordLength check, plus four tests: one well-formed regression case and three malformed blocks that each crash the reader without the fix.",
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
      "Permission resources come straight from the request body, so naming an Object.prototype member like constructor or toString made the statements lookup return a function rather than undefined. The unknown-resource guard saw a truthy value and evaluation continued into allowedActions.includes(), throwing a TypeError: a 500 and a cheap error oracle where the contract is fail-closed. Requires an own, array-valued statement via Object.hasOwn plus Array.isArray, so inherited or malformed entries degrade to a deny. Seven regression tests over constructor, toString, valueOf, hasOwnProperty, and __proto__.",
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
      "phone-number was the only OTP-based plugin still persisting its code in plain text and comparing it with !==, having been missed by the sweep that added storeOTP to email-otp, magic-link, one-time-token, and two-factor. Adds the same storeOTP option (plain / hashed / encrypted / custom hasher or encryptor) plus constant-time verification, with colon-safe parsing of the attempt-count suffix so encrypted payloads round-trip correctly. Defaults to plain, so existing deployments need no migration.",
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
      "Reported privately: update_user gated its password checks behind a truthiness test, so an empty string fell straight through the length, complexity, and reserved-user rules and was accepted as a password. The fix swaps if password: for if password is not None: in framework/wazuh/security.py, so every non-null value is validated and empty passwords are rejected with error 5009; regression cases cover both reserved and regular accounts. Credited as reporter in the PR; CVE and advisory pending.",
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
      "Reported privately: the API's brute-force protection incremented its per-IP attempt counter only after credential validation had finished, so concurrent login requests could clear the gate check before any of them were recorded: a TOCTOU window in which the configured attempt limit could be exceeded. The fix moves counting into the check_blocked_ip middleware, ahead of authentication and under the existing asyncio lock, making the gate check and the increment atomic; a new settle_login_attempt() decrements on success so legitimate clients behind NAT or a load balancer aren't eventually blocked. Credited as reporter in the PR; CVE and advisory pending.",
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
      "Fix for issue #7909: RemoteAdmin's access-control check did a lexical prefix match against the raw, un-normalized request path, so /pki/ca/prod/../../../../load satisfied a prefix scoped to /pki/ca/prod. Cleans both the request path and the allowed path with path.Clean before the segment-boundary check, keeping existing semantics (/pki still doesn't match /pkisecret). Includes regression tests for dot-dot, encoded, sibling, collapsed-slash, and trailing-slash traversal.",
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
      "Reported that RemoteAdmin's access-control check does a lexical prefix match against the raw, un-normalized request path, so a path like /pki/ca/prod/../../../../load satisfies a prefix scoped to /pki/ca/prod. Not exploitable today because the admin ServeMux redirects .. paths before dispatch, but the authorization layer shouldn't depend on the router to sanitize its input. Proposed cleaning both paths with path.Clean before the boundary check, with regression tests. Resolved by PR #7910.",
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
