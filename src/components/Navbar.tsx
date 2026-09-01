import AuthButton from "./AuthButton";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavbarClient />

        <AuthButton />
      </div>
    </header>
  );
}