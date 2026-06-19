import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Volume2, AlertTriangle } from "lucide-react";
export default function Feedback() {
  const { wordIndex } = useParams<{ wordIndex: string }>();
  const navigate = useNavigate();
  const index = parseInt(wordIndex || "1");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [currentWord, setCurrentWord] = useState<any>(null);
  useEffect(() => {
    // 1. Get the dynamic words list
    const storedWords = sessionStorage.getItem("dynamic_lesson_words");
    if (storedWords) {
      try {
        const wordsArray = JSON.parse(storedWords);
        setCurrentWord(wordsArray[index - 1]);
      } catch (e) {
        console.error("Error parsing dynamic words", e);
      }
    }
    // 2. Get the real-time feedback data from the server response
    const storedAnalysis = sessionStorage.getItem(`analysis_${index}`);
    if (storedAnalysis) {
      try {
        setAnalysisData(JSON.parse(storedAnalysis));
      } catch (e) {
        console.error("Error parsing live analysis data", e);
      }
    }
  }, [index]);
  const handlePlayAudio = () => {
    if (!currentWord?.word) return;
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-GB"; 
    utterance.rate = 0.9; 
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) => voice.lang.includes("en-GB") && voice.name.toLowerCase().includes("female")
    ) || voices.find((voice) => voice.lang.includes("en-GB"));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    speechSynthesis.cancel(); 
    speechSynthesis.speak(utterance);
  };
  const handleNextWord = () => {
    if (index < 5) {
      navigate(`/practice/${index + 1}`);
    } else {
      navigate("/complete");
    }
  };
  if (!analysisData || !currentWord) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle size={40} className="text-amber-500 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-900">No Live Analysis Data Found</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          The app couldn't process your audio recording or fetch real-time grading. Please try recording again!
        </p>
        <button
          onClick={() => navigate(`/practice/${index}`)}
          className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
        >
          Go Back to Practice
        </button>
      </div>
    );
  }
  // Extract raw arrays from server response
  const rawPhonemes = Array.isArray(analysisData.phonemes) && analysisData.phonemes.length > 0
    ? analysisData.phonemes
    : (currentWord.phonemes || []).map((sound: string) => ({ sound, correct: false }));
  
  // ==========================================================
  // SILENCE DETECTION GUARD & ACCURACY CALCULATOR
  // ==========================================================
  // If the user's audio was silent/empty, or the backend marks it as empty/no speech
  const isSilentSubmission = 
    analysisData.userTranscription === "" || 
    analysisData.user_speech === "" ||
    analysisData.isSilent === true ||
    (rawPhonemes.length === 0 && !analysisData.explanation);
  let accuracy = 0;
  let phonemes = [...rawPhonemes];
  if (isSilentSubmission) {
    // 1. Force accuracy score to absolute zero
    accuracy = 0;
    // 2. Map whatever sounds exist in the current target word to be entirely FALSE (RED)
    if (currentWord.phonemes && Array.isArray(currentWord.phonemes)) {
      phonemes = currentWord.phonemes.map((sound: string) => ({
        sound: sound,
        correct: false
      }));
    } else if (rawPhonemes.length > 0) {
      phonemes = rawPhonemes.map((p: any) => ({ ...p, correct: false }));
    }
  } else {
    // Standard calculation if speech was actually detected
    if (phonemes.length > 0) {
      const correctCount = phonemes.filter((p: any) => p.correct === true).length;
      accuracy = Math.round((correctCount / phonemes.length) * 100);
    } else {
      accuracy = typeof analysisData.accuracy === "number" ? analysisData.accuracy : 0;
    }
  }
  // Dynamic explanation rewrite for zero-input dead air
  const detailedExplanation = isSilentSubmission 
    ? "No speech was detected in your recording. Please verify your microphone settings and try speaking the word clearly."
    : (analysisData.explanation || analysisData.feedback || "Evaluation complete.");
  // ==========================================================
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="w-full max-w-sm mx-auto flex flex-col space-y-8">
          <h1 className="text-3xl font-bold text-slate-900">Analysis</h1>
          {/* Accuracy Circle */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-40 h-40">
              <svg
                className="w-full h-full"
                viewBox="0 0 160 160"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle cx="80" cy="80" r="70" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={`${(accuracy / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{accuracy}%</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">ACCURACY</p>
          </div>
          {/* Phoneme Breakdown */}
          <div className="space-y-3">
            <p className="text-sm text-slate-500 font-medium">{currentWord.word.toUpperCase()}</p>
            {phonemes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {phonemes.map((phoneme: any, idx: number) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
                      phoneme.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {phoneme.sound}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Individual phoneme breakdown unavailable.</p>
            )}
          </div>
          {/* Explanation Text */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">{detailedExplanation}</p>
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-all disabled:opacity-75"
            >
              <Volume2 size={16} />
              <span>{isPlayingAudio ? "Playing..." : "Replay correct pronunciation"}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Fixed Bottom Action Area */}
      <div className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="w-full max-w-sm mx-auto">
          <button
            onClick={() => {
              pendo.track("word_practice_retried", {
                word: currentWord?.word,
                wordIndex: index,
                previousAccuracyScore: accuracy,
                previousCorrectPhonemes: phonemes.filter((p: any) => p.correct === true).length,
                previousTotalPhonemes: phonemes.length,
              });

              sessionStorage.removeItem(`analysis_${index}`);
              navigate(`/practice/${index}`);
            }}
            className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-full font-semibold text-base hover:bg-slate-200 flex items-center justify-center gap-2 mb-3"
          >
            <span>←</span>
            <span>Practice Again</span>
          </button>
          
          <button
            onClick={handleNextWord}
            className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            {index === 5 ? (
              <span>Finish lesson.</span>
            ) : (
              <>
                <span>Next Word</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
