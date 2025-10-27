'use client';

import { PlanDisplay } from "@/components/PlanDisplay";
import type { ShortPlan } from "@/lib/types";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
  Wand2
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type FormState = {
  topic: string;
  audience: string;
  tone: string;
  goal: string;
  duration: string;
  platformFocus: string;
  includeCaptions: boolean;
  includeBroll: boolean;
};

const toneOptions = [
  "Energetic hype",
  "Inspirational mentor",
  "Deadpan humor",
  "Authoritative",
  "Story-driven cinematic"
];

const goalOptions = [
  "Drive channel subscriptions",
  "Promote product awareness",
  "Grow newsletter signups",
  "Boost course enrollment",
  "Spark viral conversation"
];

const durationOptions = ["30 seconds", "45 seconds", "60 seconds", "75 seconds"];

const platforms = [
  "YouTube Shorts",
  "Instagram Reels",
  "TikTok",
  "Facebook Reels"
];

const formDefaults: FormState = {
  topic: "How to double your YouTube editing speed without losing quality",
  audience: "Solo content creators and editors",
  tone: toneOptions[0],
  goal: goalOptions[0],
  duration: durationOptions[1],
  platformFocus: platforms[0],
  includeCaptions: true,
  includeBroll: true
};

const presets: Array<Partial<FormState> & { label: string }> = [
  {
    label: "Creator acceleration",
    topic: "3 hooks to instantly increase retention on Shorts",
    audience: "Creators stuck at 1-10k subscribers",
    tone: "Energetic hype",
    goal: "Drive channel subscriptions"
  },
  {
    label: "Product drop",
    topic: "Launch teaser for AI-powered note-taking app",
    audience: "Busy tech professionals",
    tone: "Story-driven cinematic",
    goal: "Promote product awareness"
  },
  {
    label: "Education viral",
    topic: "Explain quantum computing using coffee shop analogies",
    audience: "Curious lifelong learners",
    tone: "Inspirational mentor",
    goal: "Spark viral conversation"
  }
];

