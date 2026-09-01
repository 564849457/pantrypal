"use client";

import { useSyncExternalStore } from "react";

export type Language = "en" | "zh";

const EVENT_NAME = "pantrypal-language-change";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
  };
}

function getSnapshot(): Language {
  const saved = localStorage.getItem("pantrypal-language");

  return saved === "zh" ? "zh" : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

export function useLanguage() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}