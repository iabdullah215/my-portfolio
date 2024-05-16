// components/MDXComponents.tsx
import React from 'react';

const CodeBlock = (props) => {
  return <pre {...props} />;
};

const InlineCode = (props) => {
  return <code className="inline" {...props} />;
};

const MDXComponents = {
  pre: CodeBlock,
  code: InlineCode,
};

export default MDXComponents;
