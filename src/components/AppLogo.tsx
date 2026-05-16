/** Sidebar brand lockup — SVG mark + wordmark (email lives in the header). */

type AppLogoProps = {
  className?: string
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <div
      className={`flex items-center gap-3 min-w-0 ${className ?? ''}`}
      aria-label="Mini Tasks"
    >
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="app-logo-face"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width={40} height={40} rx={11} fill="url(#app-logo-face)" />
        {/* List cues (left) */}
        <path
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.9}
          d="M10 14h9 M10 20h9 M10 26h7"
        />
        {/* Check (right) */}
        <path
          fill="none"
          stroke="white"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 20l4 4 9-11"
        />
      </svg>
      <span className="font-heading min-w-0 font-semibold text-[1.05rem] leading-tight tracking-tight gradient-text">
        Mini Tasks
      </span>
    </div>
  )
}
