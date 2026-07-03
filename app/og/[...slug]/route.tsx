import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import { allPosts } from "contentlayer/generated";

/*
 * Per-post OG image, e.g. /og/crta-review. Lives here as an explicit route
 * handler because Next 13 does not allow the opengraph-image file convention
 * inside a catch-all segment ("Catch-all must be the last part of the URL").
 * Referenced from generateMetadata in app/posts/[...slug]/page.tsx.
 */

// Node runtime: the edge build of @vercel/og fails to load its default font
// in this Next 13.4 setup; the node build reads it from the filesystem.
export const runtime = "nodejs";

const size = { width: 1200, height: 630 };

// Passing explicit fonts makes @vercel/og skip its (broken) bundled default
// font entirely — and gets us the theme's real mono face in the card.
const fontRegular = readFileSync(
  join(process.cwd(), "fonts", "JetBrainsMono-Regular.ttf")
);
const fontBold = readFileSync(
  join(process.cwd(), "fonts", "JetBrainsMono-Bold.ttf")
);
const fonts = [
  { name: "JetBrains Mono", data: fontRegular, weight: 400 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: fontBold, weight: 700 as const, style: "normal" as const },
];

interface OgContext {
  params: { slug: string[] };
}

export async function GET(_req: Request, { params }: OgContext) {
  const slug = params.slug.join("/");
  const post = allPosts.find((p) => p.slugAsParams === slug);

  const title = post?.title ?? "Hwat Sauce";
  const description = post?.description ?? "";
  const date = post
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(52, 211, 153, 0.16), transparent 55%)",
          fontFamily: "JetBrains Mono",
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 1060,
            height: 520,
            borderRadius: 18,
            border: "1px solid #27272a",
            backgroundColor: "#101012",
            overflow: "hidden",
          }}
        >
          {/* Chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 26px",
              borderBottom: "1px solid #27272a",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#f87171" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#facc15" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#34d399" }} />
            <div style={{ display: "flex", marginLeft: 14, fontSize: 20, color: "#a1a1aa" }}>
              ~/posts/{slug}.mdx
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "space-between",
              padding: "40px 56px 44px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>
                <span style={{ color: "#34d399", marginRight: 14 }}>$</span>
                cat {slug}.mdx
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  fontSize: title.length > 42 ? 50 : 62,
                  fontWeight: 700,
                  color: "#e4e4e7",
                  letterSpacing: -1.5,
                  lineHeight: 1.15,
                }}
              >
                {title}
              </div>
              {description && (
                <div
                  style={{
                    display: "flex",
                    marginTop: 18,
                    fontSize: 28,
                    color: "#a1a1aa",
                    lineHeight: 1.4,
                  }}
                >
                  {description.length > 120
                    ? `${description.slice(0, 117)}…`
                    : description}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 24,
              }}
            >
              <div style={{ display: "flex", color: "#34d399" }}>
                ❯ hwat.sauce
              </div>
              <div style={{ display: "flex", color: "#a1a1aa" }}>{date}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
