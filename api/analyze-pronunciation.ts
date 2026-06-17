// =============================================================
// pronunciation.js — British English Accent App Backend
// =============================================================

const express = require("express");
const router = express.Router();

// =============================================================
// MASTER WORD LIST — single source of truth
// Each entry: word, ipa (display string), phonemes (IPA array)
// =============================================================
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
  { word: "Worcestershire", ipa: "/ˈwʊstəʃə/", phonemes: ["w", "ʊ", "s", "t", "ə", "ʃ", "ə"] },
  { word: "Anaesthesia", ipa: "/ˌænɪsˈθiːziə/", phonemes: ["æ", "n", "ɪ", "s", "θ", "iː", "z", "i", "ə"] },
  { word: "Deteriorate", ipa: "/dɪˈtɪəriəreɪt/", phonemes: ["d", "ɪ", "t", "ɪ", "ə", "r", "i", "ə", "r", "eɪ", "t"] },
  { word: "Exacerbate", ipa: "/ɪɡˈzæsəbeɪt/", phonemes: ["ɪ", "ɡ", "z", "æ", "s", "ə", "b", "eɪ", "t"] },
  { word: "Hyperbole", ipa: "/haɪˈpɜːbəli/", phonemes: ["h", "aɪ", "p", "ɜː", "b", "ə", "l", "i"] },
  { word: "Indefatigable", ipa: "/ˌɪndɪˈfætɪɡəbl/", phonemes: ["ɪ", "n", "d", "ɪ", "f", "æ", "t", "ɪ", "ɡ", "ə", "b", "l"] },
  { word: "Juxtaposition", ipa: "/ˌdʒʌkstəpəˈzɪʃən/", phonemes: ["dʒ", "ʌ", "k", "s", "t", "ə", "p", "ə", "z", "ɪ", "ʃ", "ən"] },
];

// =============================================================
// LEVENSHTEIN DISTANCE — measures how different two strings are
// Returns a 0–100 similarity score
// =============================================================
function levenshteinSimilarity(a, b) {
  const m = a.length;
  const n = b.length;

  // If either string is empty, similarity is 0
  if (m === 0 || n === 0) return 0;

  // Build distance matrix
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  const distance = dp[m][n];
  const maxLen = Math.max(m, n);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

// =============================================================
// ENDPOINT 1 — GET /api/start-lesson
// Returns 5 random words for this session (with IPA + phonemes)
// =============================================================
router.get("/start-lesson", (req, res) => {
  try {
    // Shuffle a copy of WORD_LIST and pick the first 5
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const sessionWords = shuffled.slice(0, 5);
    return res.status(200).json({ words: sessionWords });
  } catch (error) {
    console.error("Error starting lesson:", error);
    return res.status(500).json({ error: "Failed to start lesson" });
  }
});

// =============================================================
// ENDPOINT 2 — POST /api/analyze-pronunciation
// Scores the user's transcribed speech against the target word
// and returns AI-generated feedback via OpenAI gpt-4o-mini
// =============================================================
router.post("/analyze-pronunciation", async (req, res) => {
  try {
    const { targetWord, transcribedText } = req.body;

    // ── 1. Validate inputs ──────────────────────────────────
    if (!targetWord || transcribedText === undefined || transcribedText === null) {
      return res.status(400).json({ error: "Missing targetWord or transcribedText" });
    }

    const targetLower = String(targetWord).toLowerCase().trim();
    const transcribedLower = String(transcribedText).toLowerCase().trim();

    // ── 2. Silence detection — hard 0% ─────────────────────
    const isSilent = transcribedLower.length === 0;

    // ── 3. Look up word data from master list ───────────────
    const wordData = WORD_LIST.find(
      (w) => w.word.toLowerCase() === targetLower
    );
    const phonemeList = wordData ? wordData.phonemes : targetLower.split("");

    // ── 4. Score — Levenshtein similarity, no clamping ─────
    let accuracy = 0;
    if (!isSilent) {
      accuracy = levenshteinSimilarity(transcribedLower, targetLower);
    }
    // accuracy is now genuinely 0–100, no artificial floor or ceiling

    // ── 5. Map phonemes to correct/incorrect ────────────────
    // Distribute correctness proportionally across phonemes
    const correctCount = Math.round((phonemeList.length * accuracy) / 100);
    const phonemes = phonemeList.map((sound, idx) => ({
      sound,
      correct: !isSilent && idx < correctCount,
    }));

    // ── 6. AI-generated feedback via OpenAI ─────────────────
    let explanation = "";

    if (isSilent) {
      explanation =
        "No speech was detected in your recording. Please check your microphone and try speaking the word clearly into it.";
    } else {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 120,
            messages: [
              {
                role: "system",
                content:
                  "You are a British English pronunciation coach. Give one short, friendly, specific piece of feedback (2–3 sentences max). Focus on the sounds the user got wrong and how to improve them. Use simple language. Do not mention scores or percentages.",
              },
              {
                role: "user",
                content: `The user was asked to say the word "${targetWord}" (British English). The speech recognition heard: "${transcribedText}". Their accuracy score was ${accuracy}%. Give them specific, encouraging feedback on how to improve their pronunciation.`,
              },
            ],
          }),
        });

        const openaiData = await openaiRes.json();
        explanation =
          openaiData?.choices?.[0]?.message?.content?.trim() || "";
      } catch (aiError) {
        console.error("OpenAI call failed:", aiError);
      }

      // Fallback if OpenAI fails or returns empty
      if (!explanation) {
        if (accuracy >= 90) {
          explanation = `Excellent! Your pronunciation of "${targetWord}" was very close to the target. Keep it up!`;
        } else if (accuracy >= 70) {
          explanation = `Good effort on "${targetWord}". You got most sounds right — focus on the ones highlighted in red.`;
        } else if (accuracy >= 40) {
          explanation = `You're making progress with "${targetWord}". Try slowing down and pronouncing each sound carefully.`;
        } else {
          explanation = `It looks like what was heard didn't quite match "${targetWord}". Try again — speak slowly and clearly.`;
        }
      }
    }

    // ── 7. Send response ────────────────────────────────────
    return res.status(200).json({
      accuracy,
      phonemes,
      explanation,
      isSilent,
      // Pass word metadata back so the frontend always has it
      wordData: wordData || null,
    });
  } catch (error) {
    console.error("Error analyzing pronunciation:", error);
    return res.status(500).json({
      error: "Failed to analyze pronunciation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

module.exports = router;
