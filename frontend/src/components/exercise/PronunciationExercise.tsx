"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { X, Volume2, Mic, Sparkles, Heart, AudioWaveform } from "lucide-react";
import { OutOfHeartsModal } from "./OutOfHeartsModal";

export interface PronunciationExerciseData {
  id: number;
  type: "pronunciation";
  prompt?: string;
  question?: string;
  phonetic?: string;
  translation?: string;
  answer_data?: {
    target_text?: string;
  };
}

export interface PronunciationExerciseProps {
  exercise: PronunciationExerciseData;
  progressPercent?: number;
  targetProgressPercent?: number;
  isReview?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
}

export const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({
  exercise,
  progressPercent = 40,
  onComplete,
  onExit,
}) => {
  const { hearts } = useUserStore();
  const [isGhostOverlayOpen, setIsGhostOverlayOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const targetText = exercise.question || "Guten Morgen";
  const promptText = exercise.prompt || "Say Guten Morgen";
  const phoneticText = exercise.phonetic || "ˈɡuːtn̩ ˈmɔʁɡn̩";
  const translationText = exercise.translation || "Good morning";

  // Native text-to-speech helper
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-[#E5E5E5] font-nunito select-none relative transition-colors">
      {/* Out of Hearts Modal if hearts hits 0 */}
      <OutOfHeartsModal isOpen={hearts <= 0} />

      {/* Top Header / Progress Bar */}
      <div className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
        <button
          onClick={onExit}
          className="text-[#afafaf] hover:text-[#4B4B4B] dark:hover:text-white transition-colors p-2 cursor-pointer"
          aria-label="Exit lesson"
        >
          <X size={28} strokeWidth={3} />
        </button>

        {/* Progress Bar (progress does not increment or decrement with this question) */}
        <div className="flex-1 h-4 bg-[#e5e5e5] dark:bg-[#2B3E48] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-2">
          <Heart size={26} className="text-[#FF4B4B] fill-[#FF4B4B]" />
          <span className="font-black text-xl text-[#FF4B4B]">{hearts}</span>
        </div>
      </div>

      {/* Main Pronunciation Exercise Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 flex flex-col justify-center py-4">
        {/* Prompt Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#4B4B4B] dark:text-white mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center flex-shrink-0">
            <Mic className="w-6 h-6" />
          </span>
          {promptText}
        </h1>

        {/* Target Sentence Card */}
        <div className="flex items-start sm:items-center gap-4 mb-8 p-5 sm:p-6 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#263E4B] bg-gray-50/60 dark:bg-[#18272E] shadow-xs">
          <button
            type="button"
            onClick={() => handleSpeak(targetText)}
            className={`w-14 h-14 rounded-2xl bg-[#1CB0F6] text-white flex items-center justify-center shadow-[0_4px_0_#1899D6] hover:bg-[#1899D6] active:translate-y-1 active:shadow-none transition-all flex-shrink-0 cursor-pointer ${
              isSpeaking ? "animate-pulse" : ""
            }`}
            aria-label="Listen to pronunciation"
          >
            <Volume2 size={28} />
          </button>

          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white tracking-wide">
              {targetText}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-[#8FA2AC] bg-white dark:bg-[#202F36] px-2 py-0.5 rounded-md border border-[#E5E5E5] dark:border-[#37464F]">
                /{phoneticText}/
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#777777] dark:text-[#93A4AC]">
                • {translationText}
              </span>
            </div>
          </div>
        </div>

        {/* Answer Section: Placeholder Microphone Activity */}
        <div className="flex flex-col items-center justify-center py-6 sm:py-10">
          <p className="text-sm sm:text-base font-bold text-[#777777] dark:text-[#93A4AC] mb-6 text-center">
            Tap the microphone and speak aloud to record your answer
          </p>

          {/* Interactive Microphone Button with ambient pulse ripples */}
          <div className="relative group">
            {/* Ambient Animated Ripple Waves */}
            <div className="absolute inset-0 -m-3 rounded-full bg-[#1CB0F6]/20 animate-ping opacity-60" />
            <div className="absolute inset-0 -m-6 rounded-full bg-[#1CB0F6]/10 animate-pulse" />

            <button
              type="button"
              onClick={() => setIsGhostOverlayOpen(true)}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#1CB0F6] to-[#0D86CA] border-b-6 border-[#0A6DA4] hover:brightness-105 active:translate-y-1 active:border-b-2 text-white flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer select-none group"
              aria-label="Record pronunciation"
            >
              <Mic className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5] drop-shadow-sm group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest mt-1 opacity-90">
                Record
              </span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#AFAFAF]">
            <AudioWaveform className="w-4 h-4" />
            <span>Voice detection active</span>
          </div>
        </div>
      </main>

      {/* Bottom Footer: Strictly ONLY a Continue button (no skip) */}
      <footer className="w-full border-t-2 border-[#e5e5e5] dark:border-[#263E4B] bg-white dark:bg-[#131F24] py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-end">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-48 font-black tracking-widest bg-[#58CC02] border-[#46a302]"
            onClick={onComplete}
          >
            Continue
          </Button>
        </div>
      </footer>

      {/* Ghostly Coming Soon Overlay */}
      {isGhostOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E171B]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Frosted Dark Overlay Card */}
          <div className="relative bg-[#131F24] border-2 border-[#263740] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Ambient Colored Backlight Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#1CB0F6]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#A435F0]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Coming Soon Pill Banner */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1CB0F6] via-[#A435F0] to-[#FF4B4B] text-white font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md mb-5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              COMING SOON
            </div>

            {/* Microphone Mascot Graphic */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#1CB0F6] to-[#0D86CA] border-2 border-white/20 shadow-xl flex items-center justify-center text-white mb-4">
              <Mic className="w-10 h-10 stroke-[2.5]" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              Elocution Exercises
            </h3>

            {/* Requested exact user message */}
            <p className="text-sm font-bold text-[#8FA2AC] leading-relaxed mb-6">
              Practice vocabulary or writing skills till then on duolingo, we will soon be here with your elocution exercises .
            </p>

            {/* Sub-note */}
            <div className="bg-[#18272E] border border-[#23353E] rounded-2xl p-3 mb-6 text-xs font-bold text-[#6A7E88]">
              You can click <span className="text-[#58CC02] font-black">Continue</span> on the exercise below to finish your lesson.
            </div>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsGhostOverlayOpen(false)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1CB0F6] shadow-[0_4px_0_#1899D6] hover:brightness-105 active:translate-y-1 active:shadow-none text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
