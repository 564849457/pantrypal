"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSwitcher() {
  const language = useLanguage();

  const setLanguage = (
    nextLanguage: "en" | "zh",
  ) => {
    localStorage.setItem(
      "pantrypal-language",
      nextLanguage,
    );

    document.documentElement.lang =
      nextLanguage === "zh"
        ? "zh-CN"
        : "en";

    window.dispatchEvent(
      new Event(
        "pantrypal-language-change",
      ),
    );
  };

  return (
    <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() =>
          setLanguage("en")
        }
        className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition duration-300 ${
          language === "en"
            ? "border border-white/15 bg-white/12 text-white shadow-[0_0_20px_rgba(249,115,22,0.12)]"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() =>
          setLanguage("zh")
        }
        className={`relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition duration-300 ${
          language === "zh"
            ? "border border-white/15 bg-white/12 text-white shadow-[0_0_20px_rgba(249,115,22,0.12)]"
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        中文
      </button>
    </div>
  );
}