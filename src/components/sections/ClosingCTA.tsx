import Image from "next/image";
import Button from "@/components/ui/Button";

export default function ClosingCTA() {
  return (
    <div className="bg-[#1A0503] px-6 sm:px-10 md:px-16 pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div>
          <h2 className="font-sans text-3xl md:text-4xl text-cream font-medium mb-8 leading-tight">
            From concept to clarity, <br className="hidden md:block" />
            begin with a free consultation.
          </h2>
          <Button href="#contact">Book Consultation Session</Button>
        </div>

        <Image
          src="/icons/closing-decor.svg"
          alt=""
          width={480}
          height={220}
          className="hidden md:block"
        />
      </div>
    </div>
  );
}