import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import { BlogList, type BlogListPost } from "@/components/blog-list";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Collection of my thoughts on various topics",
};

// Only list metadata crosses to the client, never the compiled MDX bodies.
const posts: BlogListPost[] = [...allPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map((post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    tags: (post.tags ?? []).map((t) => t.trim()).filter(Boolean),
    minutes: Math.max(
      1,
      Math.round(post.body.raw.trim().split(/\s+/).length / 200)
    ),
  }));

export default function BlogPage() {
  return <BlogList posts={posts} />;
}
