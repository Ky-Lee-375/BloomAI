interface BloomMarkProps {
  className?: string;
  animated?: boolean;
}

/**
 * A single-line, hand-drawn-feeling bloom used as the app's signature motif:
 * in the header mark, as step indicators in the wizard, and as decorative
 * dividers. Rendered as stroked paths so it reads as "sketched" rather than
 * a stock flat icon.
 */
export function BloomMark({ className = "", animated = false }: BloomMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g className={animated ? "animate-drift" : undefined} style={{ transformOrigin: "32px 32px" }}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="32"
            cy="20"
            rx="7"
            ry="13"
            transform={`rotate(${angle} 32 32)`}
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
        ))}
        <circle cx="32" cy="32" r="4.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </g>
    </svg>
  );
}
