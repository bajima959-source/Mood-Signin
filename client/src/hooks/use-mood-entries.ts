import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type MoodEntryInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMoodEntries() {
  return useQuery({
    queryKey: [api.moodEntries.list.path],
    queryFn: async () => {
      const res = await fetch(api.moodEntries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mood entries");
      return api.moodEntries.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MoodEntryInput) => {
      const res = await fetch(api.moodEntries.create.path, {
        method: api.moodEntries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.moodEntries.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create entry");
      }
      return api.moodEntries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.moodEntries.list.path] });
      toast({
        title: "Mood logged!",
        description: "Your daily mood has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteMoodEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.moodEntries.delete.path, { id });
      const res = await fetch(url, { 
        method: api.moodEntries.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) {
         if (res.status === 404) {
           throw new Error("Entry not found");
         }
         throw new Error("Failed to delete entry");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.moodEntries.list.path] });
      toast({
        title: "Deleted",
        description: "Mood entry removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
