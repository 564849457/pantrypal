import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";

export default async function AuthButton() {
  const session = await auth();

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
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name ?? "User"}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600">
          {session.user.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      )}

      <span className="hidden text-sm font-medium text-zinc-700 md:block">
        {session.user.name}
      </span>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}