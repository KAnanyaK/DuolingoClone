"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TranslateExercise,
  ExerciseData as TranslateExerciseData,
} from "@/components/exercise/TranslateExercise";
import {
  MultipleChoiceExercise,
  MultipleChoiceExerciseData,
} from "@/components/exercise/MultipleChoiceExercise";
import {
  MatchPairsExercise,
  MatchPairsExerciseData,
} from "@/components/exercise/MatchPairsExercise";
import {
  FillInBlankExercise,
  FillInBlankExerciseData,
} from "@/components/exercise/FillInBlankExercise";
import {
  TypeAnswerExercise,
  TypeAnswerExerciseData,
} from "@/components/exercise/TypeAnswerExercise";
import { LessonComplete } from "@/components/exercise/LessonComplete";

type ExerciseUnion =
  | ({ type: "translate" } & TranslateExerciseData)
  | ({ type: "multiple_choice" } & MultipleChoiceExerciseData)
  | ({ type: "match_pairs" } & MatchPairsExerciseData)
  | ({ type: "fill_blank" } & FillInBlankExerciseData)
  | ({ type: "type_answer" } & TypeAnswerExerciseData);

interface LessonResponse {
  id: number;
  title: string;
  xp_reward: number;
  exercises: ExerciseUnion[];
}

export default function LessonPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseUnion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Skipped questions queue and review tracking
  const [skippedQueue, setSkippedQueue] = useState<ExerciseUnion[]>([]);
  const [isReviewPhase, setIsReviewPhase] = useState<boolean>(false);
  const [lessonProgress, setLessonProgress] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/lessons/1")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: LessonResponse) => {
        if (data.exercises && data.exercises.length > 0) {
          setExercises(data.exercises);
        }
      })
      .catch(() => {
        // Fallback default exercises including all 5 types
        setExercises([
          {
            id: 1,
            type: "translate",
            prompt: "Translate this sentence",
            question: "Guten Morgen",
            answer_data: {
              correct_answer: ["Good", "morning"],
              word_bank: ["Good", "night", "morning", "hello", "apple"],
            },
          },
          {
            id: 2,
            type: "multiple_choice",
            prompt: "Select the correct translation",
            question: "The apple",
            answer_data: {
              options: [
                { id: 1, text: "Der Apfel" },
                { id: 2, text: "Das Brot" },
                { id: 3, text: "Die Milch" },
              ],
              correct_option_id: 1,
            },
          },
          {
            id: 3,
            type: "match_pairs",
            prompt: "Tap the matching pairs",
            answer_data: {
              pairs: [
                { id: 1, german: "Junge", english: "Boy" },
                { id: 2, german: "Mädchen", english: "Girl" },
                { id: 3, german: "Frau", english: "Woman" },
                { id: 4, german: "Mann", english: "Man" },
              ],
            },
          },
          {
            id: 4,
            type: "fill_blank",
            prompt: "Fill in the missing word",
            sentence: "Der ___ frisst den Apfel.",
            answer_data: {
              word_bank: ["Junge", "Apfel", "Wasser", "Brot"],
              correct_answer: "Junge",
            },
          },
          {
            id: 5,
            type: "type_answer",
            prompt: "Write this in German",
            question: "Hello",
            answer_data: {
              correct_answer: "Hallo",
            },
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-nunito">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
          <p className="font-extrabold text-[#4B4B4B] text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-nunito">
        <p className="font-bold text-[#FF4B4B]">No exercises found.</p>
      </div>
    );
  }

  // If all exercises are finished, render the celebration view
  if (isCompleted) {
    return <LessonComplete xpGained={10} completedLessonId={1} />;
  }

  const currentExercise = exercises[currentIndex];

  // Calculate target progress upon completing current question correctly
  const targetCompletedPercent = Math.min(
    100,
    lessonProgress + (isReviewPhase ? 15 : 20)
  );

  // When a user successfully answers the current question
  const handleComplete = () => {
    const nextProg = Math.min(100, lessonProgress + (isReviewPhase ? 15 : 20));
    setLessonProgress(nextProg);
    advanceQueue();
  };

  // When a user skips the current question
  const handleSkip = () => {
    // Progress increases by 5% when skipped
    setLessonProgress((prev) => Math.min(100, prev + 5));

    // Save to skipped queue if not already in review phase (or re-queue if skipped during review)
    setSkippedQueue((prev) => [...prev, currentExercise]);

    advanceQueue();
  };

  const advanceQueue = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached the end of the current exercise list
      if (skippedQueue.length > 0) {
        // Transition to review phase with the skipped questions
        setExercises([...skippedQueue]);
        setSkippedQueue([]);
        setIsReviewPhase(true);
        setCurrentIndex(0);
      } else {
        // Everything completed
        setIsCompleted(true);
      }
    }
  };

  const handleExit = () => {
    router.push("/");
  };

  const commonProps = {
    progressPercent: lessonProgress,
    targetProgressPercent: targetCompletedPercent,
    isReview: isReviewPhase,
    onComplete: handleComplete,
    onSkip: handleSkip,
    onExit: handleExit,
  };

  if (currentExercise.type === "translate") {
    return (
      <TranslateExercise
        key={`${currentExercise.id}-${isReviewPhase ? "rev" : "norm"}-${currentIndex}`}
        exercise={currentExercise}
        {...commonProps}
      />
    );
  }

  if (currentExercise.type === "multiple_choice") {
    return (
      <MultipleChoiceExercise
        key={`${currentExercise.id}-${isReviewPhase ? "rev" : "norm"}-${currentIndex}`}
        exercise={currentExercise}
        {...commonProps}
      />
    );
  }

  if (currentExercise.type === "fill_blank") {
    return (
      <FillInBlankExercise
        key={`${currentExercise.id}-${isReviewPhase ? "rev" : "norm"}-${currentIndex}`}
        exercise={currentExercise}
        {...commonProps}
      />
    );
  }

  if (currentExercise.type === "type_answer") {
    return (
      <TypeAnswerExercise
        key={`${currentExercise.id}-${isReviewPhase ? "rev" : "norm"}-${currentIndex}`}
        exercise={currentExercise}
        {...commonProps}
      />
    );
  }

  return (
    <MatchPairsExercise
      key={`${currentExercise.id}-${isReviewPhase ? "rev" : "norm"}-${currentIndex}`}
      exercise={currentExercise}
      {...commonProps}
    />
  );
}
