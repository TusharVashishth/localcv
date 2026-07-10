"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

function isStandaloneDisplay() {
  const iosStandalone = (
    window.navigator as Navigator & { standalone?: boolean }
  ).standalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    iosStandalone === true
  );
}

export default function PwaSplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isStandaloneDisplay()) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs with browser display-mode on mount to avoid an SSR hydration mismatch
    setVisible(true);
    const timer = setTimeout(
      () => setVisible(false),
      reduceMotion ? 600 : 1400,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, #00c98a 0%, #009869 40%, #046c4e 70%, #09090b 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="absolute inset-0 rounded-[28px] bg-white/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <Image
              src="/assets/logos/localcv-icon-v2-raw.png"
              alt="localCV"
              width={96}
              height={96}
              priority
              className="relative rounded-[24px] shadow-2xl shadow-black/30"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-5 text-lg font-semibold tracking-tight text-white"
          >
            localCV
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
