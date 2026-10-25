type IconProps = React.SVGProps<SVGSVGElement>;

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M10.6 2.6a2.2 2.2 0 0 1 2.8 0l7.4 6.1c.5.4.8 1 .8 1.7v9.3c0 1.2-1 2.3-2.3 2.3H15v-5.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V22H4.7c-1.2 0-2.2-1-2.2-2.3v-9.3c0-.7.3-1.3.8-1.7l7.3-6.1Z"
      />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="11" width="4.5" height="10" rx="1.2" fill="currentColor" />
      <rect x="9.75" y="3" width="4.5" height="18" rx="1.2" fill="currentColor" />
      <rect x="16.5" y="8" width="4.5" height="13" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="7.5" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 21.5v-1.8c0-2.6 2.1-4.7 4.7-4.7h7.6c2.6 0 4.7 2.1 4.7 4.7v1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2a1.5 1.5 0 0 1 1.5 1.5v.6a6.8 6.8 0 0 1 5.3 6.6v4.1l1.9 2.6c.5.7 0 1.6-.8 1.6H4.1c-.8 0-1.3-.9-.8-1.6l1.9-2.6v-4.1a6.8 6.8 0 0 1 5.3-6.6v-.6A1.5 1.5 0 0 1 12 2Zm-2.6 18h5.2a2.6 2.6 0 0 1-5.2 0Z"
      />
    </svg>
  );
}
