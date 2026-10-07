"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { TypeAnswerExercise, TypeAnswerExerciseData } from "@/components/exercise/TypeAnswerExercise";
import { LessonComplete } from "@/components/exercise/LessonComplete";
import { ExitConfirmationModal } from "@/components/exercise/ExitConfirmationModal";

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

function LessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSkillId = searchParams.get("skillId");
  const skillId = rawSkillId ? parseInt(rawSkillId, 10) : 1;

  const [exercises, setExercises] = useState<ExerciseUnion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Skipped questions queue and review tracking
  const [skippedQueue, setSkippedQueue] = useState<ExerciseUnion[]>([]);
  const [isReviewPhase, setIsReviewPhase] = useState<boolean>(false);
  const [lessonProgress, setLessonProgress] = useState<number>(0);

  // Exit Confirmation Modal state
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);

  // 1. Fetch exercises on mount
  useEffect(() => {
    fetch(`http://localhost:8000/api/lessons/${skillId}`)
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
  }, [skillId]);

  // 2. Restore in-progress state if user previously exited mid-lesson (Hook MUST run before any early return)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProg = localStorage.getItem(`duo_skill_progress_${skillId}`);
      const savedIdx = localStorage.getItem(`duo_skill_exercise_idx_${skillId}`);
      if (savedProg) {
        const parsed = parseFloat(savedProg);
        if (!isNaN(parsed) && parsed > 0 && parsed < 100) {
          setLessonProgress(parsed);
        }
      }
      if (savedIdx && exercises.length > 0) {
        const parsedIdx = parseInt(savedIdx, 10);
        if (!isNaN(parsedIdx) && parsedIdx > 0 && parsedIdx < exercises.length) {
          setCurrentIndex(parsedIdx);
        }
      }
    }
  }, [skillId, exercises.length]);

  const syncProgress = (progressVal: number, nextIdx: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`duo_skill_progress_${skillId}`, progressVal.toString());
      localStorage.setItem(`duo_skill_exercise_idx_${skillId}`, nextIdx.toString());
    }
    fetch(`http://localhost:8000/api/skills/${skillId}/mid-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress_percent: progressVal }),
    }).catch(() => {});
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

  // When a user successfully answers the current question
  const handleComplete = () => {
    const nextProg = Math.min(100, lessonProgress + (isReviewPhase ? 15 : 20));
    setLessonProgress(nextProg);
    syncProgress(nextProg, currentIndex + 1);
    advanceQueue();
  };

  // When a user skips the current question
  const handleSkip = () => {
    const nextProg = Math.min(100, lessonProgress + 5);
    setLessonProgress(nextProg);
    syncProgress(nextProg, currentIndex + 1);

    // Save to skipped queue if not already in review phase (or re-queue if skipped during review)
    setSkippedQueue((prev) => [...prev, exercises[currentIndex]]);
    advanceQueue();
  };

  const handleExitClick = () => {
    setIsExitModalOpen(true);
  };

  const handleKeepLearning = () => {
    setIsExitModalOpen(false);
  };

  const handleEndSession = () => {
    setIsExitModalOpen(false);
    syncProgress(lessonProgress, currentIndex);
    router.push("/learn");
  };

  // Calculate target progress upon completing current question correctly
  const targetCompletedPercent = Math.min(
    100,
    lessonProgress + (isReviewPhase ? 15 : 20)
  );

  // Early returns placed strictly AFTER all hooks are executed:
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

  // If all exercises are finished, render the celebration view and clear mid-lesson storage
  if (isCompleted) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`duo_skill_progress_${skillId}`);
      localStorage.removeItem(`duo_skill_exercise_idx_${skillId}`);
    }
    return <LessonComplete xpGained={10} completedLessonId={skillId} skillId={skillId} />;
  }

  const currentExercise = exercises[currentIndex];

  const commonProps = {
    progressPercent: lessonProgress,
    targetProgressPercent: targetCompletedPercent,
    isReview: isReviewPhase,
    onComplete: handleComplete,
    onSkip: handleSkip,
    onExit: handleExitClick,
  };

  const renderCurrentExercise = () => {
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
  };

  return (
    <>
      {renderCurrentExercise()}
      <ExitConfirmationModal
        isOpen={isExitModalOpen}
        onKeepLearning={handleKeepLearning}
        onEndSession={handleEndSession}
      />
    </>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white font-nunito">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
            <p className="font-extrabold text-[#4B4B4B] text-lg">Loading lesson...</p>
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
