"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useInstallPrompt } from "./use-install-prompt";

export default function PwaInstallPrompt() {
  const { isStandalone, isIos, canPromptInstall, promptInstall } =
    useInstallPrompt();
  const hasShown = useRef(false);

  useEffect(() => {
    if (isStandalone || hasShown.current) return;
    if (!canPromptInstall && !isIos) return;

    hasShown.current = true;

    toast.info(isIos ? "Add localCV to your Home Screen" : "Install localCV", {
      description: isIos
        ? 'Tap the Share icon, then "Add to Home Screen" for the full app experience.'
        : "Install the app for a faster, native-like experience.",
      duration: 4000,
      richColors: true,

      action: isIos
        ? undefined
        : {
          label: "Install",
          onClick: () => {
            void promptInstall();
          },
        },
    });
  }, [isStandalone, isIos, canPromptInstall, promptInstall]);

  return null;
}
