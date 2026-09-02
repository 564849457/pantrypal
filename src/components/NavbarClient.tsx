"use client";

import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavbarClient() {
  const language = useLanguage();

  return (
    <div className="flex flex-1 items-center justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="group relative text-xl font-bold tracking-tight text-white"
      >
        <span className="relative z-10">
          PantryPal
        </span>

        {/* subtle logo glow */}
        <span className="absolute -inset-3 -z-0 rounded-xl bg-orange-500/0 blur-xl transition duration-300 group-hover:bg-orange-500/15" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Recipes */}
        <Link
          href="/recipes"
          className="group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 transition duration-300 hover:text-white"
        >
          {/* Glass hover layer */}
          <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="absolute inset-0 rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl" />

            <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

            <span className="absolute -inset-4 bg-orange-500/10 blur-2xl" />
          </span>

          <span className="relative z-10">
            {language === "zh"
              ? "菜谱"
              : "Recipes"}
          </span>
        </Link>

        {/* Favorites */}
        <Link
          href="/favorites"
          className="group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 transition duration-300 hover:text-white"
        >
          <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="absolute inset-0 rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl" />

            <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

            <span className="absolute -inset-4 bg-orange-500/10 blur-2xl" />
          </span>

          <span className="relative z-10">
            {language === "zh"
              ? "收藏"
              : "Favorites"}
          </span>
        </Link>

        {/* Language */}
        <LanguageSwitcher />
      </div>
    </div>
  );
}