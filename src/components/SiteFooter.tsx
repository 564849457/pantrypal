"use client";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
export default function SiteFooter() {
  const zh = useLanguage() === "zh";
  return (
    <footer className="pp-footer pp-container">
      <Link href="/" className="pp-wordmark">
        PantryPal<span>.</span>
      </Link>
      <p>{zh ? "好好做饭，好好生活。" : "Good food. A little less effort."}</p>
      <Link href="/recipes">
        {zh ? "发现菜谱" : "Explore recipes"} <span aria-hidden="true">↗</span>
      </Link>
    </footer>
  );
}
