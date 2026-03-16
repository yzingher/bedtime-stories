"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

const MAGICAL_FRIENDS = [
  { id: "talking-bunny", label: "Talking bunny", emoji: "🐰" },
  { id: "tiny-fairy", label: "Tiny fairy", emoji: "🧚" },
  { id: "friendly-robot", label: "Friendly robot", emoji: "🤖" },
  { id: "baby-dinosaur", label: "Baby dinosaur", emoji: "🦕" },
];

const PLACES = [
  { id: "enchanted-forest", label: "Enchanted forest", emoji: "🌳" },
  { id: "underwater-kingdom", label: "Underwater kingdom", emoji: "🌊" },
  { id: "candy-land", label: "Candy land", emoji: "🍭" },
  { id: "outer-space", label: "Outer space", emoji: "🚀" },
  { id: "snowy-mountain", label: "Snowy mountain", emoji: "🏔️" },
  { id: "magical-library", label: "Magical library", emoji: "📚" },
];

const PROBLEMS = [
  { id: "find-lost-treasure", label: "Find a lost treasure", emoji: "💎" },
  { id: "help-sad-cloud", label: "Help a sad cloud", emoji: "☁️" },
  { id: "save-the-rainbow", label: "Save the rainbow", emoji: "🌈" },
  { id: "build-a-rocket", label: "Build a rocket", emoji: "🚀" },
  { id: "wake-sleeping-giant", label: "Wake a sleeping giant", emoji: "👾" },
  { id: "return-stolen-cookie", label: "Return a stolen cookie", emoji: "🍪" },
];

const STEPS = ["Magical Friend", "Place", "Problem"];

type Choice = { id: string; label: string; emoji: string };

interface WizardState {
  friend: Choice | null;
  place: Choice | null;
  problem: Choice | null;
}

function playerConfig(player: string | null) {
  if (player === "lila") {
    return { name: "Lila", emoji: "🦋", color: "#a855f7" };
  }
  return { name: "Max", emoji: "🦁", color: "#f97316" };
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((_, i) => (
        <div key={i} className="flex-1">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              background:
                i < step
                  ? "#ffd700"
                  : i === step
                  ? "rgba(255,215,0,0.5)"
                  : "rgba(255,255,255,0.15)",
            }}
          />
        </div>
      ))}
      <span className="text-sm font-bold ml-1 shrink-0" style={{ color: "#ffd700" }}>
        {step + 1}/3
      </span>
    </div>
  );
}

function SummaryBar({ choices }: { choices: WizardState }) {
  const items = [
    choices.friend && { label: choices.friend.label, emoji: choices.friend.emoji },
    choices.place && { label: choices.place.label, emoji: choices.place.emoji },
    choices.problem && { label: choices.problem.label, emoji: choices.problem.emoji },
  ].filter(Boolean) as { label: string; emoji: string }[];

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2 mb-6 p-3 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.07)" }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
          style={{ background: "rgba(255,215,0,0.12)", color: "#ffd700" }}
        >
          {item.emoji} {item.label}
        </span>
      ))}
    </div>
  );
}

