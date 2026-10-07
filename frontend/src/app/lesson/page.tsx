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
import {
  PronunciationExercise,
  PronunciationExerciseData,
} from "@/components/exercise/PronunciationExercise";
import { LessonComplete } from "@/components/exercise/LessonComplete";
import { ExitConfirmationModal } from "@/components/exercise/ExitConfirmationModal";
import { API_BASE_URL } from "@/config/api";

type ExerciseUnion = (
  | ({ type: "translate" } & TranslateExerciseData)
  | ({ type: "multiple_choice" } & MultipleChoiceExerciseData)
  | ({ type: "pronunciation" } & PronunciationExerciseData)
  | ({ type: "match_pairs" } & MatchPairsExerciseData)
  | ({ type: "fill_blank" } & FillInBlankExerciseData)
  | ({ type: "type_answer" } & TypeAnswerExerciseData)
) & { can_skip?: boolean };

interface SkillSessionResponse {
  skill_id: number;
  current_index: number;
  exercises: ExerciseUnion[];
  skipped_question_ids: number[];
  retry_queue: ExerciseUnion[];
  is_review_phase: boolean;
  progress_percent: number;
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

  // Skipped questions queue, IDs, and review tracking
  const [skippedQueue, setSkippedQueue] = useState<ExerciseUnion[]>([]);
  const [skippedQuestionIds, setSkippedQuestionIds] = useState<number[]>([]);
  const [isReviewPhase, setIsReviewPhase] = useState<boolean>(false);
  const [lessonProgress, setLessonProgress] = useState<number>(0);

