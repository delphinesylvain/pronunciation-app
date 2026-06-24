import { useState, useEffect, useRef } from "react";
import { Volume2, Mic } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getWordByIndex, getLessonWords } from "../utils/lesson";

export default function Practice() {
  const { wordIndex } = useParams<{ wordIndex: string }>();
  const navigate = useNavigate();
  const currentWordIndex = wordIndex ? parseInt(wordIndex) - 1 : 0;
  const [lessonWords, setLessonWords] = useState(getLessonWords());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;

    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) => voice.lang.includes("en-GB") && voice.name.toLowerCase().includes("female")
    ) || voices.find(
      (voice) => voice.lang.includes("en-GB")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handlePlayRecording = () => {
    if (!audioBlobRef.current) {
      console.error("No audio recording available");
      return;
    }
    setIsPlayingRecording(true);
    const audioUrl = URL.createObjectURL(audioBlobRef.current);
    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    audio.onended = () => {
      setIsPlayingRecording(false);
      URL.revokeObjectURL(audioUrl);
    };

    audio.onerror = () => {
      setIsPlayingRecording(false);
      URL.revokeObjectURL(audioUrl);
    };

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      setIsPlayingRecording(false);
      URL.revokeObjectURL(audioUrl);
    });
  };

  const handleSubmitForFeedback = async () => {
    if (!audioBlobRef.current) {
      alert("No recording found. Please record your pronunciation first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlobRef.current, "recording.webm");
      formData.append("wordIndex", String(currentWordIndex + 1));

      const response = await fetch(`/api/analyze-pronunciation?targetWord=${encodeURIComponent(currentWord.word)}`, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(
          `Server error: Invalid response format. Status: ${response.status}`
        );
      }

      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.error || `HTTP ${response.status}: Failed to analyze pronunciation`
        );
      }

      if (
        responseData.accuracy === undefined ||
        !responseData.phonemes ||
        !responseData.explanation
      ) {
        throw new Error("Invalid response format from server");
      }

      sessionStorage.setItem(
        `analysis_${currentWordIndex + 1}`,
        JSON.stringify(responseData)
      );

      const phonemesArr = Array.isArray(responseData.phonemes) ? responseData.phonemes : [];
      const correctCount = phonemesArr.filter((p: any) => p.correct === true).length;

      pendo.track("pronunciation_analyzed", {
        word: currentWord.word,
        wordIndex: currentWordIndex + 1,
        accuracyScore: responseData.accuracy,
        totalPhonemes: phonemesArr.length,
        correctPhonemes: correctCount,
        isSilent: responseData.isSilent === true,
      });

      navigate(`/feedback/${currentWordIndex + 1}`);
    } catch (error) {
      console.error("Error analyzing pronunciation:", error);
      setIsSubmitting(false);
      alert(
        "Error analyzing pronunciation: " +
        (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const currentWord = lessonWords[currentWordIndex] || getWordByIndex(currentWordIndex + 1) || { id: 1, word: "Word", ipa: "" };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    audioChunksRef.current = [];
    audioBlobRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        audioBlobRef.current = audioBlob;
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsRecording(false);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);

    pendo.track("pronunciation_recorded", {
      word: currentWord.word,
      wordIndex: currentWordIndex + 1,
      recordingDurationSeconds: recordingTime,
      totalWordsInLesson: lessonWords.length,
    });

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  if (isRecording) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-8">
            <div className="text-sm text-slate-400 font-medium">
              WORD {currentWordIndex + 1} OF 5
            </div>
            <h2 className="text-5xl font-bold text-slate-900">
              {currentWord.word}
            </h2>
            <p className="text-lg text-slate-500">{currentWord.ipa}</p>
            <div className="text-3xl font-bold text-rose-500 font-mono mt-12">
              {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
              {String(recordingTime % 60).padStart(2, "0")}
            </div>
            <p className="text-slate-400 text-sm">Recording in progress...</p>
          </div>
        </div>
        <div className="bg-white border-t border-slate-200 px-6 py-6">
          <div className="w-full max-w-sm mx-auto">
            <button
              onClick={handleStopRecording}
              className="w-full bg-rose-500 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              <span>Stop Recording</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasRecording && currentWordIndex < 5) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-8">
            <div className="text-sm text-slate-400 font-medium">
              WORD {currentWordIndex + 1} OF 5
            </div>
            <h2 className="text-5xl font-bold text-slate-900">
              {currentWord.word}
            </h2>
            <p className="text-lg text-slate-500">{currentWord.ipa}</p>
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-full hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
            >
              <Volume2 size={20} className="text-slate-600" />
              <span className="text-slate-600 font-medium">
                {isPlayingAudio ? "Playing..." : "Listen to correct pronunciation"}
              </span>
            </button>
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => {
                  setHasRecording(false);
                }}
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:scale-110 active:scale-95 transition-all"
                title="Re-record"
              >
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handlePlayRecording}
                disabled={isPlayingRecording}
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 hover:scale-110 active:scale-95 transition-all disabled:opacity-75"
                title="Play recording"
              >
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-slate-200 px-6 py-6">
          <div className="w-full max-w-sm mx-auto">
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center gap-4 py-4 animate-fadeIn">
                <div className="relative w-12 h-12">
                  <svg
                    className="w-full h-full animate-spin text-slate-900"
                    viewBox="0 0 50 50"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.25"
                      className="text-slate-300"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="31.4 125.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium text-center">
                  AI is analysing your pronunciation...
                </p>
              </div>
            ) : (
              <button
                onClick={handleSubmitForFeedback}
                disabled={isSubmitting || isPlayingRecording}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all text-center animate-fadeIn disabled:opacity-50"
              >
                {isPlayingRecording ? "Playing..." : "Submit for Feedback"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center justify-center space-y-8">
          <div className="text-sm text-slate-400 font-medium">
            WORD {currentWordIndex + 1} OF 5
          </div>
          <h2 className="text-5xl font-bold text-slate-900">{currentWord.word}</h2>
          <p className="text-lg text-slate-500">{currentWord.ipa}</p>
          <button
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
            className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-full hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
          >
            <Volume2 size={20} className="text-slate-600" />
            <span className="text-slate-600 font-medium">
              {isPlayingAudio ? "Playing..." : "Listen to correct pronunciation"}
            </span>
          </button>
        </div>
      </div>
      <div className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3">
          <p className="text-slate-400 text-sm">Tap the button below to start recording</p>
          <button
            onClick={handleStartRecording}
            className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Mic size={20} className="text-white" />
            <span>Record Pronunciation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
