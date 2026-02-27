import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions, Question, Section, Difficulty } from '../data/questions';
import { CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const SECTIONS: Section[] = ['Aptitude', 'Logical Reasoning', 'Verbal', 'Coding'];
const QUESTIONS_PER_SECTION = 3;

export default function Assessment() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Assessment State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // within section
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('Medium');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  
  // Tracking Results
  const [results, setResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    loadNextQuestion('Medium', 0);
  }, [navigate]);

  const loadNextQuestion = (difficulty: Difficulty, sectionIdx: number) => {
    const section = SECTIONS[sectionIdx];
    
    // Get all questions for this section and difficulty
    const availableQuestions = questions.filter(
      q => q.section === section && q.difficulty === difficulty
    );
    
    // Filter out already answered questions
    const answeredIds = results.map(r => r.questionId);
    const unanswered = availableQuestions.filter(q => !answeredIds.includes(q.id));
    
    // If we run out of questions for this difficulty, fallback to any available in this section
    let nextQ = unanswered.length > 0 ? unanswered[0] : null;
    
    if (!nextQ) {
      const allUnansweredInSection = questions.filter(
        q => q.section === section && !answeredIds.includes(q.id)
      );
      if (allUnansweredInSection.length > 0) {
        nextQ = allUnansweredInSection[0];
        setCurrentDifficulty(nextQ.difficulty);
      }
    }
    
    setCurrentQuestion(nextQ);
    setSelectedOption('');
    setIsAnswerSubmitted(false);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !currentQuestion) return;
    
    setIsAnswerSubmitted(true);
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Record result
    const newResult = {
      section: currentQuestion.section,
      questionId: currentQuestion.id,
      difficultyAttempted: currentQuestion.difficulty,
      isCorrect,
      selectedOption,
      correctAnswer: currentQuestion.correctAnswer
    };
    
    setResults(prev => [...prev, newResult]);
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Determine next difficulty
    let nextDifficulty: Difficulty = currentDifficulty;
    if (isCorrect) {
      if (currentDifficulty === 'Easy') nextDifficulty = 'Medium';
      else if (currentDifficulty === 'Medium') nextDifficulty = 'Hard';
    } else {
      if (currentDifficulty === 'Hard') nextDifficulty = 'Medium';
      else if (currentDifficulty === 'Medium') nextDifficulty = 'Easy';
    }
    
    setCurrentDifficulty(nextDifficulty);
    
    // Check if section is complete
    if (currentQuestionIndex + 1 >= QUESTIONS_PER_SECTION) {
      // Move to next section
      if (currentSectionIndex + 1 >= SECTIONS.length) {
        // Assessment Complete
        await finishAssessment();
      } else {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        // Reset difficulty for new section
        setCurrentDifficulty('Medium');
        loadNextQuestion('Medium', currentSectionIndex + 1);
      }
    } else {
      // Next question in same section
      setCurrentQuestionIndex(prev => prev + 1);
      loadNextQuestion(nextDifficulty, currentSectionIndex);
    }
  };

  const finishAssessment = async () => {
    setIsSubmitting(true);
    
    // Calculate summary
    let totalCorrect = 0;
    const sectionScores: Record<string, { correct: number, total: number, mastery: string }> = {};
    
    SECTIONS.forEach(sec => {
      sectionScores[sec] = { correct: 0, total: 0, mastery: 'Easy' };
    });
    
    // We need to use the latest results array, which might not be fully updated in state yet
    // So we calculate based on the current results + the last answer
    const finalResults = [...results];
    if (currentQuestion && !results.find(r => r.questionId === currentQuestion.id)) {
        finalResults.push({
            section: currentQuestion.section,
            questionId: currentQuestion.id,
            difficultyAttempted: currentQuestion.difficulty,
            isCorrect: selectedOption === currentQuestion.correctAnswer,
            selectedOption,
            correctAnswer: currentQuestion.correctAnswer
        });
    }

    finalResults.forEach(r => {
      if (r.isCorrect) {
        totalCorrect++;
        sectionScores[r.section].correct++;
        
        // Update mastery based on hardest correct answer
        if (r.difficultyAttempted === 'Hard') sectionScores[r.section].mastery = 'Hard';
        else if (r.difficultyAttempted === 'Medium' && sectionScores[r.section].mastery === 'Easy') {
          sectionScores[r.section].mastery = 'Medium';
        }
      }
      sectionScores[r.section].total++;
    });
    
    const overallPercentage = (totalCorrect / finalResults.length) * 100;
    
    const summary = {
      userId: user.userId,
      email: user.email,
      date: new Date().toISOString(),
      overallScore: totalCorrect,
      totalQuestions: finalResults.length,
      overallPercentage: overallPercentage.toFixed(2),
      aptitudePercentage: ((sectionScores['Aptitude'].correct / sectionScores['Aptitude'].total) * 100).toFixed(2),
      aptitudeMastery: sectionScores['Aptitude'].mastery,
      logicalPercentage: ((sectionScores['Logical Reasoning'].correct / sectionScores['Logical Reasoning'].total) * 100).toFixed(2),
      logicalMastery: sectionScores['Logical Reasoning'].mastery,
      verbalPercentage: ((sectionScores['Verbal'].correct / sectionScores['Verbal'].total) * 100).toFixed(2),
      verbalMastery: sectionScores['Verbal'].mastery,
      codingPercentage: ((sectionScores['Coding'].correct / sectionScores['Coding'].total) * 100).toFixed(2),
      codingMastery: sectionScores['Coding'].mastery,
    };
    
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          results: finalResults,
          summary
        })
      });
      
      navigate('/results');
    } catch (error) {
      console.error('Failed to save results', error);
      alert('Failed to save results. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentSectionIndex * QUESTIONS_PER_SECTION + currentQuestionIndex) / (SECTIONS.length * QUESTIONS_PER_SECTION)) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Header & Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-900">
              Section {currentSectionIndex + 1} of {SECTIONS.length}: {SECTIONS[currentSectionIndex]}
            </h2>
            <span className="text-sm font-medium text-slate-500">
              Question {currentQuestionIndex + 1} of {QUESTIONS_PER_SECTION}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              currentDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              currentDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentDifficulty} Level
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h3 className="text-lg font-medium text-slate-900 mb-6">
            {currentQuestion.text}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let optionClass = "flex w-full items-center rounded-xl border p-4 text-left transition-all focus:outline-none ";
              
              if (!isAnswerSubmitted) {
                optionClass += isSelected 
                  ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" 
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
              } else {
                const isCorrectOption = option === currentQuestion.correctAnswer;
                if (isCorrectOption) {
                  optionClass += "border-green-500 bg-green-50 text-green-900 ring-1 ring-green-500";
                } else if (isSelected && !isCorrectOption) {
                  optionClass += "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500";
                } else {
                  optionClass += "border-slate-200 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswerSubmitted}
                  className={optionClass}
                >
                  <div className={`mr-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected && !isAnswerSubmitted ? 'border-indigo-600 bg-indigo-600' : 
                    isAnswerSubmitted && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-500' :
                    isAnswerSubmitted && isSelected ? 'border-red-500 bg-red-500' :
                    'border-slate-300'
                  }`}>
                    {(isSelected || (isAnswerSubmitted && option === currentQuestion.correctAnswer)) && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (
                  <>
                    {currentSectionIndex === SECTIONS.length - 1 && currentQuestionIndex === QUESTIONS_PER_SECTION - 1 ? 'Finish Assessment' : 'Next Question'}
                    <ChevronRight className="ml-2" size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
