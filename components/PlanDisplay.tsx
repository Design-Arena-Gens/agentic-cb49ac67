'use client';

import type { ShortPlan } from "@/lib/types";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Hash,
  Megaphone,
  Sparkles,
  Video
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface PlanDisplayProps {
  plan: ShortPlan;
}

export function PlanDisplay({ plan }: PlanDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const beatsText = useMemo(
    () =>
      plan.beats
        .map(
          (beat) =>
            `${beat.timestamp} — Narration: ${beat.narration}\nVisual: ${beat.visual}`
        )
        .join("\n\n"),
    [plan.beats]
  );

  const fullText = useMemo(
    () =>
      `Title: ${plan.title}\nHook: ${plan.hook}\nSummary: ${plan.summary}\nPacing: ${plan.pacing}\n\nBeats:\n${beatsText}\n\nCTA: ${plan.cta}\nHashtags: ${plan.hashtags.join(", ")}\nDistribution tips:\n- ${plan.distributionTips.join("\n- ")}`,
    [plan, beatsText]
  );

  const handleCopy = useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2200);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  }, []);

  return (
    <section className="glass-panel glow-ring w-full max-w-5xl rounded-3xl border border-white/5 p-[1px]">
      <div className="rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-950/30 p-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-accent-soft" /> Short blueprint ready
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">{plan.title}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">{plan.summary}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy("script", beatsText)}
              className={clsx(
                "flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-medium transition-colors",
                copied === "script" && "border-accent-soft text-accent-soft"
              )}
            >
              {copied === "script" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Beat sheet
            </button>
            <button
              onClick={() => handleCopy("full", fullText)}
              className={clsx(
                "flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black shadow-lg transition-transform hover:-translate-y-0.5",
                copied === "full" && "bg-success text-slate-950"
              )}
            >
              {copied === "full" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Full export
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard title="Hook" icon={Sparkles}>
            {plan.hook}
          </InfoCard>
          <InfoCard title="Pacing notes" icon={Video}>
            {plan.pacing}
          </InfoCard>
          <InfoCard title="CTA" icon={Megaphone}>
            {plan.cta}
          </InfoCard>
          <InfoCard title="Hashtags" icon={Hash}>
            <div className="flex flex-wrap gap-2">
              {plan.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                >
                  #{tag.replace(/^#/u, "")}
                </span>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-display text-xl">Beat-by-beat direction</h3>
          <p className="text-sm text-slate-400">
            Timestamped narration with visual blocking suggestions for your short.
          </p>
          <div className="grid gap-4">
            <AnimatePresence>
              {plan.beats.map((beat) => (
                <motion.div
                  key={beat.timestamp + beat.narration.slice(0, 8)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-2xl border border-white/5 bg-slate-950/80 p-5 shadow-inner shadow-black/10"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                        {beat.timestamp}
                      </div>
                      <p className="mt-3 font-medium text-slate-100">
                        {beat.narration}
                      </p>
                    </div>
                    <div className="rounded-xl border border-purple-500/10 bg-purple-900/10 p-4 text-sm text-purple-100">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-purple-300">
                        Visual direction
                      </span>
                      <p className="mt-1 text-purple-100/90">{beat.visual}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/5 bg-slate-950/60 p-6">
          <h3 className="font-display text-xl">Distribution tactics</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            {plan.distributionTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-accent" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}

function InfoCard({ title, children, icon: Icon }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-6">
      <div className="flex items-center gap-3 text-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80">
          <Icon className="h-5 w-5 text-accent-soft" />
        </div>
        <h3 className="font-semibold uppercase tracking-wide text-xs text-slate-400">
          {title}
        </h3>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-slate-200">
        {children}
      </div>
    </div>
  );
}
