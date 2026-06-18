import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const handleStartLesson = async () => {
    try {
      sessionStorage.removeItem("dynamic_lesson_words");
      const response = await fetch("/api/analyze-pronunciation?action=start-lesson");
      const data = await response.json();
      if (!data.words) {
        alert("Failed to load words from server: " + JSON.stringify(data));
        return;
      }
      sessionStorage.setItem("dynamic_lesson_words", JSON.stringify(data.words));
      navigate("/practice/1");
    } catch (error) {
      alert("Error starting lesson: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center">
            <span className="text-white text-3xl font-bold">ʃə</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">
            Perfect your
            <br />
            British accent.
          </h1>
          <p className="text-base text-slate-500 leading-relaxed">
            Your personal AI pronunciation coach to help you master specific sounds and speak more like a native speaker.
          </p>
        </div>
      </div>
      <div className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="w-full max-w-sm mx-auto">
          <button
            onClick={handleStartLesson}
            className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Start Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
