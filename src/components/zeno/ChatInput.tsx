import { useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { ArrowUp, Paperclip, Loader2, X, FileText } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttach?: (file: File) => void;
  attachedFileName?: string | null;
  onClearAttachment?: () => void;
  disabled?: boolean;
  streaming?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onAttach,
  attachedFileName,
  onClearAttachment,
  disabled,
  streaming,
  placeholder = 'Ask Zeno anything...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttach) onAttach(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="p-3 md:p-4">
      <div className="glass rounded-2xl border-2 border-gray-900 dark:border-white/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] focus-within:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.35)] focus-within:translate-x-0.5 focus-within:translate-y-0.5 transition-all">
        {attachedFileName && (
          <div className="flex items-center gap-2 px-3 pt-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-accent-500/10 border border-accent-500/30 text-accent-700 dark:text-accent-300 text-xs font-medium max-w-full">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{attachedFileName}</span>
              <button
                type="button"
                onClick={onClearAttachment}
                aria-label="Remove attachment"
                className="ml-1 hover:text-red-500 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-end gap-2 p-2">
          {onAttach && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="hidden"
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={disabled}
                aria-label="Attach file"
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent outline-none px-2 py-2.5 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 max-h-[200px]"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="shrink-0 w-10 h-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
          >
            {streaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 dark:text-gray-500 text-center mt-2">
        Zeno learns from your SkillBarter activity. Press Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}
