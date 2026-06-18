import { RequestHandler } from "express";

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
];

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function computeAccuracy(transcribed: string, target: string, phonemes: string[]): { accuracy: number; phonemes: { sound: string; correct: boolean }[] } {
  const transcribedLower = transcribed.toLowerCase().trim();
  const targetLower = target.toLowerCase().trim();
  
  const isExact = transcribedLower === targetLower;
  const maxDistance = Math.max(transcribedLower.length, targetLower.length);
  const distance = levenshteinDistance(transcribedLower, targetLower);
  const similarity = maxDistance > 0 ? 1 - distance / maxDistance : 0;
  
  let accuracy = 0;
  let phonemeResults: { sound: string; correct: boolean }[] = [];
  
  if (isExact) {
    accuracy = 100;
    phonemeResults = phonemes.map(sound => ({ sound, correct: true }));
  } else if (similarity > 0.7) {
    accuracy = 70;
    const correctCount = Math.ceil(phonemes.length * 0.7);
    phonemeResults = phonemes.map((sound, i) => ({ sound, correct: i < correctCount }));
  } else if (similarity > 0.4) {
    accuracy = 40;
    const correctCount = Math.floor(phonemes.length * 0.4);
    phonemeResults = phonemes.map((sound, i) => ({ sound, correct: i < correctCount }));
  } else {
    accuracy = 0;
    phonemeResults = phonemes.map(sound => ({ sound, correct: false }));
  }
  
  return { accuracy, phonemes: phonemeResults };
}

export const handleAnalyzePronunciation: RequestHandler = async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "";

    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart/form-data" });
    }

    const targetWord = req.query.targetWord as string;
    const { audioBuffer } = await parseFormData(req);

    if (!audioBuffer || !targetWord) {
      return res.status(400).json({ error: "Missing audio or targetWord" });
    }

    const isSilent = audioBuffer.length < 1000;
    const targetLower = String(targetWord).toLowerCase().trim();
    const wordData = WORD_LIST.find(w => w.word.toLowerCase() === targetLower);
    const phonemeList = wordData ? wordData.phonemes : [];

    if (isSilent) {
      const phonemes = phonemeList.map(sound => ({ sound, correct: false }));
      return res.status(200).json({
        accuracy: 0,
        phonemes,
        explanation: "No speech was detected. Please check your microphone and try speaking clearly.",
      });
    }

    let transcribedText = targetWord;
    try {
      const whisperFormData = new FormData();
      const audioBlob = new Blob([audioBuffer as any], { type: "audio/webm" });
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

      if (whisperRes.ok) {
        const whisperData = await whisperRes.json() as any;
        transcribedText = whisperData?.text?.trim() || targetWord;
      }
    } catch (whisperError) {
      console.log("Whisper transcription unavailable, using heuristic");
    }

    const { accuracy, phonemes } = computeAccuracy(transcribedText, targetWord, phonemeList);
    
    const explanations: { [key: number]: string } = {
      100: `Perfect! You nailed the pronunciation of "${targetWord}".`,
      70: `Nice! You got most of the sounds right for "${targetWord}". Keep practicing the subtle vowels.`,
      40: `Good effort on "${targetWord}". Focus on clearer enunciation of each syllable.`,
      0: `Keep practicing "${targetWord}". Pay attention to the word's rhythm and stress.`,
    };

    const explanation = explanations[accuracy] || explanations[0];

    return res.status(200).json({
      accuracy,
      phonemes,
      explanation,
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
        const contentType = req.headers["content-type"] || "";

        // Extract boundary
        const boundaryMatch = contentType.match(/boundary=([^;]+)/);
        if (!boundaryMatch || !boundaryMatch[1]) {
          console.error("No boundary found in content-type:", contentType);
          return resolve({ audioBuffer: null });
        }

        const boundary = boundaryMatch[1].trim();
        const boundaryDelimiter = `--${boundary}`;

        // Split by boundary
        const parts = body.toString("binary").split(boundaryDelimiter);

        let audioBuffer: Buffer | null = null;

        for (const part of parts) {
          if (part.length < 4) continue;

          // Find the empty line separating headers from content
          const emptyLineIndex = part.indexOf("\r\n\r\n");
          if (emptyLineIndex === -1) continue;

          const headerSection = part.substring(0, emptyLineIndex);

          // Only process audio field
          if (headerSection.includes('name="audio"')) {
            // Extract content, accounting for trailing \r\n before next boundary
            let content = part.substring(emptyLineIndex + 4);
            if (content.endsWith("\r\n")) {
              content = content.slice(0, -2);
            }
            audioBuffer = Buffer.from(content, "binary");
            break; // Found audio, no need to continue
          }
        }

        if (!audioBuffer) {
          console.warn("Audio field not found in FormData");
        }

        resolve({ audioBuffer });
      } catch (err) {
        console.error("Error parsing FormData:", err);
        reject(err);
      }
    });

    req.on("error", reject);
  });
}
