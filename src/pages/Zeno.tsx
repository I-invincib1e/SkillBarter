import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageSquare, PanelRight, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import {
  streamChat,
  type ZenoConversation,
  type ZenoMessage,
  type ZenoFlashcard,
  type ZenoQuizQuestion,
} from '../lib/zeno';
import { extractFile, MAX_PDF_BYTES } from '../lib/pdfText';
import { ChatMessage } from '../components/zeno/ChatMessage';
import { ChatInput } from '../components/zeno/ChatInput';
import { ConversationSidebar } from '../components/zeno/ConversationSidebar';
import { WelcomeScreen } from '../components/zeno/WelcomeScreen';
import { StudioPanel } from '../components/zeno/StudioPanel';
import { FlashcardViewer } from '../components/zeno/FlashcardViewer';
import { QuizRunner } from '../components/zeno/QuizRunner';

type DisplayMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
};

export function Zeno() {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<ZenoConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedText, setAttachedText] = useState<string>('');
  const [showConvList, setShowConvList] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [studioRefresh, setStudioRefresh] = useState(0);

  const [flashcardView, setFlashcardView] = useState<{
    title: string;
    cards: ZenoFlashcard[];
  } | null>(null);
  const [quizView, setQuizView] = useState<{
    id: string;
    title: string;
    questions: ZenoQuizQuestion[];
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const chatContext = useMemo(
    () =>
      messages
        .filter((m) => m.content.trim())
        .map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.content}`)
        .join('\n\n'),
    [messages],
  );

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('liza_conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    setConversations((data as ZenoConversation[]) || []);
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    const { data } = await supabase
      .from('liza_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    const msgs: DisplayMessage[] = ((data as ZenoMessage[]) || [])
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    setMessages(msgs);
    setLoadingMessages(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
    else setMessages([]);
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    if (streaming) return;
    setActiveId(null);
    setMessages([]);
    setAttachedFile(null);
    setAttachedText('');
    setShowConvList(false);
  };

  const handleSelect = (id: string) => {
    if (streaming) return;
    setActiveId(id);
    setShowConvList(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('liza_conversations').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete conversation', 'error');
      return;
    }
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
    await fetchConversations();
  };

  const handleAttach = async (file: File) => {
    if (file.size > MAX_PDF_BYTES) {
      showToast('File is larger than 2 MB. Please upload a smaller file.', 'error');
      return;
    }
    setAttachedFile(file);
    try {
      const text = await extractFile(file);
      setAttachedText(text);
      showToast(`Attached ${file.name}`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to read file';
      showToast(msg, 'error');
      setAttachedFile(null);
      setAttachedText('');
    }
  };

  const handleClearAttachment = () => {
    setAttachedFile(null);
    setAttachedText('');
  };

  const handleSend = async (text: string) => {
    if (streaming) return;

    let userContent = text;
    if (attachedText) {
      userContent = `${text}\n\n---\nAttached source${attachedFile ? ` (${attachedFile.name})` : ''}:\n"""\n${attachedText.slice(0, 12000)}\n"""`;
    }

    const userMsgId = `local-u-${Date.now()}`;
    const assistantMsgId = `local-a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: text },
      { id: assistantMsgId, role: 'assistant', content: '', streaming: true },
    ]);
    setStreaming(true);
    setAttachedFile(null);
    setAttachedText('');

    const controller = new AbortController();
    abortRef.current = controller;

    let newConvId: string | null = activeId;
    try {
      await streamChat({
        message: userContent,
        conversationId: activeId,
        signal: controller.signal,
        onMeta: (meta) => {
          newConvId = meta.conversation_id;
          if (!activeId) setActiveId(meta.conversation_id);
        },
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: m.content + token } : m,
            ),
          );
        },
        onTitle: () => {
          fetchConversations();
        },
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, streaming: false } : m)),
      );
      if (newConvId) fetchConversations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Chat failed';
      showToast(msg, 'error');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, streaming: false, content: m.content || 'Sorry, I could not respond.' }
            : m,
        ),
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleOpenFlashcards = async (setId: string) => {
    const { data: setData } = await supabase
      .from('liza_flashcard_sets')
      .select('*')
      .eq('id', setId)
      .maybeSingle();
    const { data: cards } = await supabase
      .from('liza_flashcards')
      .select('*')
      .eq('set_id', setId)
      .order('position', { ascending: true });
    if (!setData || !cards) {
      showToast('Could not open flashcards', 'error');
      return;
    }
    setFlashcardView({ title: setData.title, cards: cards as ZenoFlashcard[] });
    setStudioRefresh((n) => n + 1);
  };

  const handleOpenQuiz = async (quizId: string) => {
    const { data: quizData } = await supabase
      .from('liza_quizzes')
      .select('*')
      .eq('id', quizId)
      .maybeSingle();
    const { data: questions } = await supabase
      .from('liza_quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('position', { ascending: true });
    if (!quizData || !questions) {
      showToast('Could not open quiz', 'error');
      return;
    }
    setQuizView({
      id: quizId,
      title: quizData.title,
      questions: questions as ZenoQuizQuestion[],
    });
    setStudioRefresh((n) => n + 1);
  };

  const activeTitle = activeId
    ? conversations.find((c) => c.id === activeId)?.title || 'Chat'
    : 'Zeno';

  return (
    <div className="-mx-4 sm:-mx-6 -my-6 h-[calc(100vh-3.5rem-5rem)] md:h-[calc(100vh-1.5rem)] flex flex-col bg-white dark:bg-dark-bg">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => setShowConvList(true)}
          className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
          aria-label="Conversations"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <div className="font-space font-semibold text-sm text-gray-900 dark:text-white truncate px-2">
          {activeTitle}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
            aria-label="New chat"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowStudio(true)}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
            aria-label="Studio"
          >
            <PanelRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {loadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen name={profile?.name} onPrompt={handleSend} />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                streaming={m.streaming}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <ChatInput
          onSend={handleSend}
          onAttach={handleAttach}
          attachedFileName={attachedFile?.name || null}
          onClearAttachment={handleClearAttachment}
          streaming={streaming}
          disabled={streaming}
        />
      </div>

      {showConvList && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowConvList(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-dark-bg border-r-3 border-gray-900 dark:border-white/60 animate-slide-in-right">
            <ConversationSidebar
              conversations={conversations}
              activeId={activeId}
              onSelect={handleSelect}
              onNew={handleNewChat}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {showStudio && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowStudio(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[88vw] bg-white dark:bg-dark-bg border-l-3 border-gray-900 dark:border-white/60">
            <StudioPanel
              conversationId={activeId}
              chatContext={chatContext}
              onOpenFlashcards={(id) => {
                setShowStudio(false);
                handleOpenFlashcards(id);
              }}
              onOpenQuiz={(id) => {
                setShowStudio(false);
                handleOpenQuiz(id);
              }}
              refreshKey={studioRefresh}
            />
          </div>
        </div>
      )}

      {flashcardView && (
        <FlashcardViewer
          title={flashcardView.title}
          cards={flashcardView.cards}
          onClose={() => setFlashcardView(null)}
        />
      )}
      {quizView && (
        <QuizRunner
          quizId={quizView.id}
          title={quizView.title}
          questions={quizView.questions}
          onClose={() => setQuizView(null)}
        />
      )}
    </div>
  );
}


export { Zeno }