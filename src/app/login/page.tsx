import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="bg-[#0f0f18] border border-[#1e1e30] rounded-2xl p-12 text-center w-[360px]">
        
        {/* Logo */}
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-xl font-black text-white mx-auto mb-5">
          N
        </div>

        {/* Heading */}
        <h1 className="text-xl font-black text-slate-100 mb-2">
          Welcome to NotionLike
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Sign in to access your workspace
        </p>

        {/* Sign in button */}
        <form action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-xl text-white text-sm font-bold cursor-pointer font-mono"
          >
            Continue with Google
          </button>
        </form>

      </div>
    </div>
  );
}