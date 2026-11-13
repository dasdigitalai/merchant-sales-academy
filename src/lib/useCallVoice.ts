"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { authedPost } from "@/lib/authedFetch";
import { pickBestFallbackVoice } from "@/lib/browserVoice";
import { CALL_VOICES } from "@/lib/ttsVoices";

// Speaks the call simulator's merchant replies out loud.
//
// Uses the same Google Cloud voices as the lesson read-aloud (/api/tts), one
// voice per person on the phone, and drops to the browser's own voice if that
// request fails (network, daily limit, not configured), so the call never goes
// quiet. Clips are cached by voice and text, so replaying a line costs nothing.

const MUTE_KEY = "callSimulatorVoiceMuted";

// A silent clip played on a tap. Safari only lets a page play audio it started
// from a tap, and the merchant's reply arrives well after the tap; once this
// element has played something, it can play the reply later.
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

// "[puts you on hold]" and "[hangs up]" are stage directions, not speech.
const speakable = (text: string) => text.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();

// Same person, same voice, even if the label drifts ("Lucia (owner)" vs "Lucia").
const personKey = (speaker?: string) => (speaker ?? "").replace(/\(.*?\)/g, "").trim().toLowerCase();

// preferred: the scenario's voices. Whoever speaks first on the call (the person
// who answers) gets the answerer's voice and the next person the decision-maker's.
export function useCallVoice(preferred?: { answerer: string; decisionMaker: string }) {
  const preferredRef = useRef(preferred);
  preferredRef.current = preferred;
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const mutedRef = useRef(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const run = useRef(0); // bumped on every speak/stop, so a slow request can't talk over a newer line
  const voices = useRef(new Map<string, string>());
  const clips = useRef(new Map<string, string>());
  const fallback = useRef<SpeechSynthesisVoice | null>(null);

  // Settles the promise speak() returned: the line finished, was cut off, or failed.
  const waiter = useRef<(() => void) | null>(null);
  const release = useCallback(() => {
    const done = waiter.current;
    waiter.current = null;
    done?.();
  }, []);

  const halt = useCallback(() => {
    const a = audio.current;
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    release();
  }, [release]);

  useEffect(() => {
    try {
      if (localStorage.getItem(MUTE_KEY) === "1") {
        mutedRef.current = true;
        setMuted(true);
      }
    } catch {}
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    if (synth) {
      const load = () => {
        const list = synth.getVoices();
        if (list.length) fallback.current = pickBestFallbackVoice(list);
      };
      load();
      synth.onvoiceschanged = load;
    }
    return () => {
      run.current++;
      halt();
      if (synth) synth.onvoiceschanged = null;
    };
  }, [halt]);

  const stop = useCallback(() => {
    run.current++;
    halt();
    setSpeaking(false);
  }, [halt]);

  // Call from a tap (Dial, Say it): stops whatever is playing and unlocks audio.
  const prime = useCallback(() => {
    stop();
    const a = audio.current ?? (audio.current = new Audio());
    a.src = SILENT_WAV;
    void a.play().catch(() => {});
  }, [stop]);

  // A new call: forget which voice went to whom.
  const begin = useCallback(() => {
    voices.current.clear();
    prime();
  }, [prime]);

  const voiceFor = (speaker?: string) => {
    const key = personKey(speaker);
    let voice = voices.current.get(key);
    if (!voice) {
      const n = voices.current.size;
      const set = preferredRef.current;
      voice = n === 0 && set ? set.answerer : n === 1 && set ? set.decisionMaker : CALL_VOICES[n % CALL_VOICES.length];
      voices.current.set(key, voice);
    }
    return voice;
  };

  // Speaks a line. The promise it returns settles when the line has finished (or
  // was cut off, or couldn't be spoken), so a caller can wait before the next one.
  // voiceId overrides the voice picked for this speaker (the Virtual Salesperson has its own).
  const speak = useCallback(
    async (text: string, speaker?: string, force = false, voiceId?: string) => {
      const clean = speakable(text);
      if (!clean || (mutedRef.current && !force)) return;
      const id = ++run.current;
      const alive = () => run.current === id;
      halt();
      setSpeaking(true);
      const done = new Promise<void>((resolve) => {
        waiter.current = resolve;
      });
      const finish = () => {
        if (!alive()) return;
        setSpeaking(false);
        release();
      };

      const browser = () => {
        if (!("speechSynthesis" in window)) return finish();
        const utter = new SpeechSynthesisUtterance(clean);
        if (fallback.current) utter.voice = fallback.current;
        utter.rate = 1.02;
        utter.onend = utter.onerror = finish;
        window.speechSynthesis.speak(utter);
      };

      try {
        const voice = voiceId ?? voiceFor(speaker);
        const clipKey = `${voice}|${clean}`;
        let clip = clips.current.get(clipKey);
        if (!clip) {
          const res = await authedPost("/api/tts", { text: clean, voice, purpose: "roleplay" });
          if (!res.ok) throw new Error("tts request failed");
          clip = (await res.json()).audioContent as string | undefined;
          if (!clip) throw new Error("no audio returned");
          clips.current.set(clipKey, clip);
        }
        if (!alive()) return;
        const a = audio.current ?? (audio.current = new Audio());
        a.onended = finish;
        a.onerror = () => {
          if (alive()) browser();
        };
        a.src = `data:audio/mp3;base64,${clip}`;
        await a.play();
      } catch {
        if (alive()) browser();
      }
      await done;
    },
    [halt, release],
  );

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {}
    if (next) stop();
  }, [stop]);

  return { muted, speaking, speak, stop, prime, begin, toggleMute };
}