export default function HomePage() {
  const [apiKey, setApiKey] = useState("");
  const [form, setForm] = useState<FormState>(formDefaults);
  const [plan, setPlan] = useState<ShortPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedKey = window.localStorage.getItem("shortforge_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (apiKey) {
      window.localStorage.setItem("shortforge_api_key", apiKey);
    } else {
      window.localStorage.removeItem("shortforge_api_key");
    }
  }, [apiKey]);

  const handleToggle = (field: keyof Pick<FormState, "includeBroll" | "includeCaptions">) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.topic.trim() &&
          form.audience.trim() &&
          form.goal.trim() &&
          apiKey.trim()
      ),
    [form, apiKey]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          apiKey: apiKey.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to generate plan");
      }

      const data = (await response.json()) as { plan: ShortPlan };
      setPlan(data.plan);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...preset }));
  };

  const handleReset = () => {
    setForm(formDefaults);
    setPlan(null);
    setError(null);
  };

  return (
    <main className="w-full px-6 pb-24 pt-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="grid gap-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            <Sparkles className="h-4 w-4 text-accent-soft" /> ShortForge Agent
          </div>
          <motion.h1
            className="font-display text-4xl leading-tight md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Design YouTube Shorts that hook audiences in the first second
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-slate-300"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          >
            Feed the agent your topic and creative direction. ShortForge orchestrates
            an entire short — scripting, on-screen pacing, camera blocking, and
            algorithm-aware packaging — ready to shoot today.
          </motion.p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr]">
          <motion.section
            className="glass-panel w-full rounded-3xl border border-white/5 p-[1px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-[calc(1.5rem-2px)] bg-slate-950/80 p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl">Creative brief</h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-slate-300 transition hover:border-white/25 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              <div className="mt-6 grid gap-6">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-200">OpenAI API key</span>
                  <div className="relative">
                    <input
                      value={apiKey}
                      onChange={(event) => setApiKey(event.target.value)}
                      required
                      type="password"
                      placeholder="sk-..."
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                    />
                    <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Your key stays in your browser and is only used for this request.
                  </p>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-200">Topic / idea</span>
                  <textarea
                    value={form.topic}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, topic: event.target.value }))
                    }
                    required
                    rows={3}
                    placeholder="Tell the agent what you want to make..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-200">Audience</span>
                    <input
                      value={form.audience}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          audience: event.target.value
                        }))
                      }
                      required
                      placeholder="e.g. Solo travel vloggers"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-200">Goal</span>
                    <select
                      value={form.goal}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, goal: event.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                    >
                      {goalOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-200">Tone</span>
                    <select
                      value={form.tone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, tone: event.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                    >
                      {toneOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-200">Runtime target</span>
                    <select
                      value={form.duration}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          duration: event.target.value
                        }))
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                    >
                      {durationOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-200">Platform focus</span>
                    <select
                      value={form.platformFocus}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          platformFocus: event.target.value
                        }))
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                    >
                      {platforms.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Enhancements
                  </span>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TogglePill
                      active={form.includeCaptions}
                      onClick={() => handleToggle("includeCaptions")}
                      label="Kinetic captions"
                      description="Mark where dynamic captions should pop to emphasize beats."
                    />
                    <TogglePill
                      active={form.includeBroll}
                      onClick={() => handleToggle("includeBroll")}
                      label="B-roll scouting"
                      description="Suggest relevant cutaways and transitions for extra polish."
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Quick presets
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePreset(preset)}
                        className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-accent-soft hover:text-white"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className={clsx(
                    "group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-slate-950 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40",
                    "hover:-translate-y-0.5"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="h-5 w-5" />
                  )}
                  {loading ? "Crafting beat sheet..." : "Generate short blueprint"}
                </button>
              </div>
            </form>
          </motion.section>

          <aside className="flex flex-col gap-6">
            <motion.div
              className="glass-panel rounded-3xl border border-white/5 p-[1px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <div className="rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/40 p-8">
                <h3 className="font-display text-xl">How the agent thinks</h3>
                <ul className="mt-5 grid gap-4 text-sm text-slate-300">
                  <FeatureItem
                    title="Viral hook testing"
                    description="Scores multiple hook angles in parallel before locking the winner."
                  />
                  <FeatureItem
                    title="Beat-by-beat blocking"
                    description="Maps narration, motion design, and camera framing for every moment."
                  />
                  <FeatureItem
                    title="Algorithm-aware packaging"
                    description="Optimizes CTA, captions, and hashtags for Shorts discoverability."
                  />
                </ul>
              </div>
            </motion.div>

            <AnimatePresence>
              {plan ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-3xl border border-success/20 bg-success/10 p-6 text-sm text-success"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Your short is storyboarded. Scroll to explore the blueprint.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 text-sm text-slate-300"
                >
                  <div className="flex items-center gap-3 text-slate-200">
                    <Sparkles className="h-5 w-5 text-accent-soft" />
                    <span>Drop your API key and brief to synthesize a ready-to-shoot short.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto flex w-full max-w-2xl items-center gap-4 rounded-3xl border border-white/5 bg-slate-950/70 px-6 py-4 text-sm text-slate-300"
            >
              <Loader2 className="h-5 w-5 animate-spin text-accent-soft" />
              Summoning hook structures, pacing, and visual direction...
            </motion.div>
          )}
        </AnimatePresence>

        {plan && <PlanDisplay plan={plan} />}
      </section>
    </main>
  );
}

interface TogglePillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
}

function TogglePill({ active, onClick, label, description }: TogglePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex h-full flex-col items-start gap-2 rounded-2xl border px-4 py-4 text-left",
        active
          ? "border-accent-soft bg-accent/10 text-white"
          : "border-white/10 bg-slate-900/50 text-slate-300 hover:border-accent-soft/60 hover:text-white"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Wand2 className="h-4 w-4" /> {label}
      </span>
      <span className="text-xs text-slate-400">{description}</span>
    </button>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <li className="rounded-2xl border border-white/5 bg-slate-950/50 p-5">
      <h4 className="font-semibold text-slate-100">{title}</h4>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </li>
  );
}
