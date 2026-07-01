"use client";

import { useEffect } from "react";

/** Forces dark theme + landing ambient styles on the home page only. */
export default function HomeLandingWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("mm-landing-active");
    return () => {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("mm-landing-active");
    };
  }, []);

  return <>{children}</>;
}
