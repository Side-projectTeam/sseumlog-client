import type { CategoryId } from "./types";

type Category = {
  name: string;
  /** 그래프처럼 좁은 곳에 쓰는 이름 */
  shortName: string;
  /** 선반·기록에 쓰는 3D 아이콘. 아직 에셋이 없으면 null */
  image: string | null;
};

// 이름은 예산 설정 시안 기준. 이미지는 시안 캡쳐에서 잘라낸 임시 이미지
// TODO: 패션, 뷰티/미용, 기타 아이콘 에셋 받기
export const CATEGORIES: Record<CategoryId, Category> = {
  food: { name: "음식/식사", shortName: "식사", image: "/images/categories/food.png" },
  household: { name: "생활", shortName: "생활", image: "/images/categories/household.png" },
  cafe: { name: "카페/간식", shortName: "카페", image: "/images/categories/cafe.png" },
  study: { name: "책/문구", shortName: "문구", image: "/images/categories/study.png" },
  hobby: { name: "여가", shortName: "여가", image: "/images/categories/hobby.png" },
  fashion: { name: "패션", shortName: "패션", image: null },
  beauty: { name: "뷰티/미용", shortName: "뷰티", image: null },
  etc: { name: "기타", shortName: "기타", image: null },
};
