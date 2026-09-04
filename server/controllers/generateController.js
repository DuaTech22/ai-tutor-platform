import OpenAI from "openai";

const groq = () =>
  new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

// ✅ Keep this function - it's needed for quiz and course generation
function safeJSONParse(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    let fixed = "";
    let insideString = false;
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      if (char === '"' && cleaned[i - 1] !== "\\") {
        insideString = !insideString;
        fixed += char;
        continue;
      }
      if (insideString) {
        if (char === "\n") {
          fixed += "\\n";
          continue;
        }
        if (char === "\r") {
          fixed += "\\r";
          continue;
        }
        if (char === "\t") {
          fixed += "\\t";
          continue;
        }
      }
      fixed += char;
    }
    return JSON.parse(fixed);
  }
}

export async function generateNotes(req, res) {
  try {
    const { topic, level } = req.body;

    const levelNote =
      level === "advanced"
        ? "Write for an advanced undergraduate audience -- include time/space complexity discussion where relevant, and don't shy away from precise technical depth."
        : "Write for a beginner undergraduate audience -- keep terminology accessible and build up from fundamentals, while still being academically accurate.";

    const systemPrompt = `You are a university-level Computer Science instructor writing study notes. Write clear, well-organized notes on the given topic, appropriate for undergraduate CS students. ${levelNote}

RULES FOR FORMATTING:
- Use ## for headings (e.g., ## Introduction)
- Use ### for subheadings (e.g., ### Key Concepts)
- Use bullet points with - or * for lists
- Use **bold** ONLY for key terms
- Use ACTUAL line breaks between paragraphs (press Enter twice)
- DO NOT write \\n or \\n\\n as text
- Use code blocks with \`\`\` for code examples

Structure your response with:
- A brief definition/introduction
- Key concepts (as a bulleted list)
- One worked example (with code if relevant)
- A short summary

Keep it academically rigorous but clear.`;

    const completion = await groq().chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` },
      ],
      max_tokens: 900,
      temperature: 0.5,
    });

    const notes = completion.choices[0].message.content;
    res.json({ notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not generate notes." });
  }
}

export async function generateQuiz(req, res) {
  try {
    const { topic, notes, level } = req.body;

    const levelNote =
      level === "advanced"
        ? "Make the questions genuinely challenging -- test application and analysis, not just recall of definitions."
        : "Keep the questions at an introductory level -- test basic understanding of the core concept.";

    const completion = await groq().chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a university CS instructor creating a short quiz. Based on the given topic (and notes, if provided), generate exactly 4 multiple-choice questions to test understanding at an undergraduate level. ${levelNote}

Respond with ONLY valid JSON, no other text, no markdown code fences, in exactly this shape:
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": "..."
    }
  ]
}
The "correctAnswer" must exactly match one of the strings in "options". Do not include literal newline or tab characters inside any string value -- keep every string on a single line.`,
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\nNotes (for context, optional):\n${notes || "(none provided)"}`,
        },
      ],
      max_tokens: 700,
      temperature: 0.6,
    });

    const raw = completion.choices[0].message.content;
    const parsed = safeJSONParse(raw);
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not generate quiz. Please try again." });
  }
}

export async function generateCourse(req, res) {
  try {
    const { topic } = req.body;

    const systemPrompt = `You are a university-level Computer Science curriculum designer. Given a topic, design a short course with 4 to 6 lessons that build on each other logically. For each lesson, write full study notes in markdown (similar depth to a single-topic study note: intro, key concepts, one worked example, summary).

RULES FOR FORMATTING:
- Use ## for headings
- Use ### for subheadings
- Use bullet points with - or * for lists
- Use **bold** ONLY for key terms
- Use ACTUAL line breaks between paragraphs
- DO NOT write \\n or \\n\\n as text

Respond with ONLY valid JSON, no other text, no markdown code fences, in exactly this shape:
{
  "title": "...",
  "description": "... (1-2 sentence course description)",
  "category": "... (e.g. Data Structures, Operating Systems, etc.)",
  "lessons": [
    { "title": "...", "notes": "... (markdown formatted notes for this lesson with actual line breaks)" }
  ]
}`;

    const completion = await groq().chat.completions.create({
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Course topic: ${topic}` },
      ],
      max_tokens: 3000,
      temperature: 0.5,
    });

    const raw = completion.choices[0].message.content;
    const parsed = safeJSONParse(raw);

    const Course = (await import("../models/Course.js")).default;
    const course = await Course.create({
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      lessons: parsed.lessons.map((l) => ({
        title: l.title,
        notes: l.notes,
        videoUrl: "",
      })),
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not generate course. Please try again." });
  }
}
