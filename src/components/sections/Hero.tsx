import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="mx-auto px-10 md:px-16 pt-16 pb-28 grid md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-dark">
          We handle the tech, so you can focus on growth.
        </h1>

        <p className="mt-6 max-w-md font-mono text-base text-dark/80 leading-relaxed">
          Umaemi helps non-technical businesses and individuals turn ideas
          into seamless digital solutions. Book a consultation and let&apos;s
          scale your business with tech.
        </p>

        <div className="mt-10">
          <Button href="#contact">Book Consultation Session</Button>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <Image
          src="/icons/hero-diamond.svg"
          alt=""
          width={420}
          height={420}
          priority
        />
      </div>
    </section>
  );
}