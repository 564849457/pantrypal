"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavbarClient({ children }: { children?: ReactNode }) {
  const zh = useLanguage() === "zh";
  const pathname = usePathname();
  const links = [
    { href: "/", label: zh ? "首页" : "Home", active: pathname === "/" },
    {
      href: "/recipes",
      label: zh ? "发现菜谱" : "Recipes",
      active: pathname.startsWith("/recipes"),
    },
    {
      href: "/favorites",
      label: zh ? "我的收藏" : "Saved",
      active: pathname === "/favorites",
    },
  ];
  return (
    <header className="pp-header">
      <a href="#main-content" className="pp-skip-link">
        {zh ? "跳到内容" : "Skip to content"}
      </a>
      <div className="pp-container pp-header-inner">
        <Link href="/" className="pp-wordmark" aria-label="PantryPal home">
          <span className="pp-logo-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M4 11h16a8 8 0 0 1-16 0Z" />
              <path d="M8 7c-2-2 2-3 0-5M13 7c-2-2 2-3 0-5M8 21h8" />
            </svg>
          </span>
          PantryPal<span>.</span>
        </Link>
        <nav className="pp-nav" aria-label={zh ? "主导航" : "Main navigation"}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="pp-header-actions">
          <LanguageSwitcher />
          {children}
        </div>
      </div>
    </header>
  );
}
