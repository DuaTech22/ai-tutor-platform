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
            "You are Nova, a friendly AI Computer Science tutor. Explain concepts step by step with simple examples, in a warm and encouraging tone.",
        },
        { role: "user", content: question },
      ],
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
