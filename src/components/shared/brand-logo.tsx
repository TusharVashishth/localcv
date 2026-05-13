"use client";
import Image from "next/image";

export default function BrandLogo() {
  return (
    <>
      <Image
        src="/assets/logos/logo.png"
        alt="logo"
        width={150}
        height={300}
        className="object-contain dark:hidden"
      />
      <Image
        src="/assets/logos/logo_dark.png"
        alt="logo"
        width={150}
        height={300}
        className="object-contain hidden dark:block"
      />
    </>
  );
}
