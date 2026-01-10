import { MoodEntry } from "@shared/schema";
import { format } from "date-fns";
import { Smile, Frown, Meh, Annoyed, Laugh, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteMoodEntry } from "@/hooks/use-mood-entries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MOOD_CONFIG = {
  1: { label: "Awful", icon: Frown, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
  2: { label: "Bad", icon: Annoyed, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  3: { label: "Okay", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100" },
  4: { label: "Good", icon: Smile, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
  5: { label: "Great", icon: Laugh, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
};

export function MoodCard({ entry }: { entry: MoodEntry }) {
  const deleteMood = useDeleteMoodEntry();
  const config = MOOD_CONFIG[entry.mood as keyof typeof MOOD_CONFIG] || MOOD_CONFIG[3];
  const Icon = config.icon;

  return (
    <div className={`
      relative group p-5 rounded-2xl bg-white border border-slate-100 shadow-sm
      hover:shadow-md hover:border-slate-200 transition-all duration-300
    `}>
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-lg text-slate-900">
                {config.label}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {format(new Date(entry.createdAt), "h:mm a")}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {format(new Date(entry.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={18} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove your mood log.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMood.mutate(entry.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {entry.note && (
        <div className="mt-4 pl-4 border-l-2 border-slate-100">
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.note}</p>
        </div>
      )}
    </div>
  );
}
