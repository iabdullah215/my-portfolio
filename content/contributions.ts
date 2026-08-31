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
      "GHSA-ww9q-7j5q-hrv5. Gitea's API routes carry their token scope requirement as middleware, and middleware runs in the order it is listed, so \"/orgs\" registered as m.Get(\"/orgs\", org.GetAll, tokenRequiresScopes(...Organization)) had the two the wrong way round: GetAll answered the request and the scope check it was supposed to sit behind never ran. The sibling POST on the line directly above orders them correctly, which is what made the inversion visible. Any token was therefore enough to enumerate organization metadata visible to its owner — including a token deliberately narrowed to read:misc, exactly the case scopes exist to bound — and a site-admin token additionally returned private and limited organizations, so an integration handed a minimal token could read the whole organization list an operator believed it had been cut off from. CWE-285, Moderate. Fixed in 1.27.3 by putting tokenRequiresScopes ahead of the handler (#39041); the follow-up #39058 swept the same class of gap across package blob access, limited-organization visibility for restricted users, workflow badges, and repository team management. Credited as reporter.",
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
      "The generator builds a Python client by interpolating strings taken straight from an OpenAPI document into Jinja templates, and those templates emitted document-controlled values into docstrings, f-strings, and string literals without escaping them for the context they landed in. A crafted document can therefore close the literal it is placed in and continue as Python source, so the generator writes attacker-chosen code into the client it produces — and that code runs on import, not on any call to the malicious endpoint. Nobody has to invoke the API for it to fire; pointing the generator at a vendor's spec URL and importing the result is the whole chain, which puts CI jobs and developer machines that regenerate clients from third-party specs directly in the blast radius. CWE-94 / CWE-116 / CWE-150, CVSS 4.0 8.4 High, no CVE assigned yet. Fixed in 0.29.1, which routes every interpolated value through a context-specific escaper — safe_for_docstring, in_f_string_literal, in_double_quote_literal, and as_unembedded_code reserved for values that genuinely are code — and strips Unicode control characters from literals; custom templates must be updated to match. Credited as reporter.",
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
      "Descriptor.digest was a plain String decoded straight out of registry responses by synthesized Codable with no format validation, and trimmingDigestPrefix — the helper used everywhere to turn a digest into a path component — only split on \":\" and returned the remainder verbatim, so sha256:../../etc/hosts came back as ../../etc/hosts. LocalContentStore.get appended that onto blobs/sha256 with URL.appendingPathComponent, which does not collapse \"..\", then opened the result. Every container pull, run, and create reaches the sink through ImageStore+Import's fetch() and getManifestContent(), so one malicious manifest is enough: a compromised or on-path registry gets a file existence and readability oracle on the macOS host, the JSON decode error can echo a fragment of the file's bytes into local logs, and because the read was unbounded a digest pointed at a large or unreadable-to-EOF file exhausts memory. The cache-hit copyItem branch was checked and is not a write primitive — source and destination resolve to the same path and the copy fails EEXIST. High severity, no CVE assigned. Fixed by validating every digest as sha256:<64 lowercase hex> at decode time and again at the content-store sink; patched above containerization 0.41.0 and container 1.3.0. Credited as reporter.",
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
      "GHSA-7w2r-xwp6-mh6c. Gitea has required maintainer approval before running fork pull request workflows since 1.20.0, but the review notifier — unlike its sibling review-request notifier — never attached the pull request to the notification it emitted, so a run triggered by pull_request_review_comment carried no PR context and the gate concluded the run was not from a fork. An attacker only had to fork the repository, open a pull request, and leave a review comment: no Actions permissions, no runner of their own. Attacker-controlled workflow code then executed unapproved on the base repository's runners, which on a self-hosted runner means code execution as the runner user with reach into its secrets. CWE-863, CVSS 8.8 High. Fixed in 1.27.3 via #39005 and #39018; credited as analyst.",
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
      "GHSA-5xp7-r6cr-39ff. Gitea writes a synthetic skipped commit status for workflows excluded by their own filters, and a combined status treats skipped as success. For a fork pull request the workflow definition is read from the author's HEAD commit, so the attacker controls it: define a workflow whose name matches a required check context, give it filters that can never match, and Gitea posts the skipped status itself. The required check goes green with no workflow run, no runner, no write access, and no approval, defeating branch protection and any organization-mandated workflow standing between the pull request and a protected branch. CWE-284 / CWE-807, CVSS 6.5 Moderate. Reported privately, fixed in 1.27.3.",
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
      "GHSA-frpv-2xgv-wxpq. routers/web/repo/attachment.go carries a guard that rejects an attachment fetched through a repository other than the one owning it, but the guard is gated on the attachment's creation timestamp rather than on whether the owning-repository ID is unset, the way the equivalent checks elsewhere are written. Since a migration backfills that ID on upgrade, the pre-16-January-2026 exemption protects nothing legitimate and instead lets permission be evaluated against the repository named in the request URL. Anyone who knows an attachment UUID can pull a private repository's issue attachments, pull request files, and release assets through a public repository's path, unauthenticated, and the draft-release and token-scope checks downstream inherit the same wrong repository. CWE-639 / CWE-863, CVSS 5.9 Moderate. Reported privately, fixed in 1.27.3.",
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
      "Reported privately: the fluent-forward module validated the collector's certificate chain against the configured <ca_file> but never checked that the certificate belonged to the configured <address>, so any certificate issued by that CA was accepted, and it parsed the shared_key_hexdigest out of the server's PONG without ever comparing it, so a collector that did not know the <shared_key> still completed the handshake. Both halves of the server's identity were therefore unauthenticated, leaving forwarded events open to interception by anyone holding a certificate from the same CA. The fix binds <address> as the expected peer name with SSL_set1_host() before SSL_connect(), sends it as SNI when it is not an IP, and adds wm_fluent_check_pong() to recompute the SHA-512 digest over the PING salt, hostname, HELO nonce, and shared key. Credited as reporter in the PR.",
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
      "The 5.x agent's HTTPS stack is its only transport, and config.c sets verification_mode to AGENT_VERIFY_NONE explicitly, which resolves to CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST both 0. No shipped agent template carries an <ssl> block, so that is the posture most agents would run with: anyone on the agent-to-manager path can terminate TLS as the manager with no credentials, read all telemetry, force re-enrollment to write attacker-chosen keys, and reach root command execution through an active_response /control task. The manager side already infers a safe mode when a CA is configured without one; the agent side has no equivalent, so configuring certificate_authorities alone silently leaves verification off. Filed as an issue rather than an advisory because the code is unreleased, to keep it from shipping in 5.0.0 GA.",
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
      "The new remoted POST /download authenticates the calling agent but never checks that it belongs to the group it asks for: resource_id comes from the request body and is joined into the served path verbatim, and locateResource has no agent identity in its signature to check against. merged.mg is the concatenation of a group's shared folder including agent.conf, which routinely holds AWS keys, Azure application keys, and database passwords, so one compromised low-value endpoint yields every other group's centralized configuration and its embedded credentials. Legacy remoted derived the group server side from the authenticated key; the membership check was written and then removed during implementation. Path containment holds up, the gap is purely authorization. Filed as an issue rather than an advisory because the code is unreleased.",
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
