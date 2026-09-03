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

    const systemPrompt = `You are a Computer Science instructor creating a diagram using Mermaid.js syntax. Given a topic, produce a SIMPLE flowchart that visually explains it.

STRICT RULES for valid Mermaid syntax:
1. Always start with exactly: flowchart TD
2. Use short node IDs like A, B, C, D (single letters or short words, no spaces).
3. Node labels go in square brackets: A[Start Process]
4. For decision/condition nodes, use curly braces: B{Is it valid?}
5. NEVER use parentheses (), colons :, quotes, or special characters inside node labels -- only letters, numbers, and spaces.
6. Arrows use --> and optional labels like: A -->|Yes| B
7. Keep it to 5-8 nodes maximum.
8. Output ONLY the raw Mermaid code, nothing else -- no markdown fences, no explanation, no text before or after.

Example of correct output:
flowchart TD
A[Start] --> B{Is array sorted}
B -->|Yes| C[Binary Search]
B -->|No| D[Sort array first]
D --> C
C --> E[Return result]`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    let diagram = completion.choices[0].message.content.trim();
    diagram = diagram
      .replace(/^```mermaid\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "");

    // Basic sanity check -- if it doesn't start with a known diagram type, reject early
    const validStarts = ["flowchart", "graph", "sequenceDiagram"];
    const startsValid = validStarts.some((v) => diagram.trim().startsWith(v));

    if (!startsValid) {
      return res
        .status(500)
        .json({
          error: "Could not generate a valid diagram. Please try again.",
        });
    }

    res.json({ diagram });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Could not generate diagram. Please try again." });
  }
}
