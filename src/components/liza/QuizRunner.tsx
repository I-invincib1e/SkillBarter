import { useState } from 'react';
import { Check, X, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { type LizaQuizQuestion } from '../../lib/liza';

interface Props {
  quizId: string;
  title: string;
  questions: LizaQuizQuestion[];
  onClose: () => void;
}

export function QuizRunner({ quizId, title, questions, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const q = questions[index];
  const total = questions.length;
  const progress = ((index + (finished ? 1 : 0)) / total) * 100;

  const handleNext = async () => {
    if (selected === null) return;
    const updated = [...answers];
    updated[index] = selected;
    setAnswers(updated);
    setSelected(null);
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      const score = updated.reduce<number>(
        (acc, a, i) => acc + (a === questions[i].correct_index ? 1 : 0),
        0,
      );
      setSaving(true);
      try {
        const { data: userRes } = await supabase.auth.getUser();
        if (userRes.user) {
          await supabase.from('liza_quiz_attempts').insert({
            quiz_id: quizId,
            user_id: userRes.user.id,
            answers: updated,
            score,
            total,
          });
        }
      } catch {
        // ignore
      } finally {
        setSaving(false);
      }
    }
  };

  const retake = () => {
    setIndex(0);
    setAnswers(Array(total).fill(null));
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    const score = answers.reduce<number>(
      (acc, a, i) => acc + (a === questions[i].correct_index ? 1 : 0),
      0,
    );
    const pct = Math.round((score / total) * 100);

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card rounded-2xl border-3 border-gray-900 dark:border-white/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)]">
          <div className="p-6 bg-gradient-to-br from-accent-500 to-accent-400 text-white border-b-3 border-gray-900 dark:border-white/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-white/80">
                  Quiz complete
                </div>
                <div className="text-xl font-bold truncate max-w-[360px]">{title}</div>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="font-space text-5xl font-bold">{score}</div>
              <div className="text-lg opacity-80">/ {total}</div>
              <div className="ml-auto text-3xl font-bold">{pct}%</div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {questions.map((qu, i) => {
              const picked = answers[i];
              const correct = picked === qu.correct_index;
              return (
                <div
                  key={qu.id}
                  className={`rounded-xl border-2 p-4 ${
                    correct
                      ? 'border-success-500/60 bg-success-500/5'
                      : 'border-red-500/60 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                        correct ? 'bg-success-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {correct ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        <X className="w-4 h-4" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {i + 1}. {qu.question}
                    </div>
                  </div>
                  <div className="mt-2 ml-8 space-y-1 text-sm">
                    {picked !== null && picked !== qu.correct_index && (
                      <div className="text-red-600 dark:text-red-400">
                        Your answer: {qu.options[picked]}
                      </div>
                    )}
                    <div className="text-success-700 dark:text-success-300">
                      Correct: {qu.options[qu.correct_index]}
                    </div>
                    {qu.explanation && (
                      <div className="text-gray-600 dark:text-gray-400 text-[13px] mt-1">
                        {qu.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-5 border-t border-gray-200 dark:border-white/10 flex gap-3">
            <button
              onClick={retake}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border-2 border-gray-900 dark:border-white/60 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              Retake quiz
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              Back to chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl border-3 border-gray-900 dark:border-white/80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-gray-900 dark:border-white/20 bg-accent-500/10">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-accent-700 dark:text-accent-300">
              Quiz
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
              Question {index + 1} / {total}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-snug mb-5">
            {q.question}
          </div>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    isSel
                      ? 'border-accent-500 bg-accent-500/10 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.6)]'
                      : 'border-gray-200 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/40 bg-white dark:bg-dark-surface'
                  }`}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${
                      isSel
                        ? 'border-accent-500 bg-accent-500 text-white'
                        : 'border-gray-300 dark:border-white/30 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end px-5 pb-5">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          >
            {index + 1 === total ? 'Submit' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
