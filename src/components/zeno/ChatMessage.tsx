import { useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';

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
        <strong key={i} className="font-semibold">
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
    if (m.index > last) {
      blocks.push({ type: 'text', content: text.slice(last, m.index) });
    }
    blocks.push({ type: 'code', lang: m[1] || 'text', content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) blocks.push({ type: 'text', content: text.slice(last) });

  return blocks.map((block, bi) => {
    if (block.type === 'code') {
      return (
        <pre
          key={bi}
          className="my-2 p-3 rounded-lg bg-gray-900 dark:bg-black/60 text-gray-100 text-[13px] overflow-x-auto font-mono leading-relaxed"
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
          className={`${
            ordered ? 'list-decimal' : 'list-disc'
          } pl-5 my-2 space-y-1`}
        >
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it)}</li>
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
        if (!listBuffer || !listBuffer.ordered)
          flushList(), (listBuffer = { ordered: true, items: [] });
        listBuffer!.items.push(orderedMatch[1]);
      } else if (unorderedMatch) {
        if (!listBuffer || listBuffer.ordered)
          flushList(), (listBuffer = { ordered: false, items: [] });
        listBuffer!.items.push(unorderedMatch[1]);
      } else {
        flushList();
        const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const sizes = ['text-lg', 'text-base', 'text-sm'];
          nodes.push(
            <div
              key={`h-${bi}-${li}`}
              className={`${sizes[level - 1]} font-semibold mt-3 mb-1`}
            >
              {renderInline(headingMatch[2])}
            </div>,
          );
        } else if (line.trim()) {
          nodes.push(
            <p key={`p-${bi}-${li}`} className="my-1.5 leading-relaxed">
              {renderInline(line)}
            </p>,
          );
        } else {
          nodes.push(<div key={`b-${bi}-${li}`} className="h-1" />);
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

  return (
    <div
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-400 flex items-center justify-center border-2 border-gray-900 dark:border-white/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`relative max-w-[85%] md:max-w-[75%] ${
          isUser
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl rounded-tr-sm px-4 py-2.5'
            : 'glass rounded-2xl rounded-tl-sm px-4 py-2.5 text-gray-800 dark:text-gray-100'
        }`}
      >
        <div className="text-[15px]">
          {renderMarkdown(content)}
          {streaming && (
            <span className="inline-block w-2 h-4 align-middle ml-0.5 bg-current animate-pulse rounded-sm" />
          )}
        </div>
        {!streaming && content && (
          <button
            onClick={handleCopy}
            aria-label="Copy message"
            className={`absolute -bottom-2 ${
              isUser ? '-left-2' : '-right-2'
            } opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-white/15 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
