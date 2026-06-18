const WORD_LIST = [
  { word: "Wednesday", ipa: "/ˈwɛnzdeɪ/", phonemes: ["w", "ɛ", "n", "z", "d", "eɪ"] },
  { word: "Entrepreneur", ipa: "/ˌɒntrəprəˈnɜː/", phonemes: ["ɒ", "n", "t", "r", "ə", "p", "r", "ə", "ˈnɜː"] },
  { word: "Herb", ipa: "/hɜːb/", phonemes: ["h", "ɜː", "b"] },
  { word: "Squirrel", ipa: "/ˈskwɪrəl/", phonemes: ["s", "k", "w", "ɪ", "r", "əl"] },
  { word: "Tomato", ipa: "/təˈmɑːtəʊ/", phonemes: ["t", "ə", "ˈmɑː", "t", "əʊ"] },
  { word: "Schedule", ipa: "/ˈʃɛdjuːl/", phonemes: ["ʃ", "ɛ", "d", "j", "uː", "l"] },
  { word: "Aluminium", ipa: "/ˌæljʊˈmɪniəm/", phonemes: ["æ", "l", "j", "ʊ", "ˈm", "ɪ", "n", "i", "əm"] },
  { word: "Leisure", ipa: "/ˈlɛʒə/", phonemes: ["l", "ɛ", "ʒ", "ə"] },
  { word: "Vitamin", ipa: "/ˈvɪtəmɪn/", phonemes: ["v", "ɪ", "t", "ə", "m", "ɪ", "n"] },
  { word: "Mobile", ipa: "/ˈməʊbaɪl/", phonemes: ["m", "əʊ", "b", "aɪ", "l"] },
  { word: "Privacy", ipa: "/ˈprɪvəsi/", phonemes: ["p", "r", "ɪ", "v", "ə", "s", "i"] },
  { word: "Glacier", ipa: "/ˈɡlæsiə/", phonemes: ["ɡ", "l", "æ", "s", "i", "ə"] },
  { word: "Queue", ipa: "/kjuː/", phonemes: ["k", "j", "uː"] },
  { word: "Receipt", ipa: "/rɪˈsiːt/", phonemes: ["r", "ɪ", "s", "iː", "t"] },
  { word: "Colonel", ipa: "/ˈkɜːnəl/", phonemes: ["k", "ɜː", "n", "əl"] },
  { word: "Worcestershire", ipa: "/ˈwʊstəʃə/", phonemes: ["w", "ʊ", "s", "t", "ə", "ʃ", "ə"] },
  { word: "Leicester", ipa: "/ˈlɛstə/", phonemes: ["l", "ɛ", "s", "t", "ə"] },
  { word: "Edinburgh", ipa: "/ˈɛdɪnbrə/", phonemes: ["ɛ", "d", "ɪ", "n", "b", "r", "ə"] },
  { word: "Thames", ipa: "/tɛmz/", phonemes: ["t", "ɛ", "m", "z"] },
  { word: "Thoroughly", ipa: "/ˈθʌrəli/", phonemes: ["θ", "ʌ", "r", "ə", "l", "i"] },
  { word: "Psychology", ipa: "/saɪˈkɒlədʒi/", phonemes: ["s", "aɪ", "k", "ɒ", "l", "ə", "dʒ", "i"] },
  { word: "Pneumonia", ipa: "/njuːˈməʊniə/", phonemes: ["n", "j", "uː", "m", "əʊ", "n", "i", "ə"] },
  { word: "Rhythm", ipa: "/ˈrɪðəm/", phonemes: ["r", "ɪ", "ð", "əm"] },
  { word: "Subtle", ipa: "/ˈsʌtl/", phonemes: ["s", "ʌ", "t", "l"] },
  { word: "Debris", ipa: "/ˈdɛbriː/", phonemes: ["d", "ɛ", "b", "r", "iː"] },
  { word: "Fillet", ipa: "/ˈfɪlɪt/", phonemes: ["f", "ɪ", "l", "ɪ", "t"] },
  { word: "Buffet", ipa: "/ˈbʊfeɪ/", phonemes: ["b", "ʊ", "f", "eɪ"] },
  { word: "Valet", ipa: "/ˈvæleɪ/", phonemes: ["v", "æ", "l", "eɪ"] },
  { word: "Garage", ipa: "/ˈɡærɑːʒ/", phonemes: ["ɡ", "æ", "r", "ɑː", "ʒ"] },
  { word: "Ballet", ipa: "/ˈbæleɪ/", phonemes: ["b", "æ", "l", "eɪ"] },
  { word: "Bureaucracy", ipa: "/bjʊəˈrɒkrəsi/", phonemes: ["b", "j", "ʊ", "ə", "r", "ɒ", "k", "r", "ə", "s", "i"] },
  { word: "Choir", ipa: "/ˈkwaɪə/", phonemes: ["k", "w", "aɪ", "ə"] },
  { word: "Conscience", ipa: "/ˈkɒnʃəns/", phonemes: ["k", "ɒ", "n", "ʃ", "əns"] },
  { word: "Curiosity", ipa: "/ˌkjʊəriˈɒsɪti/", phonemes: ["k", "j", "ʊ", "ə", "r", "i", "ˈɒ", "s", "ɪ", "t", "i"] },
  { word: "Deliberately", ipa: "/dɪˈlɪbərətli/", phonemes: ["d", "ɪ", "l", "ɪ", "b", "ə", "r", "ə", "t", "l", "i"] },
  { word: "Enthusiasm", ipa: "/ɪnˈθjuːziæzəm/", phonemes: ["ɪ", "n", "θ", "j", "uː", "z", "i", "æ", "z", "əm"] },
  { word: "February", ipa: "/ˈfɛbruəri/", phonemes: ["f", "ɛ", "b", "r", "u", "ə", "r", "i"] },
  { word: "Hierarchy", ipa: "/ˈhaɪərɑːki/", phonemes: ["h", "aɪ", "ə", "r", "ɑː", "k", "i"] },
  { word: "Particularly", ipa: "/pəˈtɪkjʊləli/", phonemes: ["p", "ə", "t", "ɪ", "k", "j", "ʊ", "l", "ə", "l", "i"] },
  { word: "Necessary", ipa: "/ˈnɛsəsəri/", phonemes: ["n", "ɛ", "s", "ə", "s", "ə", "r", "i"] },
  { word: "Occasionally", ipa: "/əˈkeɪʒənəli/", phonemes: ["ə", "k", "eɪ", "ʒ", "ə", "n", "ə", "l", "i"] },
  { word: "Pronunciation", ipa: "/prəˌnʌnsiˈeɪʃən/", phonemes: ["p", "r", "ə", "n", "ʌ", "n", "s", "i", "eɪ", "ʃ", "ən"] },
  { word: "Questionnaire", ipa: "/ˌkwɛstʃəˈnɛə/", phonemes: ["k", "w", "ɛ", "s", "tʃ", "ə", "n", "ɛ", "ə"] },
  { word: "Recognise", ipa: "/ˈrɛkəɡnaɪz/", phonemes: ["r", "ɛ", "k", "ə", "ɡ", "n", "aɪ", "z"] },
  { word: "Statistics", ipa: "/stəˈtɪstɪks/", phonemes: ["s", "t", "ə", "t", "ɪ", "s", "t", "ɪ", "k", "s"] },
  { word: "Temperature", ipa: "/ˈtɛmprɪtʃə/", phonemes: ["t", "ɛ", "m", "p", "r", "ɪ", "tʃ", "ə"] },
  { word: "Uncomfortable", ipa: "/ʌnˈkʌmftəbl/", phonemes: ["ʌ", "n", "k", "ʌ", "m", "f", "t", "ə", "b", "l"] },
  { word: "Vulnerability", ipa: "/ˌvʌlnərəˈbɪlɪti/", phonemes: ["v", "ʌ", "l", "n", "ə", "r", "ə", "b", "ɪ", "l", "ɪ", "t", "i"] },
  { word: "Anaesthesia", ipa: "/ˌænɪsˈθiːziə/", phonemes: ["æ", "n", "ɪ", "s", "θ", "iː", "z", "i", "ə"] },
  { word: "Deteriorate", ipa: "/dɪˈtɪəriəreɪt/", phonemes: ["d", "ɪ", "t", "ɪ", "ə", "r", "i", "ə", "r", "eɪ", "t"] },
  { word: "Exacerbate", ipa: "/ɪɡˈzæsəbeɪt/", phonemes: ["ɪ", "ɡ", "z", "æ", "s", "ə", "b", "eɪ", "t"] },
  { word: "Hyperbole", ipa: "/haɪˈpɜːbəli/", phonemes: ["h", "aɪ", "p", "ɜː", "b", "ə", "l", "i"] },
  { word: "Indefatigable", ipa: "/ˌɪndɪˈfætɪɡəbl/", phonemes: ["ɪ", "n", "d", "ɪ", "f", "æ", "t", "ɪ", "ɡ", "ə", "b", "l"] },
  { word: "Juxtaposition", ipa: "/ˌdʒʌkstəpəˈzɪʃən/", phonemes: ["dʒ", "ʌ", "k", "s", "t", "ə", "p", "ə", "z", "ɪ", "ʃ", "ən"] },
];

