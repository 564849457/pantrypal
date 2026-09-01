"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/i18n";

export default function NavbarClient() {
  const language = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-1 items-center justify-between gap-6">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-zinc-900"
      >
        PantryPal
      </Link>

      <div className="mr-4 flex items-center gap-5">
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/recipes"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            {t.recipes}
          </Link>

          <Link
            href="/favorites"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            {language === "zh" ? "收藏" : "Favorites"}
          </Link>
        </nav>

        <LanguageSwitcher />
      </div>
    </div>
  );
}