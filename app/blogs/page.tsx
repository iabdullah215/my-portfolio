import { allPosts } from 'contentlayer/generated';
import Link from 'next/link';

const BlogsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Blogs</h1>
      <ul>
        {allPosts.map((post) => (
          <li key={post.slug} className="mb-4">
            <Link href={`/blogs/${post.slug}`}>
              <a className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </a>
            </Link>
            <p className="text-gray-600">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogsPage;
