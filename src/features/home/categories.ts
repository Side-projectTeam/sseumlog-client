import type { CategoryId } from "./types";

// TODO: 카테고리 이름은 기획 확정되면 맞추기. 이미지는 시안 캡쳐에서 잘라낸 임시 이미지
export const CATEGORIES: Record<CategoryId, { name: string; image: string }> = {
  food: { name: "식비", image: "/images/categories/food.png" },
  household: { name: "생활용품", image: "/images/categories/household.png" },
  cafe: { name: "카페·간식", image: "/images/categories/cafe.png" },
  study: { name: "교육·문구", image: "/images/categories/study.png" },
  hobby: { name: "취미·여가", image: "/images/categories/hobby.png" },
};
