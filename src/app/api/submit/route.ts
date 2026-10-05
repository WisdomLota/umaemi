// Receives every form on the site (contact, network sign-up, consultation
// booking) and forwards it by email through Resend.
//
// Configure in .env.local:
//   RESEND_API_KEY   required
//   SUBMISSIONS_TO   where submissions go (defaults to the address below)
//   RESEND_FROM      verified sender, e.g. "Umaemi <hello@umaemi.com>"

const DEFAULT_TO = "wisdomlotachukwu@gmail.com";
const DEFAULT_FROM = "Umaemi Website <onboarding@resend.dev>";

const FORMS = {
  contact: "Reach Out message",
  join: "Umaemi Network application",
  consultation: "Consultation booking",
} as const;

type FormId = keyof typeof FORMS;

const LABELS: Record<string, string> = {
  fullName: "Full Name",
  email: "Email",
  businessName: "Business Name",
  productOrService: "Product or Service",
  website: "Website or Social Media",
  involvement: "How they'd like to be involved",
  interests: "Areas of interest",
  helpWith: "Looking for help with",
  date: "Preferred date",
  time: "Preferred time",
  timezone: "Timezone",
  message: "Message",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escape = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: { form?: string; data?: Record<string, unknown>; company?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "company" field.
  if (body.company) return Response.json({ ok: true });

  const form = body.form as FormId;
  if (!form || !(form in FORMS)) return Response.json({ error: "Unknown form." }, { status: 400 });

  // Keep only known fields, as trimmed strings, within sane lengths.
  const fields: [string, string][] = [];
  for (const [key, raw] of Object.entries(body.data ?? {})) {
    if (!(key in LABELS)) continue;
    const value = Array.isArray(raw) ? raw.map(String).join(", ") : String(raw ?? "");
    const trimmed = value.trim().slice(0, 5000);
    if (trimmed) fields.push([key, trimmed]);
  }
  const get = (k: string) => fields.find(([key]) => key === k)?.[1] ?? "";

  const email = get("email");
  if (!EMAIL.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (form !== "contact" && !get("fullName")) return Response.json({ error: "Please tell us your name." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY is not set");
    return Response.json({ error: "Email is not configured yet." }, { status: 500 });
  }

  const who = get("fullName") || email;
  const subject = `${FORMS[form]} — ${who}`;
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 16px 10px 0;color:#7F2400;font:500 12px monospace;vertical-align:top;white-space:nowrap">${escape(
          LABELS[k]
        )}</td><td style="padding:10px 0;color:#110402;font:14px/1.5 sans-serif;white-space:pre-wrap">${escape(v)}</td></tr>`
    )
    .join("");
  const html = `<div style="background:#FFF5EC;padding:32px"><div style="max-width:620px;margin:auto;background:#fff;border-radius:16px 0 16px 0;padding:28px;border-top:6px solid #E54100"><h2 style="margin:0 0 20px;color:#460E04;font:600 20px sans-serif">${escape(
    FORMS[form]
  )}</h2><table style="border-collapse:collapse;width:100%">${rows}</table></div></div>`;
  const text = `${FORMS[form]}\n\n${fields.map(([k, v]) => `${LABELS[k]}: ${v}`).join("\n")}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: [process.env.SUBMISSIONS_TO || DEFAULT_TO],
      reply_to: email,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return Response.json({ error: "We couldn't send that just now. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
