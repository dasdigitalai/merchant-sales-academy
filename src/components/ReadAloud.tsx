"use client";
import { useEffect, useRef, useState } from "react";
import { authedPost } from "@/lib/authedFetch";

// Fallback-only: used if the Cloud TTS API request fails for any reason
// (network issue, quota, misconfiguration). Network voices sound far less
// robotic than the default local SAPI voices most browsers pick first.
const PREFERRED_FALLBACK_VOICE_NAMES = [
  "Google US English",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Microsoft Guy Online (Natural) - English (United States)",
  "Google UK English Female",
];

function pickBestFallbackVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of PREFERRED_FALLBACK_VOICE_NAMES) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  const anyNetworkEnglish = voices.find((v) => !v.localService && v.lang.startsWith("en"));
  if (anyNetworkEnglish) return anyNetworkEnglish;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

export function ReadAloud({ targetId }: { targetId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "speaking" | "paused">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const usingFallbackRef = useRef(false);
  const fallbackVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    function loadVoice() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) fallbackVoiceRef.current = pickBestFallbackVoice(voices);
    }
    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
    return () => {
      window.speechSynthesis.cancel();
      audioRef.current?.pause();
    };
  }, []);

  // Lets ModuleTimer count listening as active time even with no mouse or keyboard input.
  useEffect(() => {
    if (state === "speaking") document.body.dataset.readAloud = "1";
    else delete document.body.dataset.readAloud;
    return () => { delete document.body.dataset.readAloud; };
  }, [state]);

  function getText() {
    return document.getElementById(targetId)?.innerText?.trim() ?? "";
  }

  function speakWithBrowserFallback(text: string) {
    usingFallbackRef.current = true;
    const utter = new SpeechSynthesisUtterance(text);
    if (fallbackVoiceRef.current) utter.voice = fallbackVoiceRef.current;
    utter.rate = 1.02;
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    window.speechSynthesis.speak(utter);
    setState("speaking");
  }

  async function start() {
    const text = getText();
    if (!text) return;
    setState("loading");
    usingFallbackRef.current = false;

    try {
      // Over the daily limit (429) this throws too, and the browser's own voice reads it instead.
      const res = await authedPost("/api/tts", { text });
      if (!res.ok) throw new Error("tts request failed");
      const { audioContent } = await res.json();
      if (!audioContent) throw new Error("no audio returned");

      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setState("idle");
      audio.onerror = () => speakWithBrowserFallback(text);
      await audio.play();
      setState("speaking");
    } catch {
      speakWithBrowserFallback(text);
    }
  }

  function togglePause() {
    if (usingFallbackRef.current) {
      if (state === "speaking") { window.speechSynthesis.pause(); setState("paused"); }
      else if (state === "paused") { window.speechSynthesis.resume(); setState("speaking"); }
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (state === "speaking") { audio.pause(); setState("paused"); }
    else if (state === "paused") { audio.play(); setState("speaking"); }
  }

  function stop() {
    if (usingFallbackRef.current) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setState("idle");
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28 }}>
      {state === "idle" && <button type="button" className="btn btn-outline" onClick={start}>🔊 Read this lesson aloud</button>}
      {state === "loading" && <button type="button" className="btn btn-outline" disabled>Loading audio…</button>}
      {(state === "speaking" || state === "paused") && <>
        <button type="button" className="btn btn-outline" onClick={togglePause}>{state === "speaking" ? "⏸ Pause" : "▶ Resume"}</button>
        <button type="button" className="btn btn-outline" onClick={stop}>⏹ Stop</button>
      </>}
    </div>
  );
}
