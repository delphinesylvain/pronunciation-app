import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Complete() {
  const [averageAccuracy, setAverageAccuracy] = useState<number>(0);

  useEffect(() => {
    let totalLessonPercentage = 0;
    let countedWords = 0;

    // Loop through all 5 words from the lesson
    for (let index = 1; index <= 5; index++) {
      const storedAnalysis = sessionStorage.getItem(`analysis_${index}`);
      
      if (storedAnalysis) {
        try {
          const analysisData = JSON.parse(storedAnalysis);
          const phonemes = Array.isArray(analysisData.phonemes) ? analysisData.phonemes : [];

          if (phonemes.length > 0) {
            // Calculate this specific word's score using the exact same logic as Feedback.tsx
            const correctCount = phonemes.filter((p: any) => p.correct === true).length;
            const wordPercentage = (correctCount / phonemes.length) * 100;
            totalLessonPercentage += wordPercentage;
          } else if (typeof analysisData.accuracy === "number") {
            totalLessonPercentage += analysisData.accuracy;
          }
          countedWords++;
        } catch (e) {
          console.error(`Error parsing analysis for word ${index}`, e);
        }
      }
    }

    // Calculate the overall average across the completed words
    if (countedWords > 0) {
      setAverageAccuracy(Math.round(totalLessonPercentage / countedWords));
    } else {
      setAverageAccuracy(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={56} className="text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-slate-900">Lesson Complete</h1>

          {/* Message */}
          <p className="text-lg text-slate-600 leading-relaxed">
            Great job! You practiced 5 words today. Consistent practice is the key to perfecting your accent.
          </p>

          {/* Stats */}
          <div className="w-full space-y-4 bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Words Practiced</span>
              <span className="text-2xl font-bold text-slate-900">5</span>
            </div>
            <div className="border-t border-slate-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Average Accuracy</span>
              <span className="text-2xl font-bold text-green-600">{averageAccuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Area */}
      <div className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="w-full max-w-sm mx-auto">
          <Link
            to="/"
            className="w-full bg-slate-100 text-slate-900 py-4 px-6 rounded-full font-semibold text-lg hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Next lesson</span>
          </Link>
        </div>
      </div>
    </div>
  );
}