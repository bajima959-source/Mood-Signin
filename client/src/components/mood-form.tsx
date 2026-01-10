import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMoodEntrySchema } from "@shared/schema";
import { useCreateMoodEntry } from "@/hooks/use-mood-entries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Smile, Frown, Meh, Annoyed, Laugh } from "lucide-react";
import { z } from "zod";
import clsx from "clsx";

const formSchema = insertMoodEntrySchema.extend({
  mood: z.coerce.number().min(1).max(5),
});

type FormData = z.infer<typeof formSchema>;

const MOODS = [
  { value: 1, label: "Awful", icon: Frown, color: "text-red-500", bg: "bg-red-50 hover:bg-red-100 border-red-200" },
  { value: 2, label: "Bad", icon: Annoyed, color: "text-orange-500", bg: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
  { value: 3, label: "Okay", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200" },
  { value: 4, label: "Good", icon: Smile, color: "text-green-500", bg: "bg-green-50 hover:bg-green-100 border-green-200" },
  { value: 5, label: "Great", icon: Laugh, color: "text-blue-500", bg: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
];

export function MoodForm() {
  const [open, setOpen] = useState(false);
  const createMood = useCreateMoodEntry();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: 3,
      note: "",
      userId: "temp", // Will be overridden by backend or handled there? Replit auth usually handles this server side, but schema has it. 
      // Actually, server routes usually attach user from session. Let's assume server handles user_id injection or we pass a placeholder.
      // Based on schema, userId is required. We should probably pass current user ID or let server handle it.
      // Looking at `server/routes.ts` structure (not generated yet but typical for Replit auth), 
      // best practice is server injects it. 
      // For now, I'll pass a placeholder and rely on server to overwrite/validate.
    },
  });

  // Replit Auth hack: we need to pass the userId from the session on the server side ideally,
  // but if the schema requires it in the body validation, we might need to send it.
  // However, `insertMoodEntrySchema` is what `api.moodEntries.create.input` uses.
  // The server implementation should override `userId` with `req.user.id`.
  // To satisfy Zod client-side, we'll just put a dummy string here.

  const onSubmit = (data: FormData) => {
    // In a real app, userId comes from auth context, but server should enforce it.
    // We'll send it as is, server needs to overwrite it with secure session ID.
    createMood.mutate({ ...data, userId: "current-user" }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="
            fixed bottom-8 right-8 md:static md:w-auto
            rounded-full md:rounded-xl shadow-xl md:shadow-lg shadow-blue-500/25 
            hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300
            bg-blue-600 hover:bg-blue-700 h-14 w-14 md:h-12 md:w-auto md:px-6
          "
        >
          <Plus className="w-6 h-6 md:mr-2" strokeWidth={3} />
          <span className="hidden md:inline font-semibold">Log Mood</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">How are you feeling?</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your day.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Mood</FormLabel>
                  <FormControl>
                    <div className="flex justify-between gap-2">
                      {MOODS.map((m) => {
                        const Icon = m.icon;
                        const isSelected = field.value === m.value;
                        return (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => field.onChange(m.value)}
                            className={clsx(
                              "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 w-full",
                              isSelected 
                                ? `${m.bg} ring-2 ring-offset-2 ring-blue-500/20 scale-105` 
                                : "bg-slate-50 border-transparent hover:bg-slate-100 text-slate-400 grayscale hover:grayscale-0"
                            )}
                          >
                            <Icon 
                              className={clsx(
                                "w-8 h-8 transition-colors",
                                isSelected ? m.color : "text-slate-400"
                              )} 
                              strokeWidth={isSelected ? 2.5 : 2}
                            />
                            <span className={clsx("text-xs font-medium", isSelected ? "text-slate-900" : "text-slate-400")}>
                              {m.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-medium">Add a note (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What's on your mind?..." 
                      className="resize-none bg-slate-50 border-slate-200 focus:bg-white min-h-[120px] rounded-xl text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-500">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMood.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              >
                {createMood.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
