import OpenAI from "openai";

export async function askTutor(req, res) {
  try {
    const { question } = req.body;

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are Nova, a friendly AI Computer Science tutor speaking out loud to a student. Keep your answers SHORT — 2 to 4 sentences maximum. Explain the core idea simply and clearly, in a warm and encouraging tone. Do not use markdown, bullet points, or code blocks since this will be spoken aloud.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 150,
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
