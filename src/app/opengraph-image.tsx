import { ImageResponse } from "next/og";
import { HeroOgImage } from "@/components/features/landing/hero-og-image";

export const alt = "localCV hero preview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<HeroOgImage />, {
    ...size,
  });
}
