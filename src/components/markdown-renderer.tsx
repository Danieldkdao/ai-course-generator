import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <pre className="rounded-lg bg-zinc-900 text-primary p-4 overflow-x-auto scrollbar-none">
              <code className={`language-${match[1]}`}>{children}</code>
            </pre>
          ) : (
            <code className="bg-zinc-800 rounded px-1 py-0.5 text-primary">{children}</code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
