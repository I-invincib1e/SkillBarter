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
    <div className="px-3 md:px-4 pb-3 md:pb-4 pt-2">
      <div className="rounded-3xl bg-gray-100 dark:bg-white/5">
        {attachedFileName && (
          <div className="flex items-center gap-2 px-4 pt-3">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-medium max-w-full">
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
        <div className="flex items-end gap-1 p-2">
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
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-40"
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
            className="shrink-0 w-9 h-9 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {streaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2">
        Zeno can make mistakes. Press Enter to send, Shift+Enter for new line.
      </p>
    </div>
  );
}
