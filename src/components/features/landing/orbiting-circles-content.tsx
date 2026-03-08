"use client";

import Image from "next/image";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const outerRingBrands = [
  { name: "Google", src: "/assets/brand/google.svg" },
  { name: "Microsoft", src: "/assets/brand/microsoft.svg" },
  { name: "Meta", src: "/assets/brand/meta.svg" },
  { name: "Netflix", src: "/assets/brand/netflix.svg" },
  { name: "OpenAI", src: "/assets/brand/openai.svg" },
];

const innerRingBrands = [
  { name: "Amazon", src: "/assets/brand/amazon.svg" },
  { name: "Stripe", src: "/assets/brand/stripe.svg" },
  { name: "PayPal", src: "/assets/brand/paypal.svg" },
  { name: "LinkedIn", src: "/assets/brand/linkedin.svg" },
];

function BrandLogo({
  name,
  src,
  sizeClassName,
}: {
  name: string;
  src: string;
  sizeClassName: string;
}) {
  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={72}
      height={72}
      className={`${sizeClassName} object-contain drop-shadow-[0_10px_16px_rgba(15,23,42,0.16)] transition-transform duration-300 hover:scale-105`}
    />
  );
}

export function OrbitingCirclesContent() {
  return (
    <div className="relative h-[460px] w-full max-w-[460px] overflow-hidden">
      <div className="absolute inset-12 rounded-full border border-primary/8 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_65%)]" />
      <div className="absolute inset-[6.25rem] rounded-full border border-border/50" />
      <div className="absolute inset-[9.5rem] rounded-full border border-border/40" />

      <OrbitingCircles radius={176} duration={30} reverse path iconSize={52}>
        {outerRingBrands.map((brand) => (
          <BrandLogo
            key={brand.name}
            name={brand.name}
            src={brand.src}
            sizeClassName="h-10 w-10 md:h-11 md:w-11"
          />
        ))}
      </OrbitingCircles>

      <OrbitingCircles radius={108} duration={22} delay={-3} path iconSize={44}>
        {innerRingBrands.map((brand) => (
          <BrandLogo
            key={brand.name}
            name={brand.name}
            src={brand.src}
            sizeClassName="h-8 w-8 md:h-9 md:w-9"
          />
        ))}
      </OrbitingCircles>
    </div>
  );
}
