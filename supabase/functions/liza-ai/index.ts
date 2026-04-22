import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRIMARY_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const FALLBACK_MODEL = "google/gemma-4-31b-it:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_SOURCE_CHARS = 30000;

type Role = "system" | "user" | "assistant";
type ChatMessage = { role: Role; content: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 400) {
  return json({ error: message }, status);
}

async function buildPersonaPrompt(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "name, bio, university, skills_offered, skills_wanted, sessions_completed, rating, total_reviews, current_streak",
    )
    .eq("id", userId)
    .maybeSingle();

  const name = profile?.name?.split(" ")[0] || "there";
  const offered = profile?.skills_offered?.join(", ") || "none listed yet";
  const wanted = profile?.skills_wanted?.join(", ") || "open to exploring";
  const sessions = profile?.sessions_completed ?? 0;
  const rating = profile?.rating ? Number(profile.rating).toFixed(1) : "not rated yet";
  const streak = profile?.current_streak ?? 0;

  return `You are LIZA (Learning Integrated Zonal Assistant), a friendly peer tutor inside the SkillBarter platform.

About the user you are talking to:
- Name: ${name}
- University: ${profile?.university || "unknown"}
- Skills they teach: ${offered}
- Skills they want to learn: ${wanted}
- Sessions completed: ${sessions} | Rating: ${rating} | Current streak: ${streak} days
- Bio: ${profile?.bio || "no bio"}

Personality:
- Warm, concise, encouraging, never robotic. Use ${name}'s name naturally.
- Tailor advice to what they teach and want to learn.
- Prefer short paragraphs, bullet lists, and concrete examples.
- If they ask about a skill they already teach, treat them as experienced.
- If they ask about a skill they want to learn, scaffold gently from fundamentals.
- Never mention which AI model powers you. You are simply LIZA.`;
}

async function callOpenRouter(
  apiKey: string,
  messages: ChatMessage[],
  opts: { stream?: boolean; temperature?: number; responseFormat?: "json" } = {},
): Promise<Response> {
  const body: Record<string, unknown> = {
    model: PRIMARY_MODEL,
    messages,
    stream: opts.stream ?? false,
    temperature: opts.temperature ?? 0.7,
    models: [PRIMARY_MODEL, FALLBACK_MODEL],
    route: "fallback",
  };
  if (opts.responseFormat === "json") {
    body.response_format = { type: "json_object" };
  }

  return await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://skillbarter.app",
      "X-Title": "SkillBarter LIZA",
    },
    body: JSON.stringify(body),
  });
}

