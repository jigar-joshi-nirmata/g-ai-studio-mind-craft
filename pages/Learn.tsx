import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFlashcards } from '../services/api';
import { Flashcard } from '../types';
import { CheckIcon, XMarkIcon, SparklesIcon } from '../assets/icons';
import Spinner from '../components/ui/Spinner';

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Learn: React.FC = () => {
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlashcards = async () => {
        try {
            setIsLoading(true);
            const cards = await getFlashcards();
            setAllFlashcards(cards);
        } catch (error) {
            console.error("Failed to load flashcards", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadFlashcards();
  }, []);

  const startSession = useCallback(() => {
    if (allFlashcards.length === 0) return;
    setCurrentDeck(shuffleArray(allFlashcards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setKnownCount(0);
  }, [allFlashcards]);

  useEffect(() => {
    if (allFlashcards.length > 0) {
      startSession();
    }
  }, [allFlashcards, startSession]);

  const handleFlip = () => {
    if (sessionComplete || currentDeck.length === 0) return;
    setIsFlipped(prev => !prev);
  };

  const handleAnswer = (knewIt: boolean) => {
    if (knewIt) {
      setKnownCount(prev => prev + 1);
    }

    if (currentIndex < currentDeck.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
      }, 200);
    } else {
      setSessionComplete(true);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip]);

  const progressPercentage = useMemo(() => {
      if(currentDeck.length === 0) return 0;
      if (sessionComplete) return 100;
      return (currentIndex / currentDeck.length) * 100;
  }, [currentIndex, currentDeck.length, sessionComplete]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner className="w-12 h-12" /></div>;
  }
  
  if (allFlashcards.length === 0) {
    return <div className="text-center text-slate-400">No flashcards available. Complete a test to generate some!</div>;
  }
  
  if (sessionComplete) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto">
            <SparklesIcon className="w-24 h-24 text-yellow-400" />
            <h1 className="text-4xl font-bold mt-4 text-white">Session Complete!</h1>
            <p className="text-slate-300 text-lg mt-2">Great work. You're one step closer to mastery.</p>
            <div className="my-8 p-8 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-lg">
                <p className="text-slate-400 text-sm">YOU KNEW</p>
                <p className="text-6xl font-bold text-green-400">
                    {knownCount} <span className="text-3xl text-slate-300">/ {currentDeck.length}</span>
                </p>
                <p className="text-slate-400 text-sm">CARDS</p>
            </div>
            <div className="flex gap-4">
                <button onClick={startSession} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg transition-transform hover:scale-105 shadow-lg shadow-primary-500/30">
                    Study Again
                </button>
                <Link to="/dashboard" className="px-6 py-3 bg-slate-700/80 text-white font-semibold rounded-lg transition-transform hover:scale-105 shadow-lg">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
  }

  const currentCard = currentDeck[currentIndex];
  
  if (!currentCard) {
    return <div className="text-center text-slate-400">Preparing your study session...</div>;
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full max-w-3xl mb-6">
          <h1 className="text-3xl font-bold text-center mb-2 text-slate-100">Study Mode</h1>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5">
              <div
                  className="bg-gradient-to-r from-green-400 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
              ></div>
          </div>
          <p className="text-center text-slate-400 text-sm mt-2">{currentIndex + 1} / {currentDeck.length}</p>
      </div>

      <div
        className="w-full max-w-3xl h-[24rem] perspective-1000 cursor-pointer"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
      >
        <div
          className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 flex items-center justify-center text-center bg-white/10 backdrop-blur-lg border border-white/20">
            <p className="text-3xl font-semibold text-white">
              {currentCard.front}
            </p>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl p-8 flex items-center justify-center text-center rotate-y-180 bg-white/20 backdrop-blur-lg border border-white/20">
            <p className="text-xl text-slate-200">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 h-20 w-full max-w-3xl flex items-center justify-center gap-6">
        {isFlipped ? (
            <>
                <button onClick={() => handleAnswer(false)} className="flex flex-col items-center justify-center gap-2 w-48 h-20 text-red-300 bg-red-500/20 border-2 border-red-500/50 rounded-lg transition-all hover:bg-red-500/30 hover:scale-105">
                    <XMarkIcon className="w-7 h-7" />
                    <span className="font-semibold">I Didn't Know</span>
                </button>
                <button onClick={() => handleAnswer(true)} className="flex flex-col items-center justify-center gap-2 w-48 h-20 text-green-300 bg-green-500/20 border-2 border-green-500/50 rounded-lg transition-all hover:bg-green-500/30 hover:scale-105">
                    <CheckIcon className="w-7 h-7" />
                    <span className="font-semibold">I Knew It!</span>
                </button>
            </>
        ) : (
            <div className="text-slate-400 font-semibold animate-pulse">Click card or press Space to flip</div>
        )}
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default Learn;
