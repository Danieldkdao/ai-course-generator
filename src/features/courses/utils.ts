import {
  Atom,
  Calculator,
  Code2,
  Cpu,
  Flame,
  Gauge,
  Hourglass,
  Palette,
  Smile,
  Timer,
  Users,
  Video,
} from "lucide-react";

export const categories = [
  { text: "Math", value: "math", Icon: Calculator },
  { text: "Science", value: "science", Icon: Atom },
  { text: "Programming", value: "programming", Icon: Code2 },
  { text: "Creative", value: "creative", Icon: Palette },
  { text: "AI", value: "ai", Icon: Cpu },
  { text: "Human", value: "human", Icon: Users },
];

export const difficulties = [
  { text: "Easy", value: "easy", Icon: Smile },
  { text: "Medium", value: "medium", Icon: Gauge },
  { text: "Hard", value: "hard", Icon: Flame },
];

export const durations = [
  { text: "1 hour", value: "1 hour", Icon: Timer },
  { text: "2 hours", value: "2 hours", Icon: Hourglass },
  { text: "3+ hours", value: "3+ hours", Icon: Gauge },
];

export const includeVideosOptions = [
  { text: "Include Videos", value: "true", Icon: Video },
  { text: "No Videos", value: "false", Icon: Users },
];
