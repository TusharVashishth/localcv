"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function detectIsIos(): boolean {
  const { userAgent, platform, maxTouchPoints } = window.navigator;

  // iPhone/iPod keep "iPhone"/"iPod" in the UA by default.
  if (/iphone|ipod/i.test(userAgent)) return true;

  // iPad defaults to a desktop-class UA since iPadOS 13 ("Request Desktop
  // Website" is on by default), so it reports as "Macintosh" with no "iPad"
  // substring. Touch points distinguish it from an actual Mac.
  return platform === "MacIntel" && maxTouchPoints > 1;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const iosStandalone = (window.navigator as Navigator & { standalone?: boolean })
      .standalone;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs with browser APIs on mount to avoid an SSR hydration mismatch
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        iosStandalone === true,
    );
    setIsIos(detectIsIos());

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return {
    isStandalone,
    isIos,
    canPromptInstall: deferredPrompt !== null,
    promptInstall,
  };
}
