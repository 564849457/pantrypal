import Image from "next/image";

import {
  auth,
  signIn,
  signOut,
} from "@/auth";

export default async function AuthButton() {
  const session = await auth();

  // ============================================
  // Logged out
  // ============================================

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";

          await signIn("google");
        }}
      >
        <button
          type="submit"
          className="group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 transition duration-300 hover:text-white"
        >
          {/* Glass hover */}
          <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="absolute inset-0 rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl" />

            <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

            <span className="absolute -inset-4 bg-orange-500/10 blur-2xl" />
          </span>

          <span className="relative z-10">
            Sign in
          </span>
        </button>
      </form>
    );
  }

  const userName =
    session.user.name ?? "User";

  const initial =
    userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Avatar */}
      {session.user.image ? (
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-orange-500/10 blur-md" />

          <Image
            src={session.user.image}
            alt={userName}
            width={32}
            height={32}
            className="relative h-8 w-8 rounded-full border border-white/15 object-cover shadow-[0_0_14px_rgba(249,115,22,0.10)]"
          />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-orange-500/10 blur-md" />

          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white shadow-[0_0_14px_rgba(249,115,22,0.10)] backdrop-blur-xl">
            {initial}
          </div>
        </div>
      )}

      {/* User name */}
      <span className="hidden text-sm font-medium text-zinc-300 sm:inline">
        {userName}
      </span>

      {/* Sign out */}
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button
          type="submit"
          className="group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition duration-300 hover:text-white"
        >
          {/* Glass hover */}
          <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="absolute inset-0 rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl" />

            <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

            <span className="absolute -inset-4 bg-orange-500/10 blur-2xl" />
          </span>

          <span className="relative z-10">
            Sign out
          </span>
        </button>
      </form>
    </div>
  );
}