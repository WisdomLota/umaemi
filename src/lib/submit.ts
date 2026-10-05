export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Sends a form to /api/submit, which emails it on. */
export async function submitForm(
  form: "contact" | "join" | "consultation",
  data: Record<string, string | string[]>,
  company = ""
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, data, company }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.error ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "You seem to be offline. Please try again." };
  }
}