  // Exit Confirmation Modal state
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);

  // Helper to sync session state with the backend
  const saveSessionToBackend = (payload: {
    current_index?: number;
    progress_percent?: number;
    skipped_question_ids?: number[];
    retry_queue?: ExerciseUnion[];
    is_review_phase?: boolean;
    action?: string;
    question_id?: number;
  }) => {
    if (typeof window !== "undefined") {
      if (typeof payload.progress_percent === "number") {
        localStorage.setItem(`duo_skill_progress_${skillId}`, payload.progress_percent.toString());
      }
      if (typeof payload.current_index === "number") {
        localStorage.setItem(`duo_skill_exercise_idx_${skillId}`, payload.current_index.toString());
      }
    }
    fetch(`${API_BASE_URL}/api/skills/${skillId}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  // 1. Fetch backend exercise session on mount (seamlessly resumes active in-flight session)
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/skills/${skillId}/session`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: SkillSessionResponse) => {
        if (data.exercises && data.exercises.length > 0) {
          setExercises(data.exercises);
        }
        if (typeof data.current_index === "number") {
          setCurrentIndex(data.current_index);
        }
        if (Array.isArray(data.skipped_question_ids)) {
          setSkippedQuestionIds(data.skipped_question_ids);
        }
        if (Array.isArray(data.retry_queue)) {
          setSkippedQueue(data.retry_queue);
        }
        if (typeof data.is_review_phase === "boolean") {
          setIsReviewPhase(data.is_review_phase);
        }
        if (typeof data.progress_percent === "number") {
          setLessonProgress(data.progress_percent);
        }
      })
      .catch(() => {
        // Fallback default exercises including all question types
        const defaultExercises: ExerciseUnion[] = [
          {
            id: 1,
            type: "translate",
            prompt: "Translate this sentence",
            question: "Guten Morgen",
            can_skip: true,
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
            can_skip: true,
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
            type: "pronunciation",
            prompt: "Say Guten Morgen",
            question: "Guten Morgen",
            phonetic: "ˈɡuːtn̩ ˈmɔʁɡn̩",
            translation: "Good morning",
            can_skip: false,
            answer_data: {
              target_text: "Guten Morgen",
            },
          },
          {
            id: 4,
            type: "match_pairs",
            prompt: "Tap the matching pairs",
            can_skip: true,
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
            id: 5,
            type: "fill_blank",
            prompt: "Fill in the missing word",
            sentence: "Der ___ frisst den Apfel.",
            can_skip: true,
            answer_data: {
              word_bank: ["Junge", "Apfel", "Wasser", "Brot"],
              correct_answer: "Junge",
            },
          },
          {
            id: 6,
            type: "type_answer",
            prompt: "Write this in German",
            question: "Hello",
            can_skip: true,
            answer_data: {
              correct_answer: "Hallo",
            },
          },
        ];
        setExercises(defaultExercises);

        // Fallback local storage restoration
        if (typeof window !== "undefined") {
          const savedProg = localStorage.getItem(`duo_skill_progress_${skillId}`);
          const savedIdx = localStorage.getItem(`duo_skill_exercise_idx_${skillId}`);
          if (savedProg) {
            const parsed = parseFloat(savedProg);
            if (!isNaN(parsed) && parsed > 0 && parsed < 100) setLessonProgress(parsed);
          }
          if (savedIdx) {
            const parsedIdx = parseInt(savedIdx, 10);
            if (!isNaN(parsedIdx) && parsedIdx > 0 && parsedIdx < defaultExercises.length) {
              setCurrentIndex(parsedIdx);
            }
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [skillId]);

  const advanceQueueWithState = (
    currentRetryQueue: ExerciseUnion[],
    inReview: boolean,
    progressVal: number
  ) => {
    if (currentIndex < exercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
    } else {
      // Reached the end of the current exercise list
      if (currentRetryQueue.length > 0) {
        // Transition to review phase with the queued skipped questions
        const reviewExercises = currentRetryQueue.map((ex) => ({ ...ex, can_skip: false }));
        setExercises(reviewExercises);
        setSkippedQueue([]);
        setIsReviewPhase(true);
        setCurrentIndex(0);

        saveSessionToBackend({
          current_index: 0,
          progress_percent: progressVal,
          skipped_question_ids: skippedQuestionIds,
          retry_queue: [],
          is_review_phase: true,
          action: "transition_review",
        });
      } else {
        // Everything completed
        setIsCompleted(true);
      }
    }
  };

  // When a user successfully answers the current question
  const handleComplete = () => {
    const currentEx = exercises[currentIndex];
    let nextProg = lessonProgress;
    if (currentEx?.type !== "pronunciation") {
      nextProg = Math.min(100, lessonProgress + (isReviewPhase ? 15 : 20));
      setLessonProgress(nextProg);
    }

    const nextIdx = currentIndex + 1;
    saveSessionToBackend({
      current_index: nextIdx < exercises.length ? nextIdx : 0,
      progress_percent: nextProg,
      skipped_question_ids: skippedQuestionIds,
      retry_queue: skippedQueue,
      is_review_phase: isReviewPhase,
      action: "complete",
      question_id: currentEx?.id,
    });

    advanceQueueWithState(skippedQueue, isReviewPhase, nextProg);
  };

  // When a user skips the current question (can only happen if not already skipped)
  const handleSkip = () => {
    const currentEx = exercises[currentIndex];
    const nextProg = Math.min(100, lessonProgress + 5);
    const updatedSkippedIds = Array.from(new Set([...skippedQuestionIds, currentEx.id]));
    const updatedRetryQueue = [...skippedQueue, { ...currentEx, can_skip: false }];

    setLessonProgress(nextProg);
    setSkippedQuestionIds(updatedSkippedIds);
    setSkippedQueue(updatedRetryQueue);

    const nextIdx = currentIndex + 1;
    saveSessionToBackend({
      current_index: nextIdx < exercises.length ? nextIdx : 0,
      progress_percent: nextProg,
      skipped_question_ids: updatedSkippedIds,
      retry_queue: updatedRetryQueue,
      is_review_phase: isReviewPhase,
      action: "skip",
      question_id: currentEx.id,
    });

    advanceQueueWithState(updatedRetryQueue, isReviewPhase, nextProg);
  };

  const handleExitClick = () => {
    setIsExitModalOpen(true);
  };

  const handleKeepLearning = () => {
    setIsExitModalOpen(false);
  };

  const handleEndSession = () => {
    setIsExitModalOpen(false);
    saveSessionToBackend({
      current_index: currentIndex,
      progress_percent: lessonProgress,
      skipped_question_ids: skippedQuestionIds,
      retry_queue: skippedQueue,
      is_review_phase: isReviewPhase,
      action: "exit",
    });
    router.push("/learn");
  };

  // Calculate target progress upon completing current question correctly
  const currentEx = exercises[currentIndex];
  const targetCompletedPercent =
    currentEx?.type === "pronunciation"
      ? lessonProgress
      : Math.min(100, lessonProgress + (isReviewPhase ? 15 : 20));

  // Early returns placed strictly AFTER all hooks are executed:
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#131F24] font-nunito transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
          <p className="font-extrabold text-[#4B4B4B] dark:text-white text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#131F24] font-nunito transition-colors">
        <p className="font-bold text-[#FF4B4B]">No exercises found.</p>
      </div>
    );
  }

  // If all exercises are finished, render the celebration view and clear mid-lesson storage & backend session
  if (isCompleted) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`duo_skill_progress_${skillId}`);
      localStorage.removeItem(`duo_skill_exercise_idx_${skillId}`);
    }
    fetch(`${API_BASE_URL}/api/skills/${skillId}/session`, { method: "DELETE" }).catch(() => {});
    return <LessonComplete xpGained={10} completedLessonId={skillId} skillId={skillId} />;
  }

  const currentExercise = exercises[currentIndex];
  const canSkipCurrent = Boolean(
    currentExercise &&
      currentExercise.can_skip !== false &&
      !isReviewPhase &&
      !skippedQuestionIds.includes(currentExercise.id)
  );

  const commonProps = {
    progressPercent: lessonProgress,
    targetProgressPercent: targetCompletedPercent,
    isReview: isReviewPhase,
    canSkip: canSkipCurrent,
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

    if (currentExercise.type === "pronunciation") {
      return (
        <PronunciationExercise
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
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#131F24] font-nunito transition-colors">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
            <p className="font-extrabold text-[#4B4B4B] dark:text-white text-lg">Loading lesson...</p>
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
