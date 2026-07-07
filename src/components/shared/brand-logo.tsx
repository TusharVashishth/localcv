"use client";
import Image from "next/image";

export default function BrandLogo() {
  return (
    <div className="inline-flex items-center gap-0.5 whitespace-nowrap">
      <Image
        src="/assets/logos/localcv-icon-v2.png"
        alt="LocalCV icon"
        width={40}
        height={38}
        className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
      />
      <span className="hidden md:block text-[1.35rem] font-bold leading-none tracking-tight text-slate-900 dark:text-white sm:text-[1.55rem]">
        Local
        <span className="text-primary">CV</span>
      </span>
      <span className="text-[1.35rem] font-bold leading-none tracking-tight text-slate-900 dark:text-white sm:text-[1.55rem] md:hidden">
        <span className="text-primary">CV</span>
      </span>
    </div>
  );
}
