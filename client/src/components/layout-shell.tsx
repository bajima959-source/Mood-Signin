import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  LayoutDashboard, 
  LineChart, 
  Settings,
  SmilePlus
} from "lucide-react";
import { motion } from "framer-motion";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/stats", label: "Analytics", icon: LineChart },
    // { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <SmilePlus size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              MoodFlow
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href} className="block group">
                <div className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}>
                  <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors"
              onClick={() => logout()}
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
