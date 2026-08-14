import { EdgeTTS } from "@andresaya/edge-tts";

export async function textToSpeech(req, res) {
  try {
    const { text, language } = req.body;

    const voice = language === "ur" ? "en-IN-PrabhatNeural" : "en-US-GuyNeural";

    const tts = new EdgeTTS();
    await tts.synthesize(text, voice, {
      rate: "-5%",
      pitch: "0Hz",
      volume: "0%",
    });

    const audioBuffer = await tts.toBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: "Text-to-speech failed." });
  }
}
