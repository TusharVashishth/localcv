"use client";

import { useEffect } from "react";

export default function PwaServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ****** installability is best-effort; ignore registration failures ****** */
    });
  }, []);

  return null;
}
