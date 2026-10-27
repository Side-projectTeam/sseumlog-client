import type { Emotion, Satisfaction } from "./types";

export const SATISFACTIONS: { value: Satisfaction; label: string }[] = [
  { value: "VERY_SATISFIED", label: "매우 만족" },
  { value: "SATISFIED", label: "만족" },
  { value: "NORMAL", label: "보통" },
  { value: "DISAPPOINTED", label: "아쉬움" },
];

// 시안에서도 기쁨·뿌듯, 후회·부담은 같은 얼굴이다.
// color: 소비 분석 그래프 색 (시안 기준)
export const EMOTIONS: {
  value: Emotion;
  label: string;
  icon: string;
  color: string;
  positive: boolean;
}[] = [
  {
    value: "JOY",
    label: "기쁨",
    icon: "/images/emotions/joy.png",
    color: "#5d5ef7",
    positive: true,
  },
  {
    value: "PROUD",
    label: "뿌듯",
    icon: "/images/emotions/proud.png",
    color: "#f28bd6",
    positive: true,
  },
  {
    value: "EXCITED",
    label: "설렘",
    icon: "/images/emotions/excited.png",
    color: "#4f8ef7",
    positive: true,
  },
  {
    value: "COMFORT",
    label: "편함",
    icon: "/images/emotions/comfort.png",
    color: "#f7d34a",
    positive: true,
  },
  {
    value: "REGRET",
    label: "후회",
    icon: "/images/emotions/regret.png",
    color: "#5cc28a",
    positive: false,
  },
  {
    value: "BURDEN",
    label: "부담",
    icon: "/images/emotions/burden.png",
    color: "#c49af0",
    positive: false,
  },
];

export const emotionOf = (value: Emotion) => EMOTIONS.find((e) => e.value === value)!;

export const satisfactionLabel = (value: Satisfaction) =>
  SATISFACTIONS.find((s) => s.value === value)!.label;

export const emotionLabel = (value: Emotion) => emotionOf(value).label;
