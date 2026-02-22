import type { MetadataRoute } from "next";
import { allPages, allPosts } from "contentlayer/generated";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://iabdullah.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
    },
    {
      url: `${siteUrl}/blog`,
    },
    {
      url: `${siteUrl}/profile`,
    },
    {
      url: `${siteUrl}/cert`,
    },
  ];

  const pageRoutes: MetadataRoute.Sitemap = allPages.map((page) => ({
    url: `${siteUrl}/${page.slugAsParams}`,
  }));

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${siteUrl}/posts/${post.slugAsParams}`,
    lastModified: post.date ? new Date(post.date) : undefined,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes];
}
