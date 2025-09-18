"use client";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h6>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-muted-foreground leading-relaxed">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-muted-foreground">{children}</td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-8 border-border" />,

          // Code (inline and blocks)
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");

            return match ? (
              <div className="my-4">
                <SyntaxHighlighter
                  /* @ts-expect-error - SyntaxHighlighter types are outdated and cause style prop conflicts */
                  style={darcula}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  {...rest}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                {...rest}
              >
                {children}
              </code>
            );
          },

          // Pre (for code blocks without language)
          pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
              {children}
            </pre>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
