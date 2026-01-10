import { useAuth } from "@/hooks/use-auth";
import { useMoodEntries } from "@/hooks/use-mood-entries";
import { LayoutShell } from "@/components/layout-shell";
import { MoodCard } from "@/components/mood-card";
import { MoodForm } from "@/components/mood-form";
import { StatsChart } from "@/components/stats-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useMemo } from "react";
import { SmilePlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: entries, isLoading } = useMoodEntries();

  const todaysEntry = useMemo(() => {
    if (!entries) return null;
    const today = new Date();
    return entries.find(e => 
      new Date(e.createdAt).toDateString() === today.toDateString()
    );
  }, [entries]);

  const sortedEntries = useMemo(() => {
    if (!entries) return [];
    return [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [entries]);

  // Group entries by month for better list view
  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof sortedEntries> = {};
    sortedEntries.forEach(entry => {
      const month = format(new Date(entry.createdAt), "MMMM yyyy");
      if (!groups[month]) groups[month] = [];
      groups[month].push(entry);
    });
    return groups;
  }, [sortedEntries]);

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </LayoutShell>
    );
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <LayoutShell>
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
          {getTimeGreeting()}, {user?.firstName}!
        </h1>
        <p className="text-slate-500 text-lg">
          Track your mood, understand your mind.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Chart Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Weekly Overview</h2>
            <span className="text-sm text-slate-500">Last 7 Days</span>
          </div>
          <StatsChart entries={entries || []} />
        </motion.section>

        {/* Today's Status Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-2xl" />

          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 opacity-90">Today's Mood</h2>
            
            {todaysEntry ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4 bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                   {/* We could duplicate the switch logic here or assume MoodCard handles it better. 
                       For simplicity, just a generic icon or the mood value */}
                   {todaysEntry.mood >= 4 ? "😄" : todaysEntry.mood === 3 ? "😐" : "😔"}
                </div>
                <p className="font-medium text-lg opacity-90">
                  You're feeling <span className="font-bold text-white">
                    {todaysEntry.mood >= 4 ? "great" : todaysEntry.mood === 3 ? "okay" : "down"}
                  </span> today.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <SmilePlus size={32} className="text-white/80" />
                </div>
                <p className="text-blue-100 mb-6">
                  You haven't logged your mood yet.
                </p>
                {/* The global FAB handles adding, but we can also trigger it here visually if needed 
                    or just rely on the main CTA */}
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Recent Entries List */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 px-1">Recent Entries</h2>
        
        {Object.entries(groupedEntries).length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">No entries yet. Click the + button to start tracking!</p>
          </div>
        ) : (
          Object.entries(groupedEntries).map(([month, monthEntries], groupIndex) => (
            <motion.div 
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (groupIndex * 0.1) }}
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 pl-1">
                {month}
              </h3>
              <div className="grid gap-4">
                {monthEntries.map((entry) => (
                  <MoodCard key={entry.id} entry={entry} />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </section>

      <div className="flex items-center justify-between mt-8 md:hidden">
        <MoodForm />
      </div>
      
      {/* Desktop FAB */}
      <div className="hidden md:block fixed bottom-12 right-12 z-50">
        <MoodForm />
      </div>

    </LayoutShell>
  );
}