function ChoiceButton({
  emoji,
  label,
  onSelect,
}: {
  emoji: string;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="rounded-3xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 w-full font-bold text-lg cursor-pointer"
      style={{
        background: "rgba(48,43,99,0.7)",
        border: "2px solid rgba(255,215,0,0.2)",
        color: "#f0f0f0",
        minHeight: "120px",
        padding: "1.5rem",
      }}
    >
      <span className="text-5xl leading-none">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function ConfirmationScreen({
  player,
  choices,
  onMakeStory,
}: {
  player: string;
  choices: WizardState;
  onMakeStory: () => void;
}) {
  const config = playerConfig(player);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2
        className="text-3xl font-extrabold text-center"
        style={{ color: "#ffd700" }}
      >
        {config.emoji} {config.name}&apos;s Adventure!
      </h2>
      <p className="text-white/70 text-center text-lg">Here&apos;s what we picked:</p>

      <div
        className="rounded-3xl p-6 w-full flex flex-col gap-4"
        style={{ background: "rgba(48,43,99,0.8)", border: "2px solid rgba(255,215,0,0.3)" }}
      >
        {[
          { stepLabel: "Magical Friend", choice: choices.friend },
          { stepLabel: "Place", choice: choices.place },
          { stepLabel: "Adventure", choice: choices.problem },
        ].map(({ stepLabel, choice }) =>
          choice ? (
            <div key={stepLabel} className="flex items-center gap-4">
              <span className="text-4xl">{choice.emoji}</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {stepLabel}
                </div>
                <div className="text-xl font-bold text-white">{choice.label}</div>
              </div>
            </div>
          ) : null
        )}
      </div>

      <button
        onClick={onMakeStory}
        className="rounded-3xl w-full font-extrabold text-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)",
          color: "#0f0c29",
          minHeight: "72px",
          padding: "1rem 2rem",
        }}
      >
        Make my story! ✨
      </button>
    </div>
  );
}

function BuildWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player = searchParams.get("player") || "max";
  const config = playerConfig(player);

  const [step, setStep] = useState(0); // 0=friend, 1=place, 2=problem, 3=confirm
  const [choices, setChoices] = useState<WizardState>({
    friend: null,
    place: null,
    problem: null,
  });

  function goBack() {
    if (step === 0) {
      router.push("/");
    } else {
      setStep((s) => s - 1);
    }
  }

  function selectFriend(choice: Choice) {
    setChoices((c) => ({ ...c, friend: choice }));
    setStep(1);
  }

  function selectPlace(choice: Choice) {
    setChoices((c) => ({ ...c, place: choice }));
    setStep(2);
  }

  function selectProblem(choice: Choice) {
    setChoices((c) => ({ ...c, problem: choice }));
    setStep(3);
  }

  function makeStory() {
    if (!choices.friend || !choices.place || !choices.problem) return;
    const params = new URLSearchParams({
      player,
      friend: choices.friend.label,
      place: choices.place.label,
      problem: choices.problem.label,
    });
    router.push(`/generating?${params.toString()}`);
  }

  return (
    <main className="min-h-full flex flex-col items-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className="rounded-2xl px-4 font-bold text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#f0f0f0",
              minHeight: "44px",
            }}
          >
            ← Back
          </button>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            <span className="font-extrabold text-xl" style={{ color: config.color }}>
              {config.name}&apos;s Story
            </span>
          </div>
        </div>

        {/* Progress bar (only during steps 0–2) */}
        {step < 3 && <ProgressBar step={step} />}

        {/* Summary bar (shows previous choices) */}
        <SummaryBar choices={choices} />

        {/* Step content */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center mb-6" style={{ color: "#ffd700" }}>
              Who&apos;s your magical friend? 🌟
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {MAGICAL_FRIENDS.map((f) => (
                <ChoiceButton key={f.id} emoji={f.emoji} label={f.label} onSelect={() => selectFriend(f)} />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center mb-6" style={{ color: "#ffd700" }}>
              Where does the adventure happen? 🗺️
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {PLACES.map((p) => (
                <ChoiceButton key={p.id} emoji={p.emoji} label={p.label} onSelect={() => selectPlace(p)} />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold text-center mb-6" style={{ color: "#ffd700" }}>
              What&apos;s the big adventure? ⚡
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {PROBLEMS.map((p) => (
                <ChoiceButton key={p.id} emoji={p.emoji} label={p.label} onSelect={() => selectProblem(p)} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <ConfirmationScreen player={player} choices={choices} onMakeStory={makeStory} />
        )}
      </div>
    </main>
  );
}

export default function BuildPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex items-center justify-center">
          <p style={{ color: "#ffd700" }} className="text-2xl font-bold">
            Loading… ✨
          </p>
        </div>
      }
    >
      <BuildWizard />
    </Suspense>
  );
}
