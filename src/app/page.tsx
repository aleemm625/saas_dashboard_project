import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      {session ? (
        <div>
          <p>Signed in as <b>{session.user?.email}</b></p>
          <form action={async () => { "use server"; await signOut(); }}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      ) : (
        <form action={async () => { "use server"; await signIn("google"); }}>
          <button type="submit">Sign in with Google</button>
        </form>
      )}
    </div>
  );
}