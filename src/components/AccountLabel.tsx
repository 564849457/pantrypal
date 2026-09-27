"use client";
import { useLanguage } from "@/hooks/useLanguage";
export default function AccountLabel({
  signedIn = false,
}: {
  signedIn?: boolean;
}) {
  const zh = useLanguage() === "zh";
  return <>{signedIn ? (zh ? "退出" : "Sign out") : zh ? "登录" : "Sign in"}</>;
}
