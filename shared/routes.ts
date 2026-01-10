import { z } from 'zod';
import { insertMoodEntrySchema, moodEntries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  moodEntries: {
    list: {
      method: 'GET' as const,
      path: '/api/mood-entries',
      responses: {
        200: z.array(z.custom<typeof moodEntries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/mood-entries',
      input: insertMoodEntrySchema,
      responses: {
        201: z.custom<typeof moodEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/mood-entries/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type MoodEntryInput = z.infer<typeof api.moodEntries.create.input>;
export type MoodEntryResponse = z.infer<typeof api.moodEntries.create.responses[201]>;
