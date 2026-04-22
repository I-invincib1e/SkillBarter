import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, X } from 'lucide-react';
import { type LizaFlashcard } from '../../lib/liza';

interface Props {
  title: string;
  cards: LizaFlashcard[];
  onClose: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardViewer({ title, cards, onClose }: Props) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (deck.length === 0) return null;
  const card = deck[index];

  const next = () => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, deck.length - 1));
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  };
  const shuffle = () => {
    setDeck(shuffleArray(deck));
    setIndex(0);
    setFlipped(false);
  };
  const restart = () => {
    setIndex(0);
    setFlipped(false);
  };

  const progress = ((index + 1) / deck.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl border-3 border-gray-900 dark:border-white/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-gray-900 dark:border-white/20 bg-accent-500/10">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-accent-700 dark:text-accent-300">
              Flashcards
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[340px]">
              {title}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-mono">
            <span>
              Card {index + 1} / {deck.length}
            </span>
            <span>Tap card to flip</span>
          </div>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full h-64 md:h-72 relative rounded-2xl border-3 border-gray-900 dark:border-white/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            style={{ perspective: '1000px' }}
          >
            <div
              className="absolute inset-0 transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 text-center bg-white dark:bg-dark-card"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Question
                  </div>
                  <div className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-snug">
                    {card.front}
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 text-center bg-accent-500 text-white"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-white/80 mb-3">
                    Answer
                  </div>
                  <div className="text-base md:text-lg font-medium leading-snug">
                    {card.back}
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 pb-5">
          <button
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-dark-surface border-2 border-gray-900 dark:border-white/50 text-sm font-semibold text-gray-900 dark:text-white disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <div className="flex gap-2">
            <button
              onClick={shuffle}
              aria-label="Shuffle"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={restart}
              aria-label="Restart"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={next}
            disabled={index === deck.length - 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold disabled:opacity-30 hover:opacity-90"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
