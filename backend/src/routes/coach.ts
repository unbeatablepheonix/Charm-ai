import { Hono } from "hono";
import { coachRequestSchema, coachResponseSchema, type CoachMode } from "../types";

const coachRouter = new Hono();

const MODE_BRIEF: Record<CoachMode, { headline: string; instructions: string }> = {
  opener: {
    headline: "Openers",
    instructions: `The user is going to start a conversation with a woman. Read the situation they describe and craft three opening lines they could actually say. Anchor each one in something specific from the context — a detail, the setting, what she's doing. No pickup lines, no negging, no "hey beautiful". Treat her like a whole person. Mix tones across the three: one warm/sincere, one playful or curious, one confident and brief.`,
  },
  reply: {
    headline: "Replies",
    instructions: `The user just received a message or said something from a woman they're talking to. Read what she said and write three possible replies. Vary register: one that flirts forward, one that's thoughtful and curious about her, one that's playful or funny. Keep them short, human, and texting-real — not paragraphs. Match her energy, don't try too hard.`,
  },
  profile: {
    headline: "Profile Read",
    instructions: `The user pasted a woman's dating-app profile or bio. Pull out the two or three most specific, interesting hooks (not generic stuff like "loves traveling"). Then craft three openers that reference those specifics in a way that shows you actually read it. Show her you noticed who she is.`,
  },
  advice: {
    headline: "Coaching",
    instructions: `The user is asking for advice about talking to women, dating, confidence, conversation, or a specific situation they're in. Give honest, kind, grounded advice — like a thoughtful friend. No manipulation tactics, no scripts, no "alpha" nonsense. Focus on genuine connection, curiosity, and self-respect. If they're spiraling about something, help them zoom out.`,
  },
};

function buildSystemPrompt(mode: CoachMode, tone?: string, imageCount?: number) {
  const brief = MODE_BRIEF[mode];
  const imageNote = imageCount && imageCount > 0
    ? imageCount === 1
      ? `The user has shared a photo. Look at it carefully — notice details about her appearance, style, setting, and vibe. Use what you observe to make your suggestions more specific and personalized.`
      : `The user has shared ${imageCount} photos. Look at each one carefully — notice details about her appearance, style, setting, and vibe across all images. Use what you observe to make your suggestions more specific and personalized.`
    : "";
  return `You are Charm — a warm, sharp conversation coach helping someone connect with a woman they're interested in. Your voice is grounded and human, not bro-y, not corporate, not therapy-speak. You write like a perceptive friend who's good with people.

Your principles, always:
- Respect her as a full person with her own life, not a target.
- Specific beats clever. Reference real details from the situation.
- Short beats long. People text in fragments, not essays.
- Curiosity beats performance. Good conversations ask, they don't impress.
- Never suggest manipulation, dishonesty, persistence after a "no", or anything coercive.

Mode: ${brief.headline}
${brief.instructions}
${tone ? `Lean toward a ${tone} tone where it fits.` : ""}
${imageNote}

Return ONLY valid JSON matching this exact shape (no markdown, no prose around it):
{
  "headline": "short title for the response, 2-5 words",
  "read": "one or two sentences naming what you noticed about the situation — the read",
  "suggestions": [
    { "label": "short tag like 'Warm', 'Playful', 'Direct'", "text": "the actual line/message/reply, written as they'd say it", "why": "one sentence on why this works for this situation" }
  ],
  "tips": ["one short tip", "another short tip", "a third"]
}

Give exactly 3 suggestions and 2-3 tips. Tips are tactical, not preachy.`;
}

coachRouter.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parseResult = coachRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      { error: { message: "Invalid request body", code: "bad_request" } },
      400
    );
  }
  const { mode, context, tone, imageUrls } = parseResult.data;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return c.json({ error: { message: "OPENAI_API_KEY is not configured", code: "missing_key" } }, 500);
  }

  const hasImages = imageUrls && imageUrls.length > 0;
  const systemPrompt = buildSystemPrompt(mode, tone, imageUrls?.length);

  type UserContent =
    | string
    | Array<
        | { type: "input_image"; image_url: string }
        | { type: "input_text"; text: string }
      >;

  const userContent: UserContent = hasImages
    ? [
        ...imageUrls!.map((url) => ({ type: "input_image" as const, image_url: url })),
        { type: "input_text", text: context },
      ]
    : context;

  const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      text: { format: { type: "json_object" } },
    }),
  });

  if (!openaiResponse.ok) {
    const errText = await openaiResponse.text();
    console.error("OpenAI error:", openaiResponse.status, errText);
    return c.json(
      { error: { message: "Failed to reach the model", code: "openai_error" } },
      502
    );
  }

  const raw = (await openaiResponse.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };
  const text: string = raw.output_text ?? raw.output?.[0]?.content?.[0]?.text ?? "";

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    console.error("JSON parse failed. Raw text:", text);
    return c.json(
      { error: { message: "Model returned malformed JSON", code: "parse_error" } },
      502
    );
  }

  const result = coachResponseSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Schema validation failed:", result.error.flatten());
    return c.json(
      { error: { message: "Model response did not match schema", code: "schema_error" } },
      502
    );
  }

  return c.json({ data: result.data });
});

export { coachRouter };
