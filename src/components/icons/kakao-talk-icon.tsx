export function KakaoTalkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 26" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M14 1C6.82 1 1 5.6 1 11.27c0 3.66 2.43 6.87 6.09 8.69l-1.24 4.54c-.11.4.35.72.7.49l5.42-3.6c.66.08 1.34.13 2.03.13 7.18 0 13-4.6 13-10.25S21.18 1 14 1Z"
      />
      <text
        x="14"
        y="14.6"
        fill="var(--color-kakao)"
        fontSize="7.2"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        TALK
      </text>
    </svg>
  );
}
