"use client";

import { useState } from "react";
import SendIcon from "@/components/ui/SendIcon";
import Reveal from "@/components/ui/Reveal";

export default function ReachOut() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, message });
  };

  return (
    <section id="contact" className="px-6 sm:px-10 md:px-16 py-16">
      <Reveal className="max-w-6xl mx-auto">
      <div className="bg-dark rounded-tl-3xl rounded-br-3xl px-10 md:px-16 py-16">
        <h2 className="font-sans text-3xl md:text-4xl font-medium text-peach mb-6">
          Reach Out
        </h2>
        <p className="font-mono text-base font-medium text-peach max-w-2xl mb-12 leading-relaxed">
          Let&apos;s start the conversation. Whether you&apos;re exploring
          ideas, need guidance, or are ready to build, we&apos;re here to
          listen and help. Reach out to us through the form or email, and
          we&apos;ll respond promptly with clarity and support. At Umaemi,
          every connection begins with understanding your needs and finding
          the right solutions together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            placeholder="youremail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-peach/50 rounded-tl-lg rounded-br-lg px-6 py-4 font-mono text-base font-medium text-peach placeholder:text-peach/70 focus:outline-none focus:border-peach"
          />

          <textarea
            required
            rows={6}
            placeholder="I need help digitizing my business and..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border border-peach/50 rounded-tl-lg rounded-br-lg px-6 py-4 font-mono text-base font-medium text-peach placeholder:text-peach/70 focus:outline-none focus:border-peach resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-tl-2xl rounded-br-2xl bg-burnt text-cream font-mono text-base font-medium hover:bg-[#c23a00] transition-colors"
            >
              Send <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </Reveal>
    </section>
  );
}