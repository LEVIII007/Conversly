'use client';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function parseMarkdownIntoBlocks(markdown: string): string[] {
  return markdown.split(/\n\n+/); // Split by double newlines to handle blocks
}

// Memoized Markdown Block Component
const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => (
            <p className="text-[18px] font-sans text-gray-300 mb-4">{children}</p>
          ),
          code({ className, children, ...props }) {
            const isInline = !className;

            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-[#2a2a2a] text-gray-200 font-sans rounded text-[15px]" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-4 my-3 bg-[#2a2a2a] font-sans text-gray-200 rounded-lg overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-200">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-200">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] font-sans text-gray-200">{children}</li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

// Main Memoized Markdown Component
export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
