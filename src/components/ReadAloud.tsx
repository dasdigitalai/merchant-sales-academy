"use client";
import { useEffect, useRef, useState } from "react";
import { authedPost } from "@/lib/authedFetch";
import { TTS_VOICES } from "@/lib/ttsVoices";

const VOICE_STORAGE_KEY = "readAloudVoice";

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
  // "" means "use the site default" (GOOGLE_TTS_VOICE on the server).
  const [voice, setVoice] = useState("");
  // Shows which voice actually played, and why if it wasn't the one chosen.
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VOICE_STORAGE_KEY);
      if (saved && TTS_VOICES.some((v) => v.id === saved)) setVoice(saved);
    } catch {}
  }, []);

  function chooseVoice(id: string) {
    setVoice(id);
    try {
      if (id) window.localStorage.setItem(VOICE_STORAGE_KEY, id);
      else window.localStorage.removeItem(VOICE_STORAGE_KEY);
    } catch {}
  }

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

  function speakWithBrowserFallback(text: string, reason = "") {
    usingFallbackRef.current = true;
    setStatus(`Using your browser's built-in voice${fallbackVoiceRef.current ? ` (${fallbackVoiceRef.current.name})` : ""} because Google voices failed${reason ? `: ${reason}` : ""}.`);
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
    setStatus("");

    try {
      // Over the daily limit (429) this throws too, and the browser's own voice reads it instead.
      const res = await authedPost("/api/tts", voice ? { text, voice } : { text });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`${res.status} ${body.error ?? ""}`.trim());
      }
      const data = await res.json();
      const { audioContent } = data;
      if (!audioContent) throw new Error("no audio returned");
      if (data.voice && data.voice !== data.requestedVoice) {
        setStatus(`Google rejected ${data.requestedVoice}, so the backup voice ${data.voice} played instead. ${data.primaryError ?? ""}`.trim());
      } else {
        setStatus(data.voice ? `Voice: ${data.voice}` : "");
      }

      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audioRef.current = audio;
      audio.onended = () => setState("idle");
      audio.onerror = () => speakWithBrowserFallback(text, "audio couldn't play");
      await audio.play();
      setState("speaking");
    } catch (err) {
      speakWithBrowserFallback(text, err instanceof Error ? err.message : "");
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
    <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {state === "idle" && <>
        <button type="button" className="btn btn-outline" onClick={start}>🔊 Read this lesson aloud</button>
        <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14 }}>
          Voice
          <select
            value={voice}
            onChange={(e) => chooseVoice(e.target.value)}
            style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid currentColor", background: "transparent", color: "inherit" }}
          >
            <option value="">Default</option>
            {TTS_VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </label>
      </>}
      {state === "loading" && <button type="button" className="btn btn-outline" disabled>Loading audio…</button>}
      {(state === "speaking" || state === "paused") && <>
        <button type="button" className="btn btn-outline" onClick={togglePause}>{state === "speaking" ? "⏸ Pause" : "▶ Resume"}</button>
        <button type="button" className="btn btn-outline" onClick={stop}>⏹ Stop</button>
      </>}
    </div>
    {status && <p style={{ fontSize: 13, opacity: 0.75, marginTop: 8, wordBreak: "break-word" }}>{status}</p>}
    </div>
  );
}
