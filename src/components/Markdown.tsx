import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      className="prose-data"
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children: label, href }) => (
          <a href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
