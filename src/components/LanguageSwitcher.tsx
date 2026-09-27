"use client";
import { useEffect } from "react";
import { useLanguage, type Language } from "@/hooks/useLanguage";
export default function LanguageSwitcher() {
  const language = useLanguage();
  useEffect(() => {
    document.documentElement.setAttribute(
      "lang",
      language === "zh" ? "zh-CN" : "en",
    );
  }, [language]);
  function setLanguage(next: Language) {
    localStorage.setItem("pantrypal-language", next);
    window.dispatchEvent(new Event("pantrypal-language-change"));
  }
  return (
    <div
      className="pp-language"
      role="group"
      aria-label={language === "zh" ? "语言" : "Language"}
    >
      {(["en", "zh"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => setLanguage(value)}
        >
          {value === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
