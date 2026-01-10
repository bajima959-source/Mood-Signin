import { useMoodEntries } from "@/hooks/use-mood-entries";
import { LayoutShell } from "@/components/layout-shell";
import { StatsChart } from "@/components/stats-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, TrendingUp, Activity } from "lucide-react";

export default function StatsPage() {
  const { data: entries, isLoading } = useMoodEntries();

  if (isLoading) {
    return <LayoutShell><Skeleton className="h-96 w-full" /></LayoutShell>;
  }

  const safeEntries = entries || [];
  const totalEntries = safeEntries.length;
  const averageMood = totalEntries > 0 
    ? (safeEntries.reduce((acc, curr) => acc + curr.mood, 0) / totalEntries).toFixed(1)
    : "0";
  
  // Find longest streak (consecutive days)
  // Simplified logic for MVP
  const currentStreak = 0; // To implement later with date-fns differenceInDays

  return (
    <LayoutShell>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-500">Visualize your emotional trends over time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Logs</CardTitle>
            <CalendarDays className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalEntries}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Mood</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{averageMood}</div>
            <p className="text-xs text-slate-500 mt-1">out of 5.0</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Mood Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Stable</div>
            <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsChart entries={safeEntries} />
        </CardContent>
      </Card>
    </LayoutShell>
  );
}
