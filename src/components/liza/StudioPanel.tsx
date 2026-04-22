import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Brain,
  FileText,
  Layers,
  Loader2,
  Play,
  Upload,
  X,
} from 'lucide-react';
import {
  generateFlashcards,
  generateQuiz,
  type LizaFlashcardSet,
  type LizaQuiz,
} from '../../lib/liza';
import { extractFile, MAX_PDF_BYTES } from '../../lib/pdfText';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/Toast';

type Mode = 'flashcards' | 'quiz' | null;
type SourceKind = 'prompt' | 'pdf' | 'chat';

interface Props {
  conversationId: string | null;
  chatContext: string;
  onOpenFlashcards: (setId: string) => void;
  onOpenQuiz: (quizId: string) => void;
  refreshKey: number;
}

export function StudioPanel({
  conversationId,
  chatContext,
  onOpenFlashcards,
  onOpenQuiz,
  refreshKey,
}: Props) {
  const [mode, setMode] = useState<Mode>(null);
  const [source, setSource] = useState<SourceKind>('prompt');
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>('');
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recentSets, setRecentSets] = useState<LizaFlashcardSet[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<LizaQuiz[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const fetchRecent = async () => {
    const { data: sets } = await supabase
      .from('liza_flashcard_sets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    const { data: quizzes } = await supabase
      .from('liza_quizzes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    setRecentSets((sets as LizaFlashcardSet[]) || []);
    setRecentQuizzes((quizzes as LizaQuiz[]) || []);
  };

  useEffect(() => {
    fetchRecent();
  }, [refreshKey]);

  useEffect(() => {
    if (mode === 'flashcards') setCount(10);
    if (mode === 'quiz') setCount(5);
  }, [mode]);

  const handleFile = async (f: File) => {
    if (f.size > MAX_PDF_BYTES) {
      showToast('File is larger than 2 MB. Please upload a smaller file.', 'error');
      return;
    }
    setFile(f);
    setExtracting(true);
    try {
      const text = await extractFile(f);
      setFileText(text);
      setSource('pdf');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to read file';
      showToast(msg, 'error');
      setFile(null);
      setFileText('');
    } finally {
      setExtracting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileText('');
    if (source === 'pdf') setSource('prompt');
  };

  const resolveSourceText = (): { text: string; filename?: string } | null => {
    if (source === 'pdf') {
      if (!fileText) return null;
      return { text: fileText, filename: file?.name };
    }
    if (source === 'chat') {
      if (!chatContext.trim()) return null;
      return { text: chatContext };
    }
    return { text: prompt };
  };

  const handleGenerate = async () => {
    const srcText = resolveSourceText();
    if (!srcText || !srcText.text.trim()) {
      showToast('Please provide a topic, upload a file, or have some chat history.', 'error');
      return;
    }
    setGenerating(true);
    try {
      if (mode === 'flashcards') {
        const res = await generateFlashcards({
          source: srcText.text,
          count,
          sourceType: source,
          sourceFilename: srcText.filename,
          conversationId,
        });
        showToast(`Created "${res.set.title}"`, 'success');
        setMode(null);
        setPrompt('');
        clearFile();
        await fetchRecent();
        onOpenFlashcards(res.set.id);
      } else if (mode === 'quiz') {
        const res = await generateQuiz({
          source: srcText.text,
          count,
          sourceType: source,
          sourceFilename: srcText.filename,
          conversationId,
        });
        showToast(`Created "${res.quiz.title}"`, 'success');
        setMode(null);
        setPrompt('');
        clearFile();
        await fetchRecent();
        onOpenQuiz(res.quiz.id);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      showToast(msg, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const limits = mode === 'flashcards' ? { min: 3, max: 20 } : { min: 3, max: 30 };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200/70 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent-600 dark:text-accent-400" />
          <div className="text-sm font-bold text-gray-900 dark:text-white">Studio</div>
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          Generate study materials from prompts, files, or chat
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {mode === null && (
            <>
              <button
                onClick={() => setMode('flashcards')}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-900 dark:border-white/60 bg-white dark:bg-dark-surface shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Flashcards
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Flip-card deck to memorize key concepts
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setMode('quiz')}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-900 dark:border-white/60 bg-white dark:bg-dark-surface shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/15 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Quiz</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Multiple-choice questions with explanations
                    </div>
                  </div>
                </div>
              </button>
            </>
          )}

          {mode !== null && (
            <div className="rounded-xl border-2 border-gray-900 dark:border-white/60 bg-white dark:bg-dark-surface p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                  New {mode}
                </div>
                <button
                  onClick={() => setMode(null)}
                  aria-label="Cancel"
                  className="w-7 h-7 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Source
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['prompt', 'pdf', 'chat'] as SourceKind[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSource(s)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                        source === s
                          ? 'border-accent-500 bg-accent-500/10 text-accent-700 dark:text-accent-300'
                          : 'border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {s === 'pdf' ? 'File' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {source === 'prompt' && (
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Topic or notes to study (e.g., Photosynthesis in plants)"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-white/15 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-accent-500 resize-none"
                  />
                </div>
              )}

              {source === 'pdf' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  />
                  {!file ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg p-4 text-center hover:border-accent-500 hover:bg-accent-500/5 transition-colors"
                    >
                      <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1.5" />
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Upload PDF or TXT
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Max 2 MB
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-accent-500/10 border border-accent-500/30">
                      {extracting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-accent-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-accent-600 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(0)} KB
                          {fileText && ` · ${fileText.length.toLocaleString()} chars`}
                        </div>
                      </div>
                      <button
                        onClick={clearFile}
                        className="w-6 h-6 rounded-md hover:bg-white/60 dark:hover:bg-white/10 flex items-center justify-center text-gray-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {source === 'chat' && (
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-gray-300">
                  {chatContext.trim()
                    ? `Using ${chatContext.length.toLocaleString()} characters from this conversation.`
                    : 'Start chatting first to use the conversation as a source.'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {mode === 'flashcards' ? 'Cards' : 'Questions'}
                  </div>
                  <div className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                    {count}
                  </div>
                </div>
                <input
                  type="range"
                  min={limits.min}
                  max={limits.max}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-accent-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 font-mono">
                  <span>{limits.min}</span>
                  <span>{limits.max}</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || extracting}
                className="w-full neo-brutal-btn bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" strokeWidth={3} />
                    Generate {mode}
                  </>
                )}
              </button>
            </div>
          )}

          {mode === null && (recentSets.length > 0 || recentQuizzes.length > 0) && (
            <div className="pt-2">
              <div className="px-1 py-2 text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                Recent
              </div>
              <div className="space-y-1.5">
                {recentSets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onOpenFlashcards(s.id)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-left"
                  >
                    <Layers className="w-4 h-4 text-accent-600 dark:text-accent-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        Flashcards
                      </div>
                    </div>
                  </button>
                ))}
                {recentQuizzes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => onOpenQuiz(q.id)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-left"
                  >
                    <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {q.title}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        {q.question_count} questions
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
