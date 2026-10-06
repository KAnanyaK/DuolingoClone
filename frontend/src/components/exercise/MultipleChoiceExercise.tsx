"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { Check, X, Volume2, Heart } from "lucide-react";

export interface OptionItem {
  id: number;
  text: string;
}

export interface MultipleChoiceExerciseData {
  id: number;
  type: string;
  prompt: string;
  question: string;
  answer_data: {
    options: OptionItem[];
    correct_option_id: number;
  };
}

export interface MultipleChoiceExerciseProps {
  exercise: MultipleChoiceExerciseData;
  progressPercent?: number;
  onComplete?: () => void;
  onExit?: () => void;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  progressPercent = 50,
  onComplete,
  onExit,
}) => {
  const { hearts, decrementHearts, addXp } = useUserStore();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [progress, setProgress] = useState<number>(progressPercent);

  const correctOption = exercise.answer_data.options.find(
    (opt) => opt.id === exercise.answer_data.correct_option_id
  );

  const handleSelect = (id: number) => {
    if (status !== "idle") return;
    setSelectedOptionId(id);
  };

  const handleCheck = () => {
    if (selectedOptionId === null) return;

    if (selectedOptionId === exercise.answer_data.correct_option_id) {
      setStatus("correct");
      setProgress((prev) => Math.min(100, prev + 25));
      addXp(10);
    } else {
      setStatus("incorrect");
      decrementHearts();
    }
  };

  const handleContinue = () => {
    if (status === "correct") {
      if (onComplete) {
        onComplete();
      } else {
        setStatus("idle");
      }
    } else if (status === "incorrect") {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white font-nunito select-none">
      {/* Top Header with Progress Bar & Hearts */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center gap-4 sm:gap-6">
        {/* Close Button */}
        <button
          onClick={onExit}
          className="text-[#afafaf] hover:text-[#4b4b4b] p-1.5 transition-colors cursor-pointer"
          title="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Lesson Progress Bar */}
        <div className="flex-1 h-4 bg-[#e5e5e5] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-black text-[#FF4B4B]">
          <Heart className="w-6 h-6 fill-[#FF4B4B]" />
          <span className="text-lg">{hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Exercise Prompt Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] mb-4">
          {exercise.prompt}
        </h1>

        {/* Question Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            className="text-[#1CB0F6] hover:scale-110 active:scale-95 transition-transform cursor-pointer p-1"
            title="Listen pronunciation"
          >
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-xl sm:text-2xl font-bold text-[#4B4B4B] underline decoration-dotted decoration-gray-400 underline-offset-8">
            {exercise.question}
          </span>
        </div>

        {/* Multiple Choice Options List */}
        <div className="flex flex-col gap-3.5 my-auto">
          {exercise.answer_data.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={status !== "idle"}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-lg text-left transition-all duration-100 ease-out active:translate-y-1 active:border-b-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#1CB0F6] border-b-4 border-b-[#1CB0F6]"
                    : "bg-white text-[#4B4B4B] border-2 border-[#e5e5e5] border-b-4 border-b-[#e5e5e5] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-colors ${
                      isSelected
                        ? "border-[#1CB0F6] text-[#1CB0F6] bg-white"
                        : "border-[#e5e5e5] text-[#afafaf] bg-transparent"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-base sm:text-lg">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Validation Footer */}
      <footer
        className={`w-full border-t-2 transition-all duration-300 ease-out py-5 px-6 sm:px-12 ${
          status === "idle"
            ? "bg-white border-[#e5e5e5]"
            : status === "correct"
            ? "bg-[#d7ffb8] border-[#bcf096]"
            : "bg-[#ffdfe0] border-[#f8bcc0]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Banner Message */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {status === "correct" && (
              <div className="flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center text-white shadow">
                  <Check className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#58CC02]">Nicely done!</h3>
                  <p className="text-xs font-bold text-[#46a302]">
                    +10 XP earned
                  </p>
                </div>
              </div>
            )}

            {status === "incorrect" && (
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow flex-shrink-0 mt-0.5">
                  <X className="w-7 h-7 stroke-[3.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#FF4B4B]">Correct solution:</h3>
                  <p className="text-base font-extrabold text-[#ea2b2b]">
                    {correctOption ? correctOption.text : ""}
                  </p>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="hidden sm:block text-sm font-bold text-[#777777]">
                Choose an option and press Check
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full sm:w-auto">
            {status === "idle" ? (
              <Button
                variant={selectedOptionId !== null ? "primary" : "default"}
                size="lg"
                disabled={selectedOptionId === null}
                className="w-full sm:w-48 font-black tracking-widest"
                onClick={handleCheck}
              >
                Check
              </Button>
            ) : status === "correct" ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-48 font-black tracking-widest bg-[#58CC02] border-[#46a302]"
                onClick={handleContinue}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                className="w-full sm:w-48 font-black tracking-widest bg-[#FF4B4B] border-[#ea2b2b]"
                onClick={handleContinue}
              >
                Got it
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
