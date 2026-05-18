export type CoachMode = "opener" | "reply" | "profile" | "advice";
export type CoachTone = "playful" | "sincere" | "witty" | "confident";

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
  tone?: CoachTone;
  imageUrl?: string;
}
