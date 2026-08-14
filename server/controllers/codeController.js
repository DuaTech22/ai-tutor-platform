import OpenAI from "openai";

const groq = () =>
  new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

export async function explainCode(req, res) {
  try {
    const { code, language } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Please provide some code." });
    }

    const completion = await groq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a university-level Computer Science coding tutor. Given a piece of code, explain what it does line by line, point out any bugs or inefficiencies, and suggest improvements. Use markdown formatting (headings, bullet points, code blocks). Keep it clear and educational, appropriate for a CS undergraduate.",
        },
        {
          role: "user",
          content: `Language: ${language || "unspecified"}\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      max_tokens: 900,
      temperature: 0.4,
    });

    const explanation = completion.choices[0].message.content;
    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not explain the code. Please try again." });
  }
}

export async function debugCode(req, res) {
  try {
    const { code, language, errorMessage } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Please provide some code." });
    }

    const completion = await groq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a university-level Computer Science debugging tutor. Given code (and optionally an error message), identify the bug(s), explain WHY it happens, and provide the corrected code in a markdown code block. Be concise but thorough.",
        },
        {
          role: "user",
          content: `Language: ${language || "unspecified"}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nError message (if any): ${errorMessage || "(none provided, please review for bugs generally)"}`,
        },
      ],
      max_tokens: 900,
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not debug the code. Please try again." });
  }
}
