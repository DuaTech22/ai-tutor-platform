import OpenAI from "openai";

function getLevelInstruction(level) {
  if (level === "advanced") {
    return "The student has selected ADVANCED level. Assume strong prior CS knowledge. Use precise technical terminology, discuss time/space complexity where relevant, and don't over-simplify.";
  }
  return "The student has selected BEGINNER level. Explain in the simplest possible terms, avoid jargon where you can, and use everyday analogies.";
}

export async function askTutor(req, res) {
  try {
    const { question, language, level } = req.body;

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const languageInstruction =
      language === "ur"
        ? "Respond ONLY in Roman Urdu -- meaning Urdu language written using plain English/Latin alphabet letters only (e.g. 'data structure ek tareeqa hai jismein hum information ko organize karte hain'). Do NOT use Urdu script, Arabic script, Chinese characters, Vietnamese characters, or ANY non-Latin script. Use ONLY the 26 English letters (a-z, A-Z), spaces, and standard punctuation. Write naturally like people text in Roman Urdu on WhatsApp. Keep spelling simple and consistent."
        : "Respond in clear English.";

    const levelInstruction = getLevelInstruction(level);

    const systemPrompt = `You are Nova, a friendly AI tutor who specializes STRICTLY in Computer Science topics. Your allowed subjects include: Programming (any language), Data Structures, Algorithms, Operating Systems, Database Systems, Computer Networks, Software Engineering, Object-Oriented Programming, Artificial Intelligence, Web Development, Computer Architecture, and related Computer Science fundamentals.

If a student asks about anything OUTSIDE Computer Science (e.g. cooking, sports, general trivia, entertainment, personal advice, medicine, other academic subjects like biology or history), politely decline and redirect them, saying something like "I'm Nova, and I specialize in Computer Science topics! Feel free to ask me about programming, data structures, algorithms, or any other CS subject." Keep this redirect SHORT (1-2 sentences) and in the same language as requested.

${levelInstruction}

For valid Computer Science questions: Keep your answers SHORT -- 3 to 5 sentences maximum, but ALWAYS finish your last sentence completely, never cut off mid-word. Do not use markdown, bullet points, or code blocks since this will be spoken aloud.

${languageInstruction}`;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // ✅ FIXED: Changed to available model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong with the AI request." });
  }
}

export async function convertToRoman(req, res) {
  try {
    const { text } = req.body;

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // ✅ FIXED: Changed to available model
      messages: [
        {
          role: "system",
          content:
            "Convert the given Urdu-script text into Roman Urdu (same words, written using English/Latin letters only). Output ONLY the converted text, nothing else -- no explanation, no quotes.",
        },
        { role: "user", content: text },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const roman = completion.choices[0].message.content.trim();
    res.json({ roman });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversion failed." });
  }
}
