import type { CoachMode } from "./coach-types";
import { Sparkles, MessageCircle, ScrollText, Compass, Camera, PenLine } from "lucide-react";

export interface ModeConfig {
  id: CoachMode;
  name: string;
  tagline: string;
  icon: typeof Sparkles;
  premium?: boolean;
  placeholder: string;
  cta: string;
  example: string;
}

export const COACH_MODES: ModeConfig[] = [
  {
    id: "opener",
    name: "Opener",
    tagline: "Start the conversation",
    icon: Sparkles,
    placeholder:
      "Describe where you are, what stood out about her, and the setting. Specifics help — what she's doing, what she's wearing if it's notable, the vibe of the place, anything you noticed.",
    cta: "Find an opener",
    example:
      "She's in line at the coffee shop near my office. Reading a thick book — looks like a novel. Sweater, headphones around her neck. Pretty quiet morning, not super busy.",
  },
  {
    id: "reply",
    name: "Reply",
    tagline: "Respond to her message",
    icon: MessageCircle,
    placeholder:
      "Paste what she just said or wrote. Add a sentence of context if it helps — how long you've been talking, where you met, the vibe so far.",
    cta: "Draft a reply",
    example:
      "We matched two days ago. She just sent: 'okay but you HAVE to tell me about the worst date you've ever been on, i need the gossip 😭'",
  },
  {
    id: "profile",
    name: "Profile",
    tagline: "Read her bio",
    icon: ScrollText,
    placeholder:
      "Paste her dating profile or bio exactly as it appears. Include any prompts, photos descriptions, or anything else listed.",
    cta: "Read the profile",
    example:
      "Bio: 'civil engineer by day, terrible cook by night. will out-hike you. ask me about my sourdough graveyard.' Prompts: 'I geek out on... bridges' / 'My simple pleasures: a perfect oat flat white'",
  },
  {
    id: "story_reply",
    name: "Story Reply",
    tagline: "React to her Instagram story",
    icon: Camera,
    placeholder:
      "Describe her story or paste what it says. What did she post? A photo at the beach, a meme, a song lyric, a poll?",
    cta: "Get replies",
    example:
      "She posted a story of her at a rooftop bar with the caption 'summer finally 🌅' — she's dressed up, clearly having a good time.",
  },
  {
    id: "advice",
    name: "Advice",
    tagline: "Ask anything",
    icon: Compass,
    placeholder:
      "What's on your mind? A specific situation, a worry, a question about how to approach something, a date coming up — anything.",
    cta: "Get advice",
    example:
      "First date with her on Saturday. We've been texting for a week and it's been great but I'm worried I'll get in my head and run out of things to say. How do I stay present?",
  },
  {
    id: "bio",
    name: "Bio Boost",
    tagline: "Improve your dating bio",
    icon: PenLine,
    premium: true,
    placeholder: "Paste your current dating bio here. Include any prompts you've answered, what you're looking for, your age — anything on your profile.",
    cta: "Rewrite my bio",
    example: "26M. 'Software engineer by day, amateur chef by night. Love hiking and trying new restaurants. Looking for someone to explore the city with 🙃'",
  },
];

export function getMode(id: CoachMode): ModeConfig {
  return COACH_MODES.find((m) => m.id === id) ?? COACH_MODES[0];
}
