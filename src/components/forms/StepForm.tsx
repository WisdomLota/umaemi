"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import SubHeader from "@/components/layout/SubHeader";
import Button from "@/components/ui/Button";
import CornerDot from "@/components/ui/CornerDot";
import DiamondAnchor from "@/components/three/DiamondAnchor";
import { DiamondPiece } from "@/components/three/HeroDiamond";
import { burstDiamond, kickDiamond } from "@/components/three/diamond-bus";
import SchedulePicker, { DEFAULT_TIMEZONE, formatDate, Schedule } from "./SchedulePicker";
import { gsap, SplitText, EASE } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/media";
import { submitForm } from "@/lib/submit";
import type { Flow, Step } from "@/lib/flows";

// The stepper reuses the four brand corners, in the order they turn.
const STEPPER_ROT = ["rotate-0", "rotate-90", "rotate-180", "-rotate-90"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Values = Record<string, string | string[]>;

const fieldClass =
  "w-full bg-transparent border border-dark corner [--r:1.25rem] px-5 py-4 font-mono text-base text-dark placeholder:text-dark/50 focus:outline-none focus-visible:border-burnt focus-visible:shadow-[0_0_0_3px_rgba(229,65,0,0.18)] transition-[border-color,box-shadow]";

function validate(step: Step, values: Values, schedule: Schedule): string | null {
  if (step.kind === "fields") {
    const missing = step.fields.find((f) => f.required && !String(values[f.name] ?? "").trim());
    if (missing) return `Please fill in your ${missing.placeholder.toLowerCase()}.`;
    const email = String(values.email ?? "");
    if (email && !EMAIL.test(email)) return "Please enter a valid email address.";
  }
  if (step.kind === "choice") {
    const v = values[step.name];
    if (!v || (Array.isArray(v) && v.length === 0)) return "Please choose an option.";
  }
  if (step.kind === "schedule") {
    if (!schedule.hour || !schedule.minute) return "Please choose a time.";
    if (!schedule.date) return "Please choose a date.";
  }
  return null;
}

export default function StepForm({ flow, back }: { flow: Flow; back: string }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [schedule, setSchedule] = useState<Schedule>({ hour: "", minute: "", timezone: DEFAULT_TIMEZONE, date: "" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [company, setCompany] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const current = flow.steps[step];
  const last = step === flow.steps.length - 1;

  // Each step arrives the same way: the title rises letter by letter and the
  // controls follow in a quick cascade. The diamond piece turns over with it.
  useEffect(() => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    // A context reverts cleanly, so an interrupted entrance never leaves
    // controls stuck invisible.
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-step-title]");
      split = title ? SplitText.create(title, { type: "lines,words,chars", mask: "lines" }) : null;
      const tl = gsap.timeline();
      if (split) tl.from(split.chars, { yPercent: 110, duration: 1, ease: EASE.out, stagger: 0.018 });
      tl.from("[data-step-item]", { y: 28, autoAlpha: 0, duration: 0.8, ease: EASE.out, stagger: 0.06 }, 0.15);
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [step, status]);

  const go = (next: number) => {
    setError(null);
    setStep(next);
    kickDiamond(next > step ? 1.6 : -1.6);
    window.__lenis?.scrollTo(0, { duration: 0.8 });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validate(current, values, schedule);
    if (problem) {
      setError(problem);
      gsap.fromTo(panel.current, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      return;
    }
    if (!last) return go(step + 1);

    setStatus("sending");
    const data: Values = { ...values };
    if (flow.steps.some((s) => s.kind === "schedule")) {
      data.date = formatDate(schedule.date);
      data.time = `${schedule.hour}:${schedule.minute}`;
      data.timezone = schedule.timezone;
    }
    const result = await submitForm(flow.id, data, company);
    if (result.ok) {
      setStatus("done");
      burstDiamond();
    } else {
      setStatus("idle");
      setError(result.error);
    }
  };

  const setValue = (name: string, v: string | string[]) => setValues((prev) => ({ ...prev, [name]: v }));
  const toggle = (name: string, option: string, multiple?: boolean) => {
    if (!multiple) return setValue(name, option);
    const list = Array.isArray(values[name]) ? (values[name] as string[]) : [];
    setValue(name, list.includes(option) ? list.filter((o) => o !== option) : [...list, option]);
  };

  return (
    <div data-world="peach" className="relative min-h-svh bg-peach text-dark overflow-hidden">
      <SubHeader label={flow.label} back={back} onBack={step > 0 && status !== "done" ? () => go(step - 1) : undefined} />

      <div className="relative min-h-svh grid md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.4fr)] items-center gap-8 md:gap-14 lg:gap-20 px-6 md:pl-0 md:pr-16 pt-32 pb-16">
        {/* one piece of the diamond holds the left edge, cut off by the page */}
        <div className="flex justify-end md:block pointer-events-none -mb-4 md:mb-0">
          <DiamondAnchor
            id="form-piece"
            solo={1}
            color="#460E04"
            tilt={0.5}
            className="h-[15vh] md:h-[64vh] max-h-160 aspect-469/439 md:-ml-[14vw]"
            fallback={<DiamondPiece index={1} />}
          />
        </div>

        {/* stepper: four corners, the current one lit */}
        <ol className="relative flex md:flex-col gap-6 md:gap-12" aria-label="Progress">
          {flow.steps.map((s, i) => {
            const state = status === "done" || i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li key={s.title}>
                <button
                  type="button"
                  disabled={i >= step || status === "done"}
                  onClick={() => go(i)}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  aria-current={state === "current" ? "step" : undefined}
                  className="block p-1 disabled:cursor-default"
                >
                  <CornerDot
                    className={`${STEPPER_ROT[i]} w-8 h-8 transition-[color,transform] duration-700 ease-out-expo ${
                      state === "current" ? "text-burnt scale-125" : state === "done" ? "text-dark" : "text-dark/80"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ol>

        <div ref={panel} className="relative w-full max-w-2xl">
          {status === "done" ? (
            <div key="done" className="flex flex-col gap-8">
              <h1 data-step-title className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em]">
                Thank you
              </h1>
              <p data-step-item className="font-mono text-base text-dark/80 leading-relaxed max-w-lg">
                We&apos;ve received your details and will be in touch soon.
              </p>
              <div data-step-item>
                <Button href="/">Back to Home</Button>
              </div>
            </div>
          ) : (
            <form key={step} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
              <h1 data-step-title className="font-sans font-medium text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-4">
                {current.title}
              </h1>

              {/* honeypot — hidden from people, irresistible to bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="absolute -left-[9999px] w-px h-px opacity-0"
                aria-hidden
              />

              {current.kind === "fields" &&
                current.fields.map((f) => (
                  <input
                    key={f.name}
                    data-step-item
                    type={f.type ?? "text"}
                    name={f.name}
                    aria-label={f.placeholder}
                    placeholder={f.placeholder}
                    required={f.required}
                    autoComplete={f.name === "fullName" ? "name" : f.name === "email" ? "email" : f.name === "businessName" ? "organization" : "off"}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    className={fieldClass}
                  />
                ))}

              {current.kind === "choice" && (
                <div role="group" aria-label={current.title} className="flex flex-col gap-5">
                  {current.options.map((option) => {
                    const v = values[current.name];
                    const selected = Array.isArray(v) ? v.includes(option) : v === option;
                    return (
                      <button
                        key={option}
                        data-step-item
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggle(current.name, option, current.multiple)}
                        className={`group/opt flex items-center gap-6 w-full text-left border border-dark corner [--r:1.25rem] px-5 py-4 font-mono text-base transition-colors duration-300 ${
                          selected ? "bg-tangerine" : "hover:bg-tangerine/25"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`w-3.5 h-3.5 rounded-full bg-dark shrink-0 transition-transform duration-500 ease-out-expo ${
                            selected ? "scale-125" : "group-hover/opt:scale-110"
                          }`}
                        />
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {current.kind === "schedule" && <SchedulePicker value={schedule} onChange={setSchedule} />}

              {current.kind === "message" && (
                <textarea
                  data-step-item
                  rows={7}
                  name={current.name}
                  aria-label={current.placeholder}
                  placeholder={current.placeholder}
                  value={String(values[current.name] ?? "")}
                  onChange={(e) => setValue(current.name, e.target.value)}
                  className={`${fieldClass} resize-none`}
                  data-lenis-prevent
                />
              )}

              <p role="alert" className="min-h-5 font-mono text-sm text-burnt">
                {error}
              </p>

              <div data-step-item>
                <Button type="submit" className="max-w-none" wrapperClassName="max-w-none" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : last ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
