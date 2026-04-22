/*
  # Create LIZA AI Assistant Tables

  Adds tables for LIZA, the Learning Integrated Zonal Assistant, covering chat
  conversations, messages, flashcards, quizzes, and quiz attempts.

  1. New Tables
    - `liza_conversations` - Chat threads owned by a user
      - id (uuid, PK)
      - user_id (uuid, FK auth.users)
      - title (text)
      - created_at, updated_at (timestamptz)
    - `liza_messages` - Individual messages inside a conversation
      - id (uuid, PK)
      - conversation_id (uuid, FK liza_conversations)
      - role (text: user | assistant | system)
      - content (text)
      - created_at (timestamptz)
    - `liza_flashcard_sets` - Generated flashcard decks
      - id (uuid, PK)
      - user_id (uuid), conversation_id (uuid, nullable)
      - title (text), source_type (prompt | pdf | chat)
      - source_filename (text, nullable)
      - created_at (timestamptz)
    - `liza_flashcards` - Individual cards in a set
      - id (uuid, PK), set_id (uuid, FK)
      - front (text), back (text), position (int)
    - `liza_quizzes` - Generated quizzes
      - id, user_id, conversation_id (nullable)
      - title, source_type, source_filename
      - question_count (int)
    - `liza_quiz_questions` - MCQ questions
      - id, quiz_id (FK)
      - question (text), options (jsonb array of 4 strings)
      - correct_index (int 0-3), explanation (text), position (int)
    - `liza_quiz_attempts` - Records of user quiz attempts
      - id, quiz_id, user_id
      - answers (jsonb), score (int), total (int)
      - completed_at (timestamptz)

  2. Security
    - RLS enabled on every table
    - Users may only read/insert/update/delete their own rows
    - Flashcards and quiz questions are readable/writable only if the
      parent set/quiz belongs to the current user

  3. Indexes
    - (user_id, created_at DESC) on conversations, flashcard sets, quizzes
    - (conversation_id, created_at) on messages
    - (set_id, position) on flashcards
    - (quiz_id, position) on quiz questions
*/

CREATE TABLE IF NOT EXISTS liza_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_conversations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_conversations_user_created
  ON liza_conversations (user_id, created_at DESC);

CREATE POLICY "Users can read own conversations"
  ON liza_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON liza_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON liza_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON liza_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS liza_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES liza_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_messages_conversation_created
  ON liza_messages (conversation_id, created_at);

CREATE POLICY "Users can read own messages"
  ON liza_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_conversations c
      WHERE c.id = liza_messages.conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON liza_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM liza_conversations c
      WHERE c.id = liza_messages.conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages"
  ON liza_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_conversations c
      WHERE c.id = liza_messages.conversation_id AND c.user_id = auth.uid()
    )
  );


CREATE TABLE IF NOT EXISTS liza_flashcard_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES liza_conversations(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Flashcards',
  source_type text NOT NULL DEFAULT 'prompt' CHECK (source_type IN ('prompt', 'pdf', 'chat')),
  source_filename text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_flashcard_sets ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_flashcard_sets_user_created
  ON liza_flashcard_sets (user_id, created_at DESC);

CREATE POLICY "Users can read own flashcard sets"
  ON liza_flashcard_sets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard sets"
  ON liza_flashcard_sets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard sets"
  ON liza_flashcard_sets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard sets"
  ON liza_flashcard_sets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS liza_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id uuid NOT NULL REFERENCES liza_flashcard_sets(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_flashcards ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_flashcards_set_position
  ON liza_flashcards (set_id, position);

CREATE POLICY "Users can read own flashcards"
  ON liza_flashcards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_flashcard_sets s
      WHERE s.id = liza_flashcards.set_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own flashcards"
  ON liza_flashcards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM liza_flashcard_sets s
      WHERE s.id = liza_flashcards.set_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own flashcards"
  ON liza_flashcards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_flashcard_sets s
      WHERE s.id = liza_flashcards.set_id AND s.user_id = auth.uid()
    )
  );


CREATE TABLE IF NOT EXISTS liza_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES liza_conversations(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Quiz',
  source_type text NOT NULL DEFAULT 'prompt' CHECK (source_type IN ('prompt', 'pdf', 'chat')),
  source_filename text DEFAULT '',
  question_count integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_quizzes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_quizzes_user_created
  ON liza_quizzes (user_id, created_at DESC);

CREATE POLICY "Users can read own quizzes"
  ON liza_quizzes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes"
  ON liza_quizzes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes"
  ON liza_quizzes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quizzes"
  ON liza_quizzes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS liza_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES liza_quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_quiz_questions_quiz_position
  ON liza_quiz_questions (quiz_id, position);

CREATE POLICY "Users can read own quiz questions"
  ON liza_quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_quizzes q
      WHERE q.id = liza_quiz_questions.quiz_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quiz questions"
  ON liza_quiz_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM liza_quizzes q
      WHERE q.id = liza_quiz_questions.quiz_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quiz questions"
  ON liza_quiz_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM liza_quizzes q
      WHERE q.id = liza_quiz_questions.quiz_id AND q.user_id = auth.uid()
    )
  );


CREATE TABLE IF NOT EXISTS liza_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES liza_quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE liza_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_liza_quiz_attempts_user_completed
  ON liza_quiz_attempts (user_id, completed_at DESC);

CREATE POLICY "Users can read own quiz attempts"
  ON liza_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON liza_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
