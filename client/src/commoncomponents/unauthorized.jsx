import styles from "./unauthorized.module.css"

const Unauthorized = () => {
  return (
    <div className={styles.unauthorizedpage}>
      <svg width="680" height="520" viewBox="0 0 680 520" role="img" xmlns="http://www.w3.org/2000/svg">
        <title>Unauthorized access sticker</title>
        <desc>Animated security sticker showing a glowing shield with a lock for an unauthorized/403 page</desc>

        <defs>
          <style>{`
            @keyframes float {
              0%,100% { transform: translateY(0px); }
              50%      { transform: translateY(-12px); }
            }
            @keyframes pulse-ring {
              0%   { r: 148; opacity: 0.55; }
              100% { r: 188; opacity: 0; }
            }
            @keyframes pulse-ring2 {
              0%   { r: 148; opacity: 0.35; }
              100% { r: 210; opacity: 0; }
            }
            @keyframes scan {
              0%   { transform: translateY(0px);   opacity: 0.7; }
              50%  { transform: translateY(120px); opacity: 0.4; }
              100% { transform: translateY(0px);   opacity: 0.7; }
            }
            @keyframes shimmer {
              0%   { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -480; }
            }
            @keyframes badge-pop {
              0%   { transform: scale(0.6); opacity: 0; }
              70%  { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes lock-shake {
              0%,100% { transform: rotate(0deg); }
              15%     { transform: rotate(-4deg); }
              30%     { transform: rotate(4deg); }
              45%     { transform: rotate(-3deg); }
              60%     { transform: rotate(3deg); }
              75%     { transform: rotate(-1deg); }
            }
            @keyframes dot-blink {
              0%,100% { opacity: 0.25; }
              50%     { opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              * { animation: none !important; }
            }
            .floater      { animation: float 3.8s ease-in-out infinite; transform-origin: 340px 260px; }
            .ring1        { animation: pulse-ring 2.6s ease-out infinite; transform-origin: 340px 260px; fill: none; }
            .ring2        { animation: pulse-ring2 2.6s ease-out infinite 1.3s; transform-origin: 340px 260px; fill: none; }
            .scanline     { animation: scan 2.8s ease-in-out infinite; transform-origin: 280px 200px; }
            .shimmer-path { animation: shimmer 2.4s linear infinite; }
            .badge-group  { animation: badge-pop 0.7s cubic-bezier(.36,.07,.19,.97) both 0.5s; transform-origin: 340px 260px; }
            .lock-group   { animation: lock-shake 4s ease-in-out infinite 1.2s; transform-origin: 340px 268px; }
            .dot1 { animation: dot-blink 1.4s ease-in-out infinite 0s; }
            .dot2 { animation: dot-blink 1.4s ease-in-out infinite 0.35s; }
            .dot3 { animation: dot-blink 1.4s ease-in-out infinite 0.7s; }
          `}</style>

          <clipPath id="shield-clip">
            <path d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z" />
          </clipPath>

          <radialGradient id="shield-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#7C6BE8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4A36C5" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="shield-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2a2060" />
            <stop offset="100%" stopColor="#1a1540" />
          </linearGradient>

          <linearGradient id="shield-hi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#AFA9EC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#AFA9EC" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="lock-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#CECBF6" />
            <stop offset="100%" stopColor="#AFA9EC" />
          </linearGradient>

          <linearGradient id="key-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#534AB7" />
            <stop offset="100%" stopColor="#26215C" />
          </linearGradient>

          <linearGradient id="badge-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F09595" />
            <stop offset="100%" stopColor="#E24B4A" />
          </linearGradient>

          <clipPath id="scan-clip">
            <path d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z" />
          </clipPath>
        </defs>

        {/* Pulsing rings */}
        <circle className="ring1" cx="340" cy="260" r="148" stroke="#7C6BE8" strokeWidth="1.5" opacity="0.55" />
        <circle className="ring2" cx="340" cy="260" r="148" stroke="#534AB7" strokeWidth="1"   opacity="0.35" />

        {/* Orbit dots */}
        <g opacity="0.4">
          <circle className="dot1" cx="200" cy="190" r="3"   fill="#AFA9EC" />
          <circle className="dot2" cx="480" cy="195" r="3"   fill="#AFA9EC" />
          <circle className="dot3" cx="210" cy="340" r="3"   fill="#AFA9EC" />
          <circle className="dot1" cx="470" cy="338" r="3"   fill="#AFA9EC" />
          <circle className="dot2" cx="340" cy="140" r="2.5" fill="#AFA9EC" />
          <circle className="dot3" cx="340" cy="395" r="2.5" fill="#AFA9EC" />
        </g>

        {/* Floating group */}
        <g className="floater">

          {/* Shield shadow */}
          <ellipse cx="340" cy="375" rx="72" ry="10" fill="#26215C" opacity="0.25" />

          {/* Shield body */}
          <path d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z" fill="url(#shield-face)" />
          <path d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z" fill="url(#shield-glow)" />

          {/* Grid texture */}
          <g clipPath="url(#shield-clip)" opacity="0.08">
            <line x1="248" y1="168" x2="432" y2="168" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="192" x2="432" y2="192" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="216" x2="432" y2="216" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="240" x2="432" y2="240" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="264" x2="432" y2="264" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="288" x2="432" y2="288" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="312" x2="432" y2="312" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="248" y1="336" x2="432" y2="336" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="270" y1="138" x2="270" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="294" y1="138" x2="294" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="318" y1="138" x2="318" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="342" y1="138" x2="342" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="366" y1="138" x2="366" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="390" y1="138" x2="390" y2="365" stroke="#AFA9EC" strokeWidth="1" />
            <line x1="414" y1="138" x2="414" y2="365" stroke="#AFA9EC" strokeWidth="1" />
          </g>

          {/* Scanline */}
          <g clipPath="url(#scan-clip)">
            <rect className="scanline" x="248" y="138" width="184" height="18" rx="4" fill="#AFA9EC" opacity="0.12" />
          </g>

          {/* Shimmer border */}
          <path
            className="shimmer-path"
            d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z"
            fill="none" stroke="#AFA9EC" strokeWidth="2" strokeDasharray="40 440" opacity="0.6"
          />

          {/* Shield border */}
          <path d="M340,138 L432,170 L432,268 Q432,320 340,360 Q248,320 248,268 L248,170 Z" fill="none" stroke="#534AB7" strokeWidth="2" opacity="0.7" />

          {/* Highlight edges */}
          <path d="M340,138 L432,170" stroke="url(#shield-hi)" strokeWidth="2.5" fill="none" />
          <path d="M340,138 L248,170" stroke="url(#shield-hi)" strokeWidth="2.5" fill="none" />

          {/* Lock */}
          <g className="lock-group">
            <path d="M316,262 L316,244 Q316,220 340,220 Q364,220 364,244 L364,262" fill="none" stroke="url(#lock-grad)" strokeWidth="10" strokeLinecap="round" />
            <rect x="302" y="258" width="76" height="58" rx="10" fill="url(#lock-grad)" />
            <circle cx="340" cy="280" r="11" fill="url(#key-grad)" />
            <rect x="336" y="280" width="8" height="16" rx="4" fill="url(#key-grad)" />
          </g>

          {/* 403 badge */}
          <g className="badge-group">
            <circle cx="408" cy="172" r="22" fill="#A32D2D" opacity="0.9" />
            <circle cx="408" cy="172" r="22" fill="url(#badge-red)" opacity="0.6" />
            <circle cx="408" cy="172" r="22" fill="none" stroke="#F09595" strokeWidth="1.5" opacity="0.7" />
            <text x="408" y="178" textAnchor="middle"
              fontFamily="'Segoe UI', Arial, sans-serif"
              fontSize="12" fontWeight="600" fill="#FCEBEB">403</text>
          </g>

        </g>

        {/* Label */}
        <text x="340" y="420" textAnchor="middle"
          fontFamily="'Segoe UI', Arial, sans-serif"
          fontSize="22" fontWeight="500" letterSpacing="3" fill="#CECBF6">UNAUTHORIZED</text>

        {/* Subtitle */}
        <text x="340" y="448" textAnchor="middle"
          fontFamily="'Segoe UI', Arial, sans-serif"
          fontSize="13" fontWeight="400" fill="#7F77DD" opacity="0.75">You don't have permission to access this page</text>

        {/* Decorative line */}
        <line x1="240" y1="462" x2="440" y2="462" stroke="#534AB7" strokeWidth="0.75" opacity="0.4" />
        <circle cx="240" cy="462" r="2" fill="#534AB7" opacity="0.4" />
        <circle cx="440" cy="462" r="2" fill="#534AB7" opacity="0.4" />

      </svg>
    </div>
  );
};

export default Unauthorized;