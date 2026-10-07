/**
 * Text-To-Speech (TTS) utility using native Web Speech API
 * Configured specifically for German language learning (de-DE)
 */
export const speakGerman = (text: string, rate: number = 0.9): void => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  try {
    // Cancel any previous in-progress utterance to prevent queued overlap
    window.speechSynthesis.cancel();

    // Clean any blank underscores or markdown-style syntax
    const cleanText = text.replace(/[_]+/g, "").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "de-DE";
    utterance.rate = rate; // Slightly slower, authentic pedagogical pace

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Text-to-speech error:", err);
  }
};
