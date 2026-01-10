import { useMemo } from "react";
import { MoodEntry } from "@shared/schema";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

export function StatsChart({ entries }: { entries: MoodEntry[] }) {
  const data = useMemo(() => {
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i); // 6 days ago to today
      return {
        date,
        label: format(date, "EEE"),
        fullDate: format(date, "MMM d"),
        value: 0,
        count: 0
      };
    });

    // Populate with averages
    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      const dayStat = days.find(d => isSameDay(d.date, entryDate));
      
      if (dayStat) {
        dayStat.value += entry.mood;
        dayStat.count += 1;
      }
    });

    // Calculate average
    return days.map(d => ({
      ...d,
      average: d.count > 0 ? Number((d.value / d.count).toFixed(1)) : null
    }));
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p>No enough data for charts yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 mb-1">{payload[0].payload.fullDate}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      Avg Mood: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMood)" 
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
