import type { Emotion, Satisfaction } from "./types";

export const SATISFACTIONS: { value: Satisfaction; label: string }[] = [
  { value: "VERY_SATISFIED", label: "매우 만족" },
  { value: "SATISFIED", label: "만족" },
  { value: "NORMAL", label: "보통" },
  { value: "DISAPPOINTED", label: "아쉬움" },
];

// 시안에서도 기쁨·뿌듯, 후회·부담은 같은 얼굴이다.
export const EMOTIONS: { value: Emotion; label: string; icon: string }[] = [
  { value: "JOY", label: "기쁨", icon: "/images/emotions/joy.png" },
  { value: "PROUD", label: "뿌듯", icon: "/images/emotions/proud.png" },
  { value: "EXCITED", label: "설렘", icon: "/images/emotions/excited.png" },
  { value: "COMFORT", label: "편함", icon: "/images/emotions/comfort.png" },
  { value: "REGRET", label: "후회", icon: "/images/emotions/regret.png" },
  { value: "BURDEN", label: "부담", icon: "/images/emotions/burden.png" },
];

export const satisfactionLabel = (value: Satisfaction) =>
  SATISFACTIONS.find((s) => s.value === value)!.label;

export const emotionLabel = (value: Emotion) => EMOTIONS.find((e) => e.value === value)!.label;
