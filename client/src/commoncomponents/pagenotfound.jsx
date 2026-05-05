import { useEffect } from "react";
import { useNavigate } from "react-router";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-scene {

    position: relative;
    width: 100vw;
    height:100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding:50px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nf-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nf-astro-wrap {
    animation: nfFloat 5s ease-in-out infinite;
    transform-origin: center;
    margin-bottom: -16px;
  }

  @keyframes nfFloat {
    0%,100% { transform: translateY(0px) rotate(-1.5deg); }
    50%      { transform: translateY(-22px) rotate(1.5deg); }
  }

  .nf-code-row {
    display: flex;
    align-items: center;
    line-height: 1;
  }

  .nf-digit {
    font-size: 140px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -6px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nf-digit-mid {
    font-size: 140px;
    font-weight: 700;
    letter-spacing: -6px;
    color: transparent;
    -webkit-text-stroke: 3px #1a1a2e;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nf-tagline {
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 5px;
    color: #8b8fa8;
    text-transform: uppercase;
    margin-top: 10px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nf-sub {
    font-size: 15px;
    font-weight: 400;
    color: #5a5e7a;
    margin-top: 12px;
    text-align: center;
    max-width: 320px;
    line-height: 1.6;
    font-family: 'Space Grotesk', sans-serif;
  }

  .nf-btn {
    margin-top: 28px;
    padding: 12px 32px;
    border-radius: 999px;
    border: none;
    background: #1701bf;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    transition: transform 0.15s, background 0.15s;
    text-decoration: none;
    display: inline-block;
  }

  .nf-btn:hover { background: #0000c8; transform: translateY(-2px); }
  .nf-btn:active { transform: scale(0.97); }

  .nf-planet-big {
    position: absolute;
    top: 40px;
    right: 60px;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #c4b5fd, #4c1d95);
    animation: nfFloatSlow 7s ease-in-out infinite;
  }

  .nf-planet-big::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 22px;
    border: 2px solid rgba(167,139,250,0.4);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateX(70deg);
  }

  .nf-planet-sm {
    position: absolute;
    bottom: 80px;
    left: 50px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #6ee7b7, #065f46);
    animation: nfFloatSlow 9s ease-in-out infinite reverse;
  }

  @keyframes nfFloatSlow {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-14px); }
  }

  .nf-star {
    position: absolute;
    border-radius: 50%;
    background: #a0a8c8;
    animation: nfTwinkle var(--dur, 2.5s) ease-in-out infinite alternate;
    animation-delay: var(--del, 0s);
  }

  @keyframes nfTwinkle {
    from { opacity: 0.15; transform: scale(0.7); }
    to   { opacity: 0.9;  transform: scale(1); }
  }
`;

const stars = [
  { size: 3, top: "8%",  left: "12%", dur: "2.1s", del: "0s"   },
  { size: 2, top: "15%", left: "35%", dur: "3s",   del: "0.4s" },
  { size: 4, top: "6%",  left: "60%", dur: "2.5s", del: "0.9s" },
  { size: 2, top: "20%", left: "80%", dur: "3.5s", del: "0.2s" },
  { size: 3, top: "70%", left: "88%", dur: "2.8s", del: "0.7s" },
  { size: 2, top: "82%", left: "70%", dur: "2.2s", del: "1.1s" },
  { size: 3, top: "88%", left: "22%", dur: "3.2s", del: "0.5s" },
  { size: 2, top: "50%", left: "6%",  dur: "2.7s", del: "1.4s" },
  { size: 2, top: "40%", left: "95%", dur: "2.4s", del: "0.3s" },
];

function Astronaut() {
  return (
    <svg width="130" height="160" viewBox="0 0 130 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nf-hgrd" cx="30%" cy="25%" r="70%">
          <stop offset="0%"   stopColor="#93c5fd" />
          <stop offset="55%"  stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <radialGradient id="nf-sgrd" cx="30%" cy="20%" r="70%">
          <stop offset="0%"   stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Backpack */}
      <rect x="44" y="78" width="22" height="32" rx="6" fill="#94a3b8" />
      <rect x="47" y="82" width="16" height="10" rx="3" fill="#64748b" />
      <circle cx="55" cy="102" r="3.5" fill="#fbbf24" />

      {/* Body */}
      <rect x="36" y="80" width="68" height="50" rx="18" fill="url(#nf-sgrd)" />
      <rect x="46" y="88" width="48" height="7" rx="3" fill="#e2e8f0" opacity="0.7" />
      <circle cx="70" cy="113" r="6" fill="#bfdbfe" opacity="0.7" />
      <circle cx="70" cy="113" r="3" fill="#3b82f6" />

      {/* Left arm */}
      <rect x="22" y="84" width="18" height="36" rx="9" fill="url(#nf-sgrd)" transform="rotate(-18 31 102)" />
      <circle cx="18" cy="117" r="8" fill="#cbd5e1" />

      {/* Right arm */}
      <rect x="98" y="78" width="18" height="36" rx="9" fill="url(#nf-sgrd)" transform="rotate(22 107 96)" />
      <circle cx="114" cy="109" r="8" fill="#cbd5e1" />

      {/* Legs */}
      <rect x="48" y="122" width="16" height="28" rx="8" fill="url(#nf-sgrd)" transform="rotate(-6 56 136)" />
      <rect x="74" y="122" width="16" height="28" rx="8" fill="url(#nf-sgrd)" transform="rotate(6 82 136)" />
      <rect x="42" y="142" width="20" height="12" rx="6" fill="#64748b" transform="rotate(-6 52 148)" />
      <rect x="74" y="142" width="20" height="12" rx="6" fill="#64748b" transform="rotate(6 84 148)" />

      {/* Helmet */}
      <circle cx="70" cy="60" r="36" fill="#1e3a5f" opacity="0.95" />
      <circle cx="70" cy="60" r="32" fill="url(#nf-hgrd)" />
      <ellipse cx="60" cy="48" rx="11" ry="7" fill="white" opacity="0.12" transform="rotate(-18 60 48)" />
      <ellipse cx="56" cy="45" rx="5" ry="3" fill="white" opacity="0.22" transform="rotate(-18 56 45)" />
      <circle cx="70" cy="60" r="36" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
      <circle cx="70" cy="60" r="32" fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.35" />

      {/* Eyes */}
      <circle cx="60" cy="57" r="4.5" fill="#fde68a" />
      <circle cx="61" cy="56" r="2.2" fill="#1e293b" />
      <circle cx="61.8" cy="55.2" r="0.9" fill="white" />
      <circle cx="80" cy="57" r="4.5" fill="#fde68a" />
      <circle cx="81" cy="56" r="2.2" fill="#1e293b" />
      <circle cx="81.8" cy="55.2" r="0.9" fill="white" />

      {/* Worried mouth */}
      <path d="M63 70 Q70 66 77 70" fill="none" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Antenna */}
      <line x1="70" y1="24" x2="70" y2="14" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="70" cy="11" r="4" fill="#f87171">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Tether line */}
      <path
        d="M114 109 Q140 90 160 70"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.5"
      />
    </svg>
  );
}

export default function NotFound404() {
    let navigate = useNavigate()
  useEffect(() => {
    const id = "nf404-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = styles;
      document.head.appendChild(el);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="nf-scene">
      {/* Twinkling stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="nf-star"
          style={{
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            "--dur": s.dur,
            "--del": s.del,
          }}
        />
      ))}

      {/* Decorative planets */}
      <div className="nf-planet-big" />
      <div className="nf-planet-sm" />

      {/* Main content */}
      <div className="nf-content">
        <div className="nf-astro-wrap">
          <Astronaut />
        </div>

        <div className="nf-code-row">
          <span className="nf-digit">4</span>
          <span className="nf-digit-mid">0</span>
          <span className="nf-digit">4</span>
        </div>

        <div className="nf-tagline">Page not found</div>

        <p className="nf-sub">
          Looks like this page drifted into deep space. The astronaut's looking for it too.
        </p>

        <button className="nf-btn" onClick={()=>{
            navigate("/",{replace:true})

        }}>
          ← Go back home
        </button>
      </div>
    </div>
  );
}