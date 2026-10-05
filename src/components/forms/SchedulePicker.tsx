"use client";

import { useMemo, useState } from "react";

export type Schedule = { hour: string; minute: string; timezone: string; date: string };

const TIMEZONES = [
  "GMT-08:00 - Pacific Time (US & Canada)",
  "GMT-07:00 - Mountain Time (US & Canada)",
  "GMT-06:00 - Central Time (US & Canada)",
  "GMT-05:00 - Eastern Time (US & Canada)",
  "GMT-03:00 - Brasília / Buenos Aires",
  "GMT+00:00 - London / Accra / UTC",
  "GMT+01:00 - West Africa / Central European Time",
  "GMT+02:00 - South Africa / Eastern European Time",
  "GMT+03:00 - East Africa / Moscow / Riyadh",
  "GMT+04:00 - Dubai",
  "GMT+05:30 - India",
  "GMT+08:00 - Singapore / Hong Kong",
  "GMT+09:00 - Tokyo / Seoul",
  "GMT+10:00 - Sydney",
];

export const DEFAULT_TIMEZONE = TIMEZONES[6];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Weekdays of a month laid out Mon–Fri, with blanks before the first. */
function weekdayGrid(year: number, month: number) {
  const cells: (Date | null)[] = [];
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  for (let i = 0; i < Math.min(lead, 5); i++) cells.push(null);
  for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    if (dow !== 0 && dow !== 6) cells.push(date);
  }
  return cells;
}

function Chevron({ dir }: { dir: "left" | "right" | "down" }) {
  const rot = dir === "left" ? "rotate-180" : dir === "down" ? "rotate-90" : "";
  return (
    <svg viewBox="0 0 12 20" className={`w-3 h-5 ${rot}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 2l8 8-8 8" />
    </svg>
  );
}

const box =
  "w-full bg-transparent border border-dark corner [--r:1.25rem] px-5 py-4 font-mono text-base text-dark placeholder:text-dark/50 focus:outline-none focus-visible:border-burnt focus-visible:shadow-[0_0_0_3px_rgba(229,65,0,0.18)] transition-[border-color,box-shadow]";

export default function SchedulePicker({ value, onChange }: { value: Schedule; onChange: (v: Schedule) => void }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const cells = weekdayGrid(view.y, view.m);
  const atStart = view.y === today.getFullYear() && view.m === today.getMonth();
  const set = (patch: Partial<Schedule>) => onChange({ ...value, ...patch });
  const shift = (n: number) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const digits = (v: string, max: number) => {
    const n = v.replace(/\D/g, "").slice(0, 2);
    return n && Number(n) > max ? String(max) : n;
  };

  return (
    <div className="flex flex-col gap-6">
      <div data-step-item className="flex items-center gap-4 md:gap-8">
        <input
          aria-label="Hour (24-hour)"
          inputMode="numeric"
          placeholder="HH"
          value={value.hour}
          onChange={(e) => set({ hour: digits(e.target.value, 23) })}
          onBlur={() => value.hour && set({ hour: value.hour.padStart(2, "0") })}
          className={box}
        />
        <span aria-hidden className="font-mono text-2xl text-dark">:</span>
        <input
          aria-label="Minute"
          inputMode="numeric"
          placeholder="MM"
          value={value.minute}
          onChange={(e) => set({ minute: digits(e.target.value, 59) })}
          onBlur={() => value.minute && set({ minute: value.minute.padStart(2, "0") })}
          className={box}
        />
      </div>

      <div data-step-item className="relative">
        <select
          aria-label="Timezone"
          value={value.timezone}
          onChange={(e) => set({ timezone: e.target.value })}
          className={`${box} appearance-none pr-14 cursor-pointer`}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-dark">
          <Chevron dir="down" />
        </span>
      </div>

      <div data-step-item className="border border-dark corner [--r:1.25rem] px-5 md:px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-base font-medium text-dark" aria-live="polite">
            {MONTHS[view.m]}
            {view.y !== today.getFullYear() ? ` ${view.y}` : ""}
          </span>
          <div className="flex items-center gap-2 text-dark">
            <button
              type="button"
              onClick={() => shift(-1)}
              disabled={atStart}
              aria-label="Previous month"
              className="p-2 disabled:opacity-0 transition-opacity"
            >
              <Chevron dir="left" />
            </button>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="p-2">
              <Chevron dir="right" />
            </button>
          </div>
        </div>
        <div role="grid" aria-label="Choose a date" className="grid grid-cols-5 gap-y-2 text-center font-mono text-sm md:text-base">
          {DAYS.map((d) => (
            <span key={d} className="text-dark pb-2">
              {d}
            </span>
          ))}
          {cells.map((date, i) => {
            if (!date) return <span key={`b${i}`} />;
            const disabled = date <= today;
            const selected = value.date === iso(date);
            return (
              <button
                key={iso(date)}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={date.toDateString()}
                onClick={() => set({ date: iso(date) })}
                className={`mx-auto w-11 h-11 flex items-center justify-center transition-colors duration-300 ${
                  selected
                    ? "bg-tangerine text-dark"
                    : disabled
                      ? "text-dark/30 cursor-not-allowed"
                      : "text-dark hover:bg-tangerine/30"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toDateString();
}
