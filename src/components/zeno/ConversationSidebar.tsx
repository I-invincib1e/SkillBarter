import { useMemo } from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { type ZenoConversation, groupConversationsByTime } from '../../lib/zeno';

interface Props {
  conversations: ZenoConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  const groups = useMemo(() => groupConversationsByTime(conversations), [conversations]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200/70 dark:border-white/10">
        <button
          onClick={onNew}
          className="w-full neo-brutal-btn bg-accent-500 text-white rounded-xl px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
            No chats yet. Start a conversation with Zeno.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-3">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative rounded-lg transition-colors ${
                      activeId === c.id
                        ? 'bg-gray-900/5 dark:bg-white/10'
                        : 'hover:bg-gray-100/70 dark:hover:bg-white/5'
                    }`}
                  >
                    <button
                      onClick={() => onSelect(c.id)}
                      className="w-full text-left px-3 py-2 pr-9 text-sm truncate text-gray-800 dark:text-gray-200"
                      title={c.title}
                    >
                      {c.title}
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      aria-label="Delete conversation"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-500/10 text-gray-400 hover:text-red-500 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
