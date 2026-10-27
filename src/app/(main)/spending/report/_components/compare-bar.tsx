type Marker = {
  /** 막대 길이 기준(0~max) 위치 */
  value: number;
  label: string;
  color: string;
};

type Props = {
  value: number;
  max: number;
  /** 막대 오른쪽에 붙는 변화량 (예: -20,000원, +5%) */
  change: string;
  markers: Marker[];
  label: string;
};

/** 이번 달 값을 채운 가로 막대 + 비교 기준선(목표 예산, 지난달) */
export function CompareBar({ value, max, change, markers, label }: Props) {
  const percent = (v: number) => `${Math.min(100, (v / max) * 100)}%`;

  return (
    <div role="img" aria-label={label} className="pb-6">
      <div className="relative h-7 rounded-full bg-field">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: percent(value) }}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 pl-2 text-sm font-semibold text-[#f05b9c]"
          style={{ left: percent(value) }}
        >
          {change}
        </span>
        {markers.map((marker) => (
          <div
            key={marker.label}
            className="absolute -top-1 -bottom-1 border-l border-dashed"
            style={{ left: percent(marker.value), borderColor: marker.color }}
          >
            <span
              className="absolute top-[calc(100%+4px)] left-0 -translate-x-1/2 rounded-full bg-white px-1.5 text-[9px] whitespace-nowrap ring-1 ring-inset"
              style={{ color: marker.color, ["--tw-ring-color" as string]: marker.color }}
            >
              {marker.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
