import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';

interface BlogPostProps {
  frontMatter: {
    title: string;
    date: string;
  };
  content: MDXRemoteSerializeResult;
}

export default function BlogPost({ frontMatter, content }: BlogPostProps) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <p>{frontMatter.date}</p>
      <MDXRemote {...content} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('content/posts'));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('content/posts', `${params?.slug}.mdx`),
    'utf-8'
  );

  const { data: frontMatter, content } = matter(markdownWithMeta);

  // You would serialize the MDX content here for rendering
  const mdxSource = await serialize(content);

  return {
    props: {
      frontMatter,
      content: mdxSource,
    },
  };
};
