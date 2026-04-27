import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 text-[0.85em] font-mono rounded bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string) {
  const blocks: { type: 'code' | 'text'; lang?: string; content: string }[] = [];
  const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = codeRegex.exec(text)) !== null) {
    if (m.index > last) blocks.push({ type: 'text', content: text.slice(last, m.index) });
    blocks.push({ type: 'code', lang: m[1] || 'text', content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) blocks.push({ type: 'text', content: text.slice(last) });

  return blocks.map((block, bi) => {
    if (block.type === 'code') {
      return (
        <pre
          key={bi}
          className="my-3 p-3 rounded-lg bg-gray-900 dark:bg-black/60 text-gray-100 text-[13px] overflow-x-auto font-mono leading-relaxed"
        >
          <code>{block.content}</code>
        </pre>
      );
    }
    const lines = block.content.split('\n');
    const nodes: React.ReactNode[] = [];
    let listBuffer: { ordered: boolean; items: string[] } | null = null;
    const flushList = () => {
      if (!listBuffer) return;
      const { ordered, items } = listBuffer;
      const Tag = ordered ? 'ol' : 'ul';
      nodes.push(
        <Tag
          key={`l-${bi}-${nodes.length}`}
          className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 my-3 space-y-1.5`}
        >
          {items.map((it, ii) => (
            <li key={ii} className="leading-relaxed">{renderInline(it)}</li>
          ))}
        </Tag>,
      );
      listBuffer = null;
    };
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      const orderedMatch = line.match(/^\s*\d+\.\s+(.+)/);
      const unorderedMatch = line.match(/^\s*[-*]\s+(.+)/);
      if (orderedMatch) {
        if (!listBuffer || !listBuffer.ordered) {
          flushList();
          listBuffer = { ordered: true, items: [] };
        }
        listBuffer!.items.push(orderedMatch[1]);
      } else if (unorderedMatch) {
        if (!listBuffer || listBuffer.ordered) {
          flushList();
          listBuffer = { ordered: false, items: [] };
        }
        listBuffer!.items.push(unorderedMatch[1]);
      } else {
        flushList();
        const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const sizes = ['text-xl', 'text-lg', 'text-base'];
          nodes.push(
            <div
              key={`h-${bi}-${li}`}
              className={`${sizes[level - 1]} font-semibold mt-4 mb-2 text-gray-900 dark:text-white`}
            >
              {renderInline(headingMatch[2])}
            </div>,
          );
        } else if (line.trim()) {
          nodes.push(
            <p key={`p-${bi}-${li}`} className="my-2 leading-[1.7]">
              {renderInline(line)}
            </p>,
          );
        } else {
          nodes.push(<div key={`b-${bi}-${li}`} className="h-2" />);
        }
      }
    }
    flushList();
    return <div key={bi}>{nodes}</div>;
  });
}

export function ChatMessage({ role, content, streaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  if (isUser) {
    return (
      <div className="group py-3">
        <div className="text-[15px] leading-[1.7] text-gray-900 dark:text-white whitespace-pre-wrap font-medium">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="group py-3">
      <div className="text-[15px] text-gray-800 dark:text-gray-100">
        {renderMarkdown(content)}
        {streaming && (
          <span className="inline-block w-2 h-4 align-middle ml-0.5 bg-current animate-pulse rounded-sm" />
        )}
      </div>
      {!streaming && content && (
        <button
          onClick={handleCopy}
          aria-label="Copy message"
          className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      )}
    </div>
  );
}
