import { z } from "zod";

export const coachModeSchema = z.enum(["opener", "reply", "profile", "advice", "story_reply", "bio"]);
export type CoachMode = z.infer<typeof coachModeSchema>;

export const toneSchema = z.enum(["playful", "sincere", "witty", "confident", "sweet", "chill", "super_swagger_rizz", "charm"]);
export type Tone = z.infer<typeof toneSchema>;

export const coachRequestSchema = z.object({
  mode: coachModeSchema,
  context: z.string().min(1).max(4000),
  tone: z.array(toneSchema).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});
export type CoachRequest = z.infer<typeof coachRequestSchema>;

export const coachSuggestionSchema = z.object({
  label: z.string(),
  text: z.string(),
  why: z.string(),
});
export type CoachSuggestion = z.infer<typeof coachSuggestionSchema>;

export const coachResponseSchema = z.object({
  headline: z.string(),
  read: z.string(),
  suggestions: z.array(coachSuggestionSchema),
  tips: z.array(z.string()),
});
export type CoachResponse = z.infer<typeof coachResponseSchema>;
