"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function NavAuth() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSignedIn(!!data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
      setReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return (
      <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-white/10 md:block" aria-hidden />
    );
  }

  if (signedIn) {
    return (
      <Link
        href="/dashboard"
        className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10 md:inline-flex"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/login"
        className="rounded-xl px-4 py-2.5 text-sm font-bold text-white/75 transition hover:text-white"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
      >
        Sign up
      </Link>
    </div>
  );
}
