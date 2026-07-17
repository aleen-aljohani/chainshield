/** Browser Speech Synthesis with a graceful fallback. */
export function speak(text: string, lang = "en-US"): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function speechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
