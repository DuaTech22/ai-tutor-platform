import OpenAI from "openai";

export async function generateDiagram(req, res) {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a topic." });
    }

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a Computer Science instructor creating a diagram using Mermaid.js syntax. Given a topic, produce a Mermaid diagram (flowchart, sequence diagram, or graph -- whichever best represents the concept) that visually explains it.

Respond with ONLY the raw Mermaid syntax, nothing else. Do NOT wrap it in markdown code fences, do NOT add any explanation before or after. Start directly with the diagram type keyword (e.g. "graph TD", "flowchart LR", "sequenceDiagram").

Keep it reasonably simple: 5-10 nodes/steps maximum, so it renders cleanly.`,
        },
        { role: "user", content: `Topic: ${topic}` },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    let diagram = completion.choices[0].message.content.trim();
    diagram = diagram
      .replace(/^```mermaid\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "");

    res.json({ diagram });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not generate diagram. Please try again." });
  }
}
