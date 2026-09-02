import AuthButton from "./AuthButton";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <header className="relative z-50 border-b border-white/10 bg-[#0b0705]/90 text-white backdrop-blur-xl">
      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_0%,rgba(249,115,22,0.12),transparent_35%)]" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavbarClient />

        <AuthButton />
      </div>
    </header>
  );
}