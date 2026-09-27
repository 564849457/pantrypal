import Image from "next/image";
import AccountLabel from "./AccountLabel";
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
        <button type="submit" className="pp-button pp-button-small">
          <AccountLabel />
        </button>
      </form>
    );
  }
  const userName = session.user.name ?? "User";
  return (
    <div className="pp-account">
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={userName}
          width={32}
          height={32}
          className="pp-avatar"
        />
      ) : (
        <span className="pp-avatar pp-avatar-fallback" aria-label={userName}>
          {userName.charAt(0).toUpperCase()}
        </span>
      )}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="pp-signout">
          <AccountLabel signedIn />
        </button>
      </form>
    </div>
  );
}
