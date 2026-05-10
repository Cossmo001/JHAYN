import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Loader } from 'lucide-react';
import { generateQuestions } from '../lib/gemini';

export default function Quiz() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const fetchQ = async () => {
      try {
        const generated = await generateQuestions(subjectId || 'general ICT');
        setQuestions(generated);
      } catch (e) {
        alert("Failed to load AI questions. Returning to home.");
        navigate('/');
      }
      setIsLoading(false);
    };
    fetchQ();
  }, [subjectId, navigate]);

  useEffect(() => {
    if (isLoading) return;
    if (timeLeft <= 0) {
      handleCompleteQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);

  const handleSelect = (index) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: index }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    // In a real app, we would calculate score and send to backend here
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 1;
    });
    
    // Pass state to results route
    navigate('/results', { state: { score, total: questions.length, answers: selectedAnswers, questions: questions, subjectId: subjectId }});
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const question = questions[currentQuestion];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full animate-pulse">
        <Loader className="w-12 h-12 text-lilac animate-spin mb-4" />
        <h2 className="text-xl text-gray-400 font-medium">Generating unique questions...</h2>
      </div>
    );
  }

  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-col items-center pt-8 pb-12 w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="flex justify-between w-full items-center mb-8 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-md">
        <div className="text-gray-400">
          <span className="font-semibold text-lilac uppercase tracking-wider text-sm">{subjectId} Quiz</span>
        </div>
        
        <div className="flex items-center gap-2 text-fuchsia-400 font-mono text-xl bg-gray-800 px-4 py-2 rounded-lg">
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestion) / questions.length) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 shadow-inner">
          <div 
            className="bg-gradient-to-r from-lilac to-fuchsia-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-100 mb-8">{question.text}</h2>
        
        <div className="space-y-4">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                  isSelected 
                  ? 'border-lilac bg-lilac/10 shadow-[0_0_15px_rgba(200,162,200,0.2)]' 
                  : 'border-gray-800 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
                }`}
              >
                <span className={`text-lg ${isSelected ? 'text-lilac font-medium' : 'text-gray-300 group-hover:text-white'}`}>
                  {option}
                </span>
                
                {/* Radio Circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-lilac' : 'border-gray-600 group-hover:border-gray-400'
                }`}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-lilac"></div>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex justify-end">
        <button 
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all ${
            selectedAnswers[currentQuestion] !== undefined
            ? 'bg-gradient-to-r from-lilac to-fuchsia-600 text-white hover:scale-105 shadow-lg shadow-fuchsia-900/30'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          }`}
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          {isLastQuestion ? null : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
      
    </div>
  );
}
