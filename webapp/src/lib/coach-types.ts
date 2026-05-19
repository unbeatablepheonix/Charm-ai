export type CoachMode = "opener" | "reply" | "story_reply" | "profile" | "advice";
export type CoachTone = "playful" | "sincere" | "witty" | "confident" | "sweet" | "chill" | "super_swagger_rizz" | "charm";

export interface CoachSuggestion {
  label: string;
  text: string;
  why: string;
}

export interface CoachResponse {
  headline: string;
  read: string;
  suggestions: CoachSuggestion[];
  tips: string[];
}

export interface CoachRequest {
  mode: CoachMode;
  context: string;
  tone?: CoachTone[];
  imageUrls?: string[];
}
