import OpenAI from "openai";
import { encode } from "plantuml-encoder";
import axios from "axios";

// Generate PlantUML code using AI
async function generatePlantUMLCode(topic, diagramType = "flowchart") {
  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const systemPrompt = `You are a Computer Science instructor creating a diagram using PlantUML syntax.

IMPORTANT RULES:
1. Output ONLY valid PlantUML code, no explanations
2. Start with @startuml and end with @enduml
3. For ${diagramType}, use the correct syntax

Available diagram types:
- flowchart: Use start/stop/if/else/while
- sequence: Use participant, ->, activate/deactivate
- class: Use class, extends, implements
- component: Use [Component] boxes
- activity: Use start, if, else, endif, end

Example for flowchart:
@startuml
start
:Check if array is sorted;
if (Is sorted?) then (Yes)
  :Perform binary search;
else (No)
  :Sort array first;
endif
:Return result;
stop
@enduml

Example for sequence diagram:
@startuml
participant Client
participant Server
participant Database

Client -> Server: Request data
activate Server
Server -> Database: Query
activate Database
Database --> Server: Results
deactivate Database
Server --> Client: Response
deactivate Server
@enduml

Generate a clean, well-structured ${diagramType} diagram for this topic.`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Topic: ${topic}` },
    ],
    max_tokens: 800,
    temperature: 0.3,
  });

  let code = completion.choices[0].message.content.trim();

  // Clean up any markdown fences
  code = code
    .replace(/^```plantuml\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  code = code.trim();

  // Ensure it has @startuml and @enduml
  if (!code.startsWith("@startuml")) {
    code = "@startuml\n" + code;
  }
  if (!code.endsWith("@enduml")) {
    code = code + "\n@enduml";
  }

  return code;
}

// PlantUML Server API - Public Server (Easiest)
export async function generateDiagramWithPlantUML(req, res) {
  try {
    const { topic, diagramType = "flowchart" } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a topic." });
    }

    // Step 1: Generate PlantUML code using AI
    const plantUMLCode = await generatePlantUMLCode(topic, diagramType);
    console.log(
      "📝 PlantUML Code generated:",
      plantUMLCode.substring(0, 200) + "...",
    );

    // Step 2: Encode the code for PlantUML server
    const encoded = encode(plantUMLCode);

    // Step 3: Generate image URL using public PlantUML server
    const imageUrl = `https://www.plantuml.com/plantuml/png/${encoded}`;
    const svgUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;

    res.json({
      diagram: plantUMLCode,
      imageUrl,
      svgUrl,
      format: "plantuml",
    });
  } catch (error) {
    console.error("❌ PlantUML error:", error);
    res
      .status(500)
      .json({ error: "Could not generate diagram. Please try again." });
  }
}

// Using Kroki API (Supports multiple formats)
export async function generateDiagramWithKroki(req, res) {
  try {
    const { topic, diagramType = "flowchart" } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a topic." });
    }

    const plantUMLCode = await generatePlantUMLCode(topic, diagramType);
    console.log(
      "📝 PlantUML Code generated:",
      plantUMLCode.substring(0, 200) + "...",
    );

    const response = await axios.post(
      "https://kroki.io/plantuml/svg",
      plantUMLCode,
      {
        headers: { "Content-Type": "text/plain" },
        responseType: "text",
      },
    );

    res.json({
      diagram: plantUMLCode,
      svg: response.data,
      format: "plantuml",
    });
  } catch (error) {
    console.error("❌ Kroki error:", error);
    res
      .status(500)
      .json({ error: "Could not generate diagram. Please try again." });
  }
}

// Self-Hosted PlantUML Server
export async function generateDiagramSelfHosted(req, res) {
  try {
    const { topic, diagramType = "flowchart" } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a topic." });
    }

    const plantUMLCode = await generatePlantUMLCode(topic, diagramType);
    const encoded = encode(plantUMLCode);

    const baseUrl = process.env.PLANTUML_SERVER_URL || "http://localhost:8005";
    const imageUrl = `${baseUrl}/plantuml/png/${encoded}`;

    res.json({
      diagram: plantUMLCode,
      imageUrl,
      format: "plantuml",
    });
  } catch (error) {
    console.error("❌ Self-hosted error:", error);
    res
      .status(500)
      .json({ error: "Could not generate diagram. Please try again." });
  }
}