async function completeText(
  apiKey: string,
  messages: ChatMessage[],
  opts: { temperature?: number; responseFormat?: "json" } = {},
): Promise<string> {
  const resp = await callOpenRouter(apiKey, messages, { ...opts, stream: false });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OpenRouter error ${resp.status}: ${t.slice(0, 300)}`);
  }
  const data = await resp.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

function tryParseJson<T>(raw: string): T | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/[\[{][\s\S]*[\]}]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

function truncateSource(text: string): string {
  if (!text) return "";
  if (text.length <= MAX_SOURCE_CHARS) return text;
  return text.slice(0, MAX_SOURCE_CHARS);
}

async function handleChat(
  req: Request,
  supabase: ReturnType<typeof createClient>,
  userId: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const message = String(body.message || "").trim();
  if (!message) return errorResponse("Message is required");
  let conversationId = body.conversation_id ? String(body.conversation_id) : null;

  if (!conversationId) {
    const { data: newConv, error: convErr } = await supabase
      .from("liza_conversations")
      .insert({ user_id: userId, title: "New chat" })
      .select("id")
      .maybeSingle();
    if (convErr || !newConv) {
      return errorResponse("Failed to start conversation", 500);
    }
    conversationId = newConv.id;
  } else {
    const { data: check } = await supabase
      .from("liza_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!check) return errorResponse("Conversation not found", 404);
  }

  const { data: historyRows } = await supabase
    .from("liza_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);

  const history: ChatMessage[] = (historyRows || [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as Role, content: m.content }));

  await supabase
    .from("liza_messages")
    .insert({ conversation_id: conversationId, role: "user", content: message });

  const persona = await buildPersonaPrompt(supabase, userId);
  const messages: ChatMessage[] = [
    { role: "system", content: persona },
    ...history.slice(-10),
    { role: "user", content: message },
  ];

  const upstream = await callOpenRouter(apiKey, messages, { stream: true });
  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text();
    return errorResponse(`Model error: ${t.slice(0, 200)}`, 502);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let assistantText = "";

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          `event: meta\ndata: ${JSON.stringify({ conversation_id: conversationId })}\n\n`,
        ),
      );

      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (delta) {
                assistantText += delta;
                controller.enqueue(
                  encoder.encode(`event: token\ndata: ${JSON.stringify({ t: delta })}\n\n`),
                );
              }
            } catch {
              // ignore SSE comments / partials
            }
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`,
          ),
        );
      }

      if (assistantText.trim()) {
        await supabase.from("liza_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantText,
        });
        await supabase
          .from("liza_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);

        if (history.length === 0) {
          try {
            const title = await completeText(apiKey, [
              {
                role: "system",
                content:
                  "Generate a short 3-6 word title for this chat based on the user's first message. Return only the title, no quotes, no punctuation at the end.",
              },
              { role: "user", content: message.slice(0, 500) },
            ], { temperature: 0.3 });
            const cleanTitle = title.replace(/^["']|["']$/g, "").slice(0, 80).trim();
            if (cleanTitle) {
              await supabase
                .from("liza_conversations")
                .update({ title: cleanTitle })
                .eq("id", conversationId);
              controller.enqueue(
                encoder.encode(
                  `event: title\ndata: ${JSON.stringify({ title: cleanTitle })}\n\n`,
                ),
              );
            }
          } catch {
            // title generation best-effort
          }
        }
      }

      controller.enqueue(encoder.encode("event: done\ndata: {}\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

async function handleGenerateFlashcards(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const source = truncateSource(String(body.source || "").trim());
  if (!source) return errorResponse("Source text is required");
  const rawCount = Number(body.count || 10);
  const count = Math.max(3, Math.min(20, Math.floor(rawCount)));
  const sourceType = ["prompt", "pdf", "chat"].includes(String(body.source_type))
    ? String(body.source_type)
    : "prompt";
  const sourceFilename = String(body.source_filename || "").slice(0, 200);
  const conversationId = body.conversation_id ? String(body.conversation_id) : null;

  const persona = await buildPersonaPrompt(supabase, userId);
  const userPrompt = `Create ${count} high-quality study flashcards from the source below.

Respond with a single JSON object:
{
  "title": "short deck title (max 8 words)",
  "cards": [
    { "front": "clear question or term", "back": "concise, accurate answer (1-3 sentences)" }
  ]
}

Rules:
- Exactly ${count} cards.
- Cover distinct key concepts, not duplicates.
- Keep front under 120 chars, back under 300 chars.
- No markdown, no emoji, no extra commentary.

SOURCE:
"""
${source}
"""`;

  const raw = await completeText(
    apiKey,
    [
      { role: "system", content: persona },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.4, responseFormat: "json" },
  );

  const parsed = tryParseJson<{ title?: string; cards: { front: string; back: string }[] }>(raw);
  if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    return errorResponse("Could not generate flashcards. Try again.", 502);
  }

  const title = (parsed.title || "Flashcards").slice(0, 80);
  const { data: set, error: setErr } = await supabase
    .from("liza_flashcard_sets")
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      title,
      source_type: sourceType,
      source_filename: sourceFilename,
    })
    .select("*")
    .maybeSingle();

  if (setErr || !set) return errorResponse("Failed to save flashcards", 500);

  const rows = parsed.cards.slice(0, count).map((c, i) => ({
    set_id: set.id,
    front: String(c.front || "").slice(0, 500),
    back: String(c.back || "").slice(0, 1000),
    position: i,
  }));

  const { error: cardsErr } = await supabase.from("liza_flashcards").insert(rows);
  if (cardsErr) return errorResponse("Failed to save flashcards", 500);

  return json({ set, cards: rows });
}

async function handleGenerateQuiz(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  const source = truncateSource(String(body.source || "").trim());
  if (!source) return errorResponse("Source text is required");
  const rawCount = Number(body.count || 5);
  const count = Math.max(3, Math.min(30, Math.floor(rawCount)));
  const sourceType = ["prompt", "pdf", "chat"].includes(String(body.source_type))
    ? String(body.source_type)
    : "prompt";
  const sourceFilename = String(body.source_filename || "").slice(0, 200);
  const conversationId = body.conversation_id ? String(body.conversation_id) : null;

  const persona = await buildPersonaPrompt(supabase, userId);
  const userPrompt = `Create ${count} multiple-choice questions (MCQs) from the source below.

Respond with a single JSON object:
{
  "title": "short quiz title (max 8 words)",
  "questions": [
    {
      "question": "clear question",
      "options": ["option A", "option B", "option C", "option D"],
      "correct_index": 0,
      "explanation": "why this option is correct (1-2 sentences)"
    }
  ]
}

Rules:
- Exactly ${count} questions.
- Each question must have exactly 4 plausible options.
- correct_index is 0..3.
- No duplicate questions, cover different aspects.
- No markdown, no emoji, no commentary outside the JSON.

SOURCE:
"""
${source}
"""`;

  const raw = await completeText(
    apiKey,
    [
      { role: "system", content: persona },
      { role: "user", content: userPrompt },
    ],
    { temperature: 0.4, responseFormat: "json" },
  );

  type ParsedQuiz = {
    title?: string;
    questions: {
      question: string;
      options: string[];
      correct_index: number;
      explanation?: string;
    }[];
  };
  const parsed = tryParseJson<ParsedQuiz>(raw);
  if (
    !parsed ||
    !Array.isArray(parsed.questions) ||
    parsed.questions.length === 0
  ) {
    return errorResponse("Could not generate quiz. Try again.", 502);
  }

  const valid = parsed.questions
    .filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        Number.isInteger(q.correct_index) &&
        q.correct_index >= 0 &&
        q.correct_index <= 3,
    )
    .slice(0, count);

  if (valid.length === 0) {
    return errorResponse("Quiz generation returned invalid data. Try again.", 502);
  }

  const title = (parsed.title || "Quiz").slice(0, 80);
  const { data: quiz, error: quizErr } = await supabase
    .from("liza_quizzes")
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      title,
      source_type: sourceType,
      source_filename: sourceFilename,
      question_count: valid.length,
    })
    .select("*")
    .maybeSingle();

  if (quizErr || !quiz) return errorResponse("Failed to save quiz", 500);

  const rows = valid.map((q, i) => ({
    quiz_id: quiz.id,
    question: String(q.question).slice(0, 1000),
    options: q.options.map((o) => String(o).slice(0, 400)),
    correct_index: q.correct_index,
    explanation: String(q.explanation || "").slice(0, 800),
    position: i,
  }));

  const { error: qErr } = await supabase.from("liza_quiz_questions").insert(rows);
  if (qErr) return errorResponse("Failed to save quiz questions", 500);

  return json({ quiz, questions: rows });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return errorResponse("OPENROUTER_API_KEY is not configured on the server", 500);
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return errorResponse("Unauthorized", 401);
    }
    const userId = userData.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const action = String(body.action || "").trim();

    if (action === "chat") return await handleChat(req, supabase, userId, apiKey, body);
    if (action === "generate_flashcards") {
      return await handleGenerateFlashcards(supabase, userId, apiKey, body);
    }
    if (action === "generate_quiz") {
      return await handleGenerateQuiz(supabase, userId, apiKey, body);
    }

    return errorResponse(`Unknown action: ${action}`, 400);
  } catch (err) {
    return errorResponse(`Server error: ${String(err)}`, 500);
  }
});
