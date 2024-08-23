import { allPosts } from 'contentlayer/generated';
import { MDXRemote } from 'next-mdx-remote';
import { notFound } from 'next/navigation';

const BlogPost = ({ post }: { post: any }) => {
  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <div className="prose">
        <MDXRemote {...post.body.code} />
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  return {
    props: {
      post,
    },
  };
}

export default BlogPost;
