"use client";

import { useState } from "react";
import Image from "next/image";
import CornerDot from "@/components/ui/CornerDot";
import Button from "@/components/ui/Button";

const services = [
  {
    title: "Consultation & Guidance",
    tagline:
      "Free consultation and value-first guidance, helping you explore solutions before committing.",
    body: "Our process begins with a free consultation session where we take time to understand your challenges and goals. In this conversation, we explore ideas together and outline practical solutions tailored to your needs. It's a chance to see how technology can support your business in clear, simple terms, without pressure or jargon, so you can move forward with confidence and make informed decisions about the next steps.",
    image: "/images/services/consultation.png",
  },
  {
    title: "White-Label Solutions",
    tagline:
      "Ready-made, customizable software and tools you can try on trial, freemium, or subscription before investing in a full custom solution build.",
    body: "We provide flexible, ready-made software that can be customized to fit your business. With options available on trial, freemium, or subscription, you can experiment with dashboards and tools, explore what works best, and validate ideas before moving to a full custom solution. This way, you reduce risk and gain confidence while testing technology in real time.",
    image: "/images/services/white-label.png",
  },
  {
    title: "Custom Tech Solutions",
    tagline:
      "We design and build digital tools tailored to your business, solving everyday challenges with technology that works for you.",
    body: "We create technology that fits your business, not the other way around. Our custom solutions are built to simplify daily operations, turning complex challenges into easy-to-use digital tools. Whether you're a company or an individual without a technical background, we design systems that work seamlessly so you can focus on what matters most, running and growing your business.",
    image: "/images/services/custom-tech.png",
  },
  {
    title: "Branding & Visualization",
    tagline:
      "Comprehensive branding and ongoing management, from creating your identity and design to continuously refining and updating your brand guide.",
    body: "At Umaemi, we craft and manage your brand with care, building a strong identity and professional design that grows with your business. Beyond the initial creation, we provide ongoing updates and refinements to your brand guide, ensuring your presence stays consistent, modern, and aligned with your goals. This continuous support gives you confidence and clarity as your brand evolves in a changing market.",
    image: "/images/services/branding.png",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" className="max-w-6xl mx-auto grid md:grid-cols-2 min-h-168 my-10">
      <div className="bg-peach border border-dark/80 rounded-tl-2xl rounded-br-2xl px-10 md:px-16 py-16 flex flex-col justify-between">
        <div>
          <h2 className="font-sans text-3xl md:text-4xl text-dark mb-8">Services</h2>
          <div className="flex gap-6 mb-16">
            {services.map((s, i) => {
              const rotations = ["rotate-0", "rotate-90", "rotate-180", "-rotate-90"];
              return (
                <button key={s.title} onClick={() => setActive(i)} aria-label={s.title}>
                  <CornerDot className={`${rotations[i]} ${i === active ? "text-burnt" : "text-dark/40"}`} />
                </button>
              );
            })}
          </div>

          <h3 className="font-sans text-2xl text-dark mb-4">{current.title}</h3>
          <p className="font-mono text-sm text-dark/90 mb-6">{current.tagline}</p>
          <div
            className="mb-6 h-0.5"
            style={{
              backgroundImage: "repeating-linear-gradient(to right, rgba(17,4,2,0.9) 0, rgba(17,4,2,0.9) 10px, transparent 10px, transparent 20px)",
            }}
          />
          <p className="font-mono text-sm text-dark/70 leading-relaxed">{current.body}</p>
        </div>

        <div className="mt-10">
          <Button href="#contact">Book Consultation Session</Button>
        </div>
      </div>

      <div className="relative min-h-96 md:min-h-0">
        <Image
          src={current.image}
          alt={current.title}
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}