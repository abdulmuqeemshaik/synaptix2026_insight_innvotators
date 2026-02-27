import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchResults(parsedUser.userId);
  }, [navigate]);

  const fetchResults = async (userId: string) => {
    try {
      const res = await fetch(`/api/results/${userId}`);
      if (!res.ok) throw new Error('Results not found');
      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">No Results Found</h2>
          <p className="mt-2 text-slate-500">You haven't completed the assessment yet.</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const barData = [
    { name: 'Aptitude', score: parseFloat(summary.aptitudePercentage) },
    { name: 'Logical', score: parseFloat(summary.logicalPercentage) },
    { name: 'Verbal', score: parseFloat(summary.verbalPercentage) },
    { name: 'Coding', score: parseFloat(summary.codingPercentage) },
  ];

  const pieData = [
    { name: 'Correct', value: parseInt(summary.overallScore) },
    { name: 'Incorrect', value: parseInt(summary.totalQuestions) - parseInt(summary.overallScore) },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  const getMasteryColor = (level: string) => {
    if (level === 'Hard') return 'bg-green-100 text-green-800';
    if (level === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-slate-100 text-slate-800';
  };

  // Determine Strengths and Weaknesses
  const sortedSections = [...barData].sort((a, b) => b.score - a.score);
  const strengths = sortedSections.slice(0, 2).map(s => s.name);
  const weaknesses = sortedSections.slice(2).map(s => s.name);

  const getSuggestionDetails = (section: string, mastery: string) => {
    if (mastery === 'Hard') {
      return `Excellent skills in ${section}. You can tackle complex scenarios efficiently. Keep practicing advanced topics to maintain this edge.`;
    }
    if (mastery === 'Medium') {
      return `Good grasp of core concepts in ${section}. To reach the next level, focus on multi-step problems and edge cases.`;
    }
    return `Needs improvement in ${section}. Start by reviewing fundamental concepts and practicing basic applications before moving to complex problems.`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Performance Analytics</h1>
          <p className="mt-4 text-lg text-slate-500">
            Competency profile for {user?.email}
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Award size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Overall Score</p>
                <p className="text-2xl font-bold text-slate-900">{summary.overallPercentage}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Correct Answers</p>
                <p className="text-2xl font-bold text-slate-900">{summary.overallScore} / {summary.totalQuestions}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Top Strength</p>
                <p className="text-xl font-bold text-slate-900">{strengths[0]}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">Focus Area</p>
                <p className="text-xl font-bold text-slate-900">{weaknesses[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Section-wise Performance</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Overall Accuracy</h3>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mastery Levels */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Proficiency Scale</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500 mb-2">Aptitude</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getMasteryColor(summary.aptitudeMastery)}`}>
                {summary.aptitudeMastery} Mastery
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500 mb-2">Logical Reasoning</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getMasteryColor(summary.logicalMastery)}`}>
                {summary.logicalMastery} Mastery
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500 mb-2">Verbal</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getMasteryColor(summary.verbalMastery)}`}>
                {summary.verbalMastery} Mastery
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-medium text-slate-500 mb-2">Coding</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getMasteryColor(summary.codingMastery)}`}>
                {summary.codingMastery} Mastery
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-slate-900 p-8 text-white shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-6">Performance Summary</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-emerald-400 font-semibold mb-3 flex items-center">
                <TrendingUp size={18} className="mr-2" /> Strengths
              </h4>
              <ul className="space-y-4 text-slate-300">
                {strengths.map(s => {
                  const masteryKey = s.toLowerCase().split(' ')[0] + 'Mastery';
                  const mastery = summary[masteryKey] || 'Medium';
                  return (
                    <li key={s} className="bg-slate-800/50 p-4 rounded-lg">
                      <strong className="block text-white mb-1">{s}</strong>
                      <span className="text-sm">{getSuggestionDetails(s, mastery)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 className="text-amber-400 font-semibold mb-3 flex items-center">
                <AlertTriangle size={18} className="mr-2" /> Recommended Improvement Areas
              </h4>
              <ul className="space-y-4 text-slate-300">
                {weaknesses.map(s => {
                  const masteryKey = s.toLowerCase().split(' ')[0] + 'Mastery';
                  const mastery = summary[masteryKey] || 'Easy';
                  return (
                    <li key={s} className="bg-slate-800/50 p-4 rounded-lg">
                      <strong className="block text-white mb-1">{s}</strong>
                      <span className="text-sm">{getSuggestionDetails(s, mastery)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center pb-12">
          <button
            onClick={() => navigate('/home')}
            className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
