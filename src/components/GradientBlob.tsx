
export default function GradientBlob({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="colorful background blob"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd29f" />
          <stop offset="40%" stopColor="#fbc2eb" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>

        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {/* big blob */}
      <g filter="url(#blur)">
        <path
          d="M461.4,68.9C510.8,91.6,548.3,129,571,178.4C593.7,227.7,601.5,288.9,580.3,333.4C559.1,378,508.9,405.9,462.7,440.7
          C416.4,475.6,374.3,517.4,324.9,533.1C275.6,548.8,219,538.5,169.3,519.2C119.7,499.8,76.9,471.6,57.5,426.5C38.1,381.4,41.9,319.5,67.9,276.6
          C93.9,233.7,141,209.8,187.2,183.4C233.4,157.1,278.6,128.2,326.4,116.3C374.3,104.4,412.1,101.2,461.4,68.9Z"
          fill="url(#g1)"
          transform="translate(40 40) scale(0.9)"
          opacity="0.95"
        />
      </g>

      {/* subtle white glossy overlay */}
      <path
        d="M220 180c30-40 80-60 130-58 50 2 90 30 120 66"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