export const handleStartLesson = (req: any, res: any) => {
  try {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const sessionWords = shuffled.slice(0, 5);
    return res.status(200).json({ words: sessionWords });
  } catch (error) {
    return res.status(500).json({ error: "Failed to start lesson" });
  }
};

export const handleAnalyzePronunciation = async (req: any, res: any) => {
  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart/form-data" });
    }

    const targetWord = req.query.targetWord as string;
    if (!targetWord) {
      return res.status(400).json({ error: "Missing targetWord" });
    }

    const { audioBuffer } = await parseFormData(req);

    if (!audioBuffer) {
      return res.status(400).json({ error: "Missing audio" });
    }

    const isSilent = audioBuffer.length < 100;
    const targetLower = String(targetWord).toLowerCase().trim();
    const wordData = WORD_LIST.find((w) => w.word.toLowerCase() === targetLower);
    const phonemeList = wordData ? wordData.phonemes : [];

    if (isSilent) {
      const phonemes = phonemeList.map((sound) => ({ sound, correct: false }));
      return res.status(200).json({
        accuracy: 0,
        phonemes,
        explanation: "No speech was detected in your recording. Please check your microphone and try speaking the word clearly.",
        isSilent: true,
        wordData: wordData || null,
      });
    }

    let transcribedText = "";
    try {
      const whisperFormData = new FormData();
      const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });
      whisperFormData.append("file", audioBlob, "recording.webm");
      whisperFormData.append("model", "whisper-1");
      whisperFormData.append("language", "en");

      const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: whisperFormData,
      });

      const whisperData = await whisperRes.json();
      transcribedText = whisperData?.text?.trim() || "";
    } catch (whisperError) {
      console.error("Whisper transcription failed:", whisperError);
      return res.status(500).json({ error: "Could not transcribe audio. Please try recording again." });
    }

    if (!transcribedText) {
      const phonemes = phonemeList.map((sound) => ({ sound, correct: false }));
      return res.status(200).json({
        accuracy: 0,
        phonemes,
        explanation: "No speech was detected in your recording. Please speak more clearly and try again.",
        isSilent: true,
        wordData: wordData || null,
      });
    }

    const targetIPA = wordData ? wordData.ipa : "";
    const targetPhonemes = phonemeList.join(", ");

    let phonemes: { sound: string; correct: boolean }[] = [];
    let accuracy = 0;
    let explanation = "";

    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content: `You are a British English pronunciation expert. Your job is to:
1. Convert the user's transcribed speech into its most likely IPA phoneme sequence (British English)
2. Compare it against the target word's IPA phonemes one by one
3. Return a JSON object — nothing else, no markdown, no explanation outside the JSON

The JSON must have exactly this shape:
{
  "phonemes": [
    { "sound": "<IPA symbol from target list>", "correct": true or false },
    ...
  ],
  "explanation": "<2-3 sentence friendly coaching tip in British English, no percentages>"
}

Rules:
- Always return exactly the same number of phonemes as in the target list, in the same order
- Use the exact IPA symbols from the target list — do not invent new ones
- Mark a phoneme correct if the user produced a close enough sound (allow for accent variations)
- Mark it incorrect if the user clearly missed or substituted it with a very different sound
- The explanation should focus on which sounds to improve and how`,
            },
            {
              role: "user",
              content: `Target word: "${targetWord}"
Target IPA: ${targetIPA}
Target phonemes in order: [${targetPhonemes}]
Whisper heard the user say: "${transcribedText}"

Compare the user's pronunciation against each target phoneme and return the JSON.`,
            },
          ],
        }),
      });

      const openaiData = await openaiRes.json();
      const rawContent = openaiData?.choices?.[0]?.message?.content?.trim() || "";
      const cleaned = rawContent.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      phonemes = parsed.phonemes || [];
      explanation = parsed.explanation || "";

      if (phonemes.length > 0) {
        const correctCount = phonemes.filter((p: any) => p.correct === true).length;
        accuracy = Math.round((correctCount / phonemes.length) * 100);
      }
    } catch (aiError) {
      console.error("GPT-4o-mini call failed:", aiError);
      phonemes = phonemeList.map((sound) => ({ sound, correct: false }));
      accuracy = 0;
      explanation = `We had trouble analysing your pronunciation of "${targetWord}". Please try again.`;
    }

    if (phonemes.length === 0 && phonemeList.length > 0) {
      phonemes = phonemeList.map((sound) => ({ sound, correct: false }));
      accuracy = 0;
    }

    return res.status(200).json({
      accuracy,
      phonemes,
      explanation,
      isSilent: false,
      wordData: wordData || null,
    });
  } catch (error) {
    console.error("Error analyzing pronunciation:", error);
    return res.status(500).json({
      error: "Failed to analyze pronunciation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

function parseFormData(req: any): Promise<{ audioBuffer: Buffer | null }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks);
        const bodyStr = body.toString("binary");

        const contentType = req.headers["content-type"] || "";
        const boundaryMatch = contentType.match(/boundary=(.+)$/);
        if (!boundaryMatch) {
          return resolve({ audioBuffer: null });
        }

        const boundary = "--" + boundaryMatch[1];
        const parts = bodyStr.split(boundary).slice(1, -1);

        let audioBuffer: Buffer | null = null;

        for (const part of parts) {
          const headerEnd = part.indexOf("\r\n\r\n");
          if (headerEnd === -1) continue;

          const headers = part.substring(0, headerEnd);
          const content = part.substring(headerEnd + 4, part.length - 2);

          if (headers.includes('name="audio"')) {
            audioBuffer = Buffer.from(content, "binary");
          }
        }

        resolve({ audioBuffer });
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", reject);
  });
}
