import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_FLASHCARDS } from '../constants';
import { Flashcard } from '../types';
import Button from '../components/ui/Button';

const Learn: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // The user mentioned shuffling, so let's implement that.
    const shuffled = [...MOCK_FLASHCARDS].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
  }, []);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false); // Show the front of the next card
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false); // Show the front of the previous card
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight') handleNext();
      if (e.code === 'ArrowLeft') handlePrev();
      if (e.code === 'Space') {
        e.preventDefault(); // prevent page scroll
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  if (flashcards.length === 0) {
    return (
      <div className="text-center text-slate-500">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Study Flashcards</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Reviewing topics you've struggled with. Use Arrow Keys to navigate and Space to flip.
      </p>

      <div className="flex flex-col items-center">
        {/* Flashcard */}
        <div
          className="w-full max-w-2xl h-80 perspective-1000"
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label="Flip card"
          onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
        >
          <div
            className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-8 cursor-pointer">
              <p className="text-2xl font-semibold text-center text-slate-800 dark:text-slate-100">
                {currentCard.front}
              </p>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden bg-primary-50 dark:bg-slate-700 rounded-xl shadow-lg flex items-center justify-center p-8 cursor-pointer rotate-y-180">
              <p className="text-lg text-slate-700 dark:text-slate-200">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>

        {/* Progress and Navigation */}
        <div className="mt-8 flex items-center justify-between w-full max-w-2xl">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="secondary"
          >
            Previous
          </Button>

          <p className="font-semibold text-slate-600 dark:text-slate-400">
            {currentIndex + 1} / {flashcards.length}
          </p>

          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Custom CSS for 3D transform */}
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
