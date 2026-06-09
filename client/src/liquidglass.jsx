import { useState, useRef, useEffect } from "react";

const WALLPAPER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=90";

function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const h = (e) =>
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

/* ── SVG Filters ── */
function GlassFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* Main glass distortion */}
        <filter id="glass-distort" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="1" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="in" />
        </filter>

        {/* Subtle inner glow for rim */}
        <filter id="rim-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft specular on top edge */}
        <linearGradient id="specular-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        <linearGradient id="specular-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
        </linearGradient>

        {/* Tinted inner fill */}
        <linearGradient id="glass-fill" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.16)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── The Core Glass Component ── */
function GlassPane({ children, style, className = "", radius = 28, pill = false }) {
  const r = pill ? 999 : radius;
  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: r,
        overflow: "hidden",
        isolation: "isolate",
        ...style,
      }}
    >
      {/* Layer 1 – blurred backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          backdropFilter: "blur(28px) saturate(2.2) brightness(1.08)",
          WebkitBackdropFilter: "blur(28px) saturate(2.2) brightness(1.08)",
          zIndex: 0,
        }}
      />

      {/* Layer 2 – tinted glass fill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.14) 100%)",
          zIndex: 1,
        }}
      />

      {/* Layer 3 – outer border (rim) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          border: "1px solid rgba(255,255,255,0.55)",
          boxSizing: "border-box",
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* Layer 4 – top specular highlight (the signature Apple shine) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "52%",
          borderRadius: `${r}px ${r}px 60% 60% / 40px 40px 60px 60px`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0.0) 100%)",
          filter: "blur(0.5px)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Layer 5 – bottom rim glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: "30%",
          borderRadius: `0 0 ${r}px ${r}px`,
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.0) 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Layer 6 – inner shadow for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          boxShadow:
            "inset 0 1.5px 1px rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.08)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
    </div>
  );
}

/* ── iOS-style App Icon ── */
function AppIcon({ icon, label, color }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transform: pressed ? "scale(0.88)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <GlassPane
        radius={22}
        style={{
          width: 62,
          height: 62,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
        }}
      >
        <span style={{ position: "relative", zIndex: 10 }}>{icon}</span>
      </GlassPane>
      <span
        style={{
          fontSize: 11,
          color: "white",
          fontWeight: 500,
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          letterSpacing: 0.1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Notification Widget ── */
function NotifWidget() {
  return (
    <GlassPane radius={22} style={{ padding: "14px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #34aadc, #007aff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,122,255,0.4)",
          }}
        >
          📬
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
              marginBottom: 2,
            }}
          >
            Mail
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
            New message from Priya about the design review…
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
          now
        </div>
      </div>
    </GlassPane>
  );
}

/* ── Music Widget ── */
function MusicWidget() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(34);

  return (
    <GlassPane radius={24} style={{ padding: "18px 20px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: "linear-gradient(135deg, #ff6b9d, #c850c0, #4158d0)",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(200,80,192,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          🎵
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.97)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Blinding Lights
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>
            The Weeknd
          </div>
        </div>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(10px)",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.15s",
            flexShrink: 0,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {playing ? "⏸" : "▶"}
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 3,
          borderRadius: 99,
          background: "rgba(255,255,255,0.2)",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 99,
            background: "rgba(255,255,255,0.9)",
            transition: "width 0.1s",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -5,
              top: "50%",
              transform: "translateY(-50%)",
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <span>1:{String(Math.floor(progress * 0.6)).padStart(2, "0")}</span>
        <span>3:20</span>
      </div>
    </GlassPane>
  );
}

/* ── Dock ── */
function Dock() {
  const apps = [
    { icon: "📱", label: "Phone", color: "linear-gradient(135deg,#34c759,#248a3d)" },
    { icon: "💬", label: "Messages", color: "linear-gradient(135deg,#34c759,#30d158)" },
    { icon: "🌐", label: "Safari", color: "linear-gradient(135deg,#007aff,#0040dd)" },
    { icon: "🎵", label: "Music", color: "linear-gradient(135deg,#ff375f,#c4122d)" },
  ];
  return (
    <GlassPane
      radius={28}
      style={{
        padding: "12px 20px",
        display: "inline-flex",
        gap: 20,
        margin: "0 auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {apps.map((a) => (
        <AppIcon key={a.label} {...a} />
      ))}
    </GlassPane>
  );
}

/* ── Status Bar ── */
function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px 4px",
        color: "white",
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      <span style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {["▲▲▲", "WiFi", "🔋"].map((s, i) => (
          <span
            key={i}
            style={{ fontSize: i === 0 ? 10 : 14, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Dynamic Island ── */
function DynamicIsland() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "#000",
          borderRadius: 99,
          width: expanded ? 240 : 118,
          height: expanded ? 56 : 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.38s cubic-bezier(0.34,1.26,0.64,1)",
          overflow: "hidden",
          boxShadow: "0 2px 20px rgba(0,0,0,0.45)",
          gap: 10,
          padding: "0 14px",
        }}
      >
        {expanded ? (
          <>
            <span style={{ fontSize: 22 }}>🎵</span>
            <div>
              <div style={{ fontSize: 11, color: "white", fontWeight: 600 }}>
                Blinding Lights
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>The Weeknd</div>
            </div>
            <span style={{ fontSize: 18, marginLeft: "auto" }}>▶</span>
          </>
        ) : (
          <>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#34c759,#007aff)",
              }}
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: "linear-gradient(135deg,#ff375f,#c4122d)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function LiquidGlass() {
  const mouse = useMouse();

  const lightX = (mouse.x * 100).toFixed(1);
  const lightY = (mouse.y * 100).toFixed(1);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
        position: "relative",
        overflow: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <GlassFilters />

      {/* Wallpaper */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${WALLPAPER})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
          transition: "background-position 0.1s ease-out",
        }}
      />

      {/* Dynamic light overlay that follows mouse */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse 60% 55% at ${lightX}% ${lightY}%, rgba(255,255,255,0.07) 0%, transparent 70%)`,
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 0.06s linear",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 430,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StatusBar />
        <DynamicIsland />

        {/* Main content area */}
        <div style={{ flex: 1, padding: "8px 20px 20px" }}>
          {/* Date header */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              Tuesday
            </div>
            <div
              style={{
                fontSize: 62,
                fontWeight: 200,
                color: "white",
                lineHeight: 1,
                textShadow: "0 2px 20px rgba(0,0,0,0.35)",
                letterSpacing: -2,
              }}
            >
              9
            </div>
          </div>

          {/* Notifications */}
          <NotifWidget />

          {/* Music */}
          <MusicWidget />

          {/* Weather widget */}
          <GlassPane radius={22} style={{ padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
                  Dharān, Nepal
                </div>
                <div style={{ fontSize: 52, fontWeight: 200, color: "white", lineHeight: 1, letterSpacing: -2 }}>
                  24°
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                  Partly Cloudy
                </div>
              </div>
              <div style={{ fontSize: 60, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}>
                ⛅
              </div>
            </div>
            {/* Hourly */}
            <div
              style={{
                display: "flex",
                gap: 0,
                marginTop: 16,
                borderTop: "0.5px solid rgba(255,255,255,0.18)",
                paddingTop: 12,
              }}
            >
              {[
                { t: "Now", i: "⛅", d: "24°" },
                { t: "1PM", i: "🌤", d: "26°" },
                { t: "3PM", i: "☀️", d: "28°" },
                { t: "5PM", i: "🌤", d: "25°" },
                { t: "7PM", i: "🌙", d: "21°" },
              ].map((h) => (
                <div
                  key={h.t}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{h.t}</span>
                  <span style={{ fontSize: 18 }}>{h.i}</span>
                  <span style={{ fontSize: 13, color: "white", fontWeight: 500 }}>{h.d}</span>
                </div>
              ))}
            </div>
          </GlassPane>

          {/* Quick actions row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            {[
              { icon: "🔦", label: "Flashlight" },
              { icon: "📷", label: "Camera" },
              { icon: "⚡", label: "Focus" },
              { icon: "🔒", label: "Lock" },
            ].map((a) => (
              <GlassPane
                key={a.label}
                pill
                style={{
                  flex: 1,
                  padding: "14px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                  {a.label}
                </span>
              </GlassPane>
            ))}
          </div>
        </div>

        {/* Dock */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 20px 36px",
          }}
        >
          <Dock />
        </div>
      </div>
    </div>
  );
}