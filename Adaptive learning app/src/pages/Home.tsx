import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Code, FileText, Play } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Adaptive Assessment Platform
          </h1>
          <p className="mt-4 text-xl text-slate-500">
            Welcome! Prepare for your personalized evaluation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Exam Structure */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Exam Structure</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Brain size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Aptitude</h3>
                  <p className="mt-1 text-sm text-slate-500">Quantitative and numerical reasoning.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileText size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Logical Reasoning</h3>
                  <p className="mt-1 text-sm text-slate-500">Pattern recognition and logical deduction.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <BookOpen size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Verbal</h3>
                  <p className="mt-1 text-sm text-slate-500">Reading comprehension and grammar.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Code size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">Coding</h3>
                  <p className="mt-1 text-sm text-slate-500">Algorithmic problem solving.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Assessment Pattern & Difficulty */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Assessment Pattern</h2>
              <div className="prose prose-slate">
                <p>
                  This is an <strong>adaptive</strong> assessment. The difficulty of the questions will change dynamically based on your performance.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    <strong>Easy:</strong> Basic concepts and straightforward applications.
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>
                    <strong>Medium:</strong> Requires deeper understanding and multi-step logic.
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                    <strong>Hard:</strong> Complex problem-solving and advanced concepts.
                  </li>
                </ul>
                <p className="mt-6 text-sm text-slate-500">
                  Answering correctly increases the difficulty, while answering incorrectly decreases it. Your final score reflects both accuracy and the difficulty levels you mastered.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate('/assessment')}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Play className="mr-2" size={24} />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
