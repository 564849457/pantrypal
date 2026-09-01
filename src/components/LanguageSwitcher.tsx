"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSwitcher() {
  const language = useLanguage();

  const changeLanguage = (lang: "en" | "zh") => {
    localStorage.setItem("pantrypal-language", lang);

    document.documentElement.lang =
      lang === "zh" ? "zh-CN" : "en";

    window.dispatchEvent(
      new Event("pantrypal-language-change"),
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          language === "en"
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("zh")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          language === "zh"
            ? "bg-zinc-900 text-white"
            : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        中文
      </button>
    </div>
  );
}