import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 border-r border-slate-100 flex-col p-12 relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <SmilePlus size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MoodFlow</span>
          </div>

          <div className="max-w-md mt-20">
            <h1 className="text-5xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Understand your mind, one day at a time.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Track your moods, identify triggers, and build healthier habits with our beautiful, intuitive monitoring tool.
            </p>
          </div>

          <div className="mt-auto pt-20">
            <div className="flex gap-4 text-sm text-slate-400">
              <span>© 2024 MoodFlow</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <SmilePlus size={28} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">Sign in to continue your journey</p>
          </div>

          <div className="pt-8">
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10"
              onClick={handleLogin}
            >
              Sign in with Replit
            </Button>
            <p className="mt-4 text-xs text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
