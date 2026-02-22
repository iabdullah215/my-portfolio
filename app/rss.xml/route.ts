import { allPosts } from "contentlayer/generated";

const siteUrl = "https://iabdullah.vercel.app";
const siteTitle = "Hwat Sauce";
const siteDescription = "My Blog/Portfolio Website";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = allPosts
    .filter((post) => Boolean(post.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slugAsParams}`;
      const description = post.description ?? "";
      const pubDate = new Date(post.date).toUTCString();

      return `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${postUrl}</link>\n      <guid>${postUrl}</guid>\n      <description>${escapeXml(description)}</description>\n      <pubDate>${pubDate}</pubDate>\n    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(siteTitle)}</title>\n    <link>${siteUrl}</link>\n    <description>${escapeXml(siteDescription)}</description>\n    <language>en</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}\n  </channel>\n</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
