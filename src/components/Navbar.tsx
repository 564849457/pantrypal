"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";

export default function Navbar() {
  const language = useLanguage();
  const t = translations[language];

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900"
        >
          PantryPal
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href="/recipes"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              {t.recipes}
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}