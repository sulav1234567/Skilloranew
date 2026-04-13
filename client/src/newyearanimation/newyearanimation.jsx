import { useEffect, useRef, useState, useCallback } from "react";
import logo from "../assets/image.svg"
 
/* ─── Particle ──────────────────────────────────────────────────── */
class Particle {
  constructor(x, y, color, angle, speed, life, type = "burst") {
    this.x = x; this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color; this.life = life; this.maxLife = life;
    this.size = type === "glitter" ? Math.random() * 1.5 + 0.4 : Math.random() * 3 + 1.2;
    this.gravity = type === "glitter" ? 0.04 : 0.09;
    this.drag   = type === "glitter" ? 0.995 : 0.982;
    this.trail  = []; this.type = type;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 7) this.trail.shift();
    this.x += this.vx; this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= this.drag; this.vy *= this.drag;
    this.life--;
  }
  draw(ctx) {
    const a = Math.pow(this.life / this.maxLife, 0.6);
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.save();
      ctx.globalAlpha = (i / this.trail.length) * a * 0.45;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.type === "glitter" ? 5 : 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
 
/* ─── Rocket ────────────────────────────────────────────────────── */
class Rocket {
  constructor(x, canvasH, palette) {
    this.x = x; this.y = canvasH;
    this.vy = -(Math.random() * 5 + 9);
    this.targetY = Math.random() * canvasH * 0.45 + canvasH * 0.06;
    this.palette = palette; this.color = palette[0];
    this.trail = [];
    this.wobble = (Math.random() - 0.5) * 0.4;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 14) this.trail.shift();
    this.x += this.wobble; this.y += this.vy; this.vy += 0.14;
    return this.y <= this.targetY;
  }
  draw(ctx) {
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.save();
      ctx.globalAlpha = (i / this.trail.length) * 0.9;
      ctx.fillStyle = i < this.trail.length * 0.4 ? "#fff" : this.color;
      ctx.shadowColor = this.color; ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 3 * (i / this.trail.length), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
 
/* ─── Color palettes ────────────────────────────────────────────── */
const PALETTES = [
  ["#ff4e6b", "#ff9a3c", "#ffef60", "#ff2d78"],
  ["#00f5ff", "#00aaff", "#a855f7", "#7c3aed"],
  ["#39ff14", "#00ffaa", "#00ff88", "#22c55e"],
  ["#ff00ff", "#ff0099", "#cc00cc", "#ff66ff"],
  ["#ffd700", "#ffb700", "#ff8c00", "#fff176"],
  ["#00ffff", "#00bfff", "#0ea5e9", "#38bdf8"],
  ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
  ["#dc2626", "#ffffff", "#1e40af"],          // Nepal flag colours
];
 
/* ─── Explosion factory ─────────────────────────────────────────── */
function createExplosion(x, y, palette) {
  const ps = []; const style = Math.random();
  if (style < 0.3) {
    const n = Math.floor(Math.random() * 40 + 70);
    for (let i = 0; i < n; i++) {
      ps.push(new Particle(x, y, palette[Math.floor(Math.random() * palette.length)],
        (i / n) * Math.PI * 2, Math.random() * 1.5 + 3.5, Math.floor(Math.random() * 35 + 55)));
    }
  } else if (style < 0.58) {
    const n = Math.floor(Math.random() * 50 + 80);
    for (let i = 0; i < n; i++) {
      ps.push(new Particle(x, y, palette[i % palette.length],
        Math.random() * Math.PI * 2, Math.random() * 4 + 2, Math.floor(Math.random() * 40 + 50)));
    }
  } else if (style < 0.76) {
    for (let r = 0; r < 2; r++) {
      const n = 30 + r * 20;
      for (let i = 0; i < n; i++) {
        ps.push(new Particle(x, y, palette[r % palette.length],
          (i / n) * Math.PI * 2, 2.5 + r * 2.5, Math.floor(Math.random() * 30 + 45)));
      }
    }
  } else {
    for (let a = 0; a < 5; a++) {
      const base = (a / 5) * Math.PI * 2;
      for (let i = 0; i < 20; i++) {
        ps.push(new Particle(x, y, palette[a % palette.length],
          base + (Math.random() - 0.5) * 0.5, Math.random() * 3 + 2, Math.floor(Math.random() * 40 + 50)));
      }
    }
  }
  // Glitter
  for (let i = 0; i < 28; i++) {
    ps.push(new Particle(x, y, "#ffffff",
      Math.random() * Math.PI * 2, Math.random() * 2 + 0.5,
      Math.floor(Math.random() * 35 + 20), "glitter"));
  }
  return ps;
}
 
/* ─── Main component ─────────────────────────────────────────────── */
/**
 * NepaliNewYear2083
 *
 * Props:
 *   height      {string}  CSS height for the container  (default "100vh")
 *   minHeight   {string}  CSS min-height                (default "520px")
 *
 * Usage:
 *   <NepaliNewYear2083 />
 *   <NepaliNewYear2083 height="600px" />
 *
 * Background is fully transparent — place this component over any
 * dark background (e.g. a hero section) for best results.
 */
export default function NepaliNewYear2083({ height = "100vh", minHeight = "520px" }) {
  const canvasRef  = useRef(null);
  const logoInput  = useRef(null);
  const stateRef   = useRef({ particles: [], rockets: [], frame: 0, animId: null });
 
  const [showText, setShowText] = useState(false);
  const [pulse,    setPulse   ] = useState(0);
  const [logoName, setLogoName] = useState("SkillOra");
  const [logoDrag, setLogoDrag] = useState(false);
 
  /* ── Logo handlers ── */
  
 
 
  /* ── Canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;
 
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
 
    setTimeout(() => setShowText(true), 600);
 
    function launch() {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      s.rockets.push(new Rocket(x, canvas.height, palette));
    }
 
    for (let i = 0; i < 4; i++) setTimeout(launch, i * 220);
    const launchTimer = setInterval(() => {
      const burst = Math.random() < 0.25 ? 3 : Math.random() < 0.5 ? 2 : 1;
      for (let i = 0; i < burst; i++) setTimeout(launch, i * 140);
    }, 500);
 
    let pulseAnimId, pAngle = 0;
    function animPulse() {
      pAngle += 0.025;
      setPulse(Math.sin(pAngle));
      pulseAnimId = requestAnimationFrame(animPulse);
    }
    pulseAnimId = requestAnimationFrame(animPulse);
 
    function animate() {
      s.animId = requestAnimationFrame(animate);
      const W = canvas.width, H = canvas.height;
 
      /* --- Transparent trail fade using destination-out compositing ---
         This erases ~15% of each pixel's opacity each frame, so old
         particle dots fade to fully transparent (not to a dark colour).
         The canvas background stays transparent throughout.            */
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
 
      // Rockets
      s.rockets = s.rockets.filter((r) => {
        r.draw(ctx);
        const exploded = r.update();
        if (exploded) { s.particles.push(...createExplosion(r.x, r.y, r.palette)); return false; }
        return true;
      });
 
      // Particles
      s.particles = s.particles.filter((p) => { p.draw(ctx); p.update(); return p.life > 0; });
    }
    animate();
 
    return () => {
      cancelAnimationFrame(s.animId);
      cancelAnimationFrame(pulseAnimId);
      clearInterval(launchTimer);
      ro.disconnect();
    };
  }, []);
 
  /* ── Derived glow values ── */
  const glow1 = 18 + pulse * 14;
  const glow2 = 28 + pulse * 18;
 
  /* ── Styles ── */
  const S = {
    wrap: {
      position: "fixed",
      top:0,
      left:0,
      zIndex:9999,
      width: "100%",
      height,
      minHeight,
      background: "rgba(0, 0, 0, 0.8)",       // ← fully transparent
      overflow: "hidden",
      fontFamily: "'Noto Serif Devanagari', 'Palatino Linotype', Palatino, serif",
      userSelect: "none",
    },
    canvas: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    overlay: {
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      pointerEvents: "none", gap: 0,
    },
    // Logo zone (pointer-events re-enabled for this subtree)
    logoZone: {
      pointerEvents: "auto",
      marginBottom: "18px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
    },
    logoBox: (drag) => ({
      width: "96px", height: "96px",
      borderRadius: "50%",
      backgroundColor:"rgba(255,255,255,0.5)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      cursor: "pointer",
      transition: "border-color .2s, background .2s",
      overflow: "hidden",
      position: "relative",
    }),
    logoImg: { width: "100%", height: "100%", objectFit: "contain", padding: "6px" },
    uploadHint: {
      fontSize: "10px", letterSpacing: ".08em",
      color: "rgba(255,255,255,0.5)", textAlign: "center",
      lineHeight: 1.4, padding: "0 8px",
    },
    removeBtn: {
      position: "absolute", top: "4px", right: "4px",
      width: "18px", height: "18px", borderRadius: "50%",
      background: "rgba(220,38,38,0.85)", border: "none",
      color: "#fff", fontSize: "11px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      lineHeight: 1,
    },
    logoLabel: {
      fontSize: "14px", letterSpacing: ".12em",
      color: "rgba(255, 255, 255, 0.91)", textTransform: "uppercase",
      maxWidth: "120px", textAlign: "center",
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
  };
 
  return (
    <div style={S.wrap}>
      {/* Canvas layer */}
      <canvas ref={canvasRef} style={S.canvas} />
 
      {/* Text + logo overlay */}
      <div style={S.overlay}>
 
        {/* ── Company Logo ── */}
        <div style={S.logoZone}>
          
          <div
            style={S.logoBox(logoDrag)}
           
           
            title="Click or drag & drop your company logo"
          >
            
              <>
                <img src={logo} alt="Company logo" style={S.logoImg} />
              </>
           
          </div>
          {logoName ? (
            <span style={S.logoLabel}>{logoName}</span>
          ) : (
            <span style={S.logoLabel}>Your company logo</span>
          )}
        </div>
 
        {/* ── शुभ ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 1.4s ease .3s, transform 1.4s cubic-bezier(.16,1,.3,1) .3s",
          fontSize: "clamp(12px, 2.4vw, 20px)",
          letterSpacing: ".5em",
          color: `rgba(255,230,120,${.8 + pulse * .2})`,
          textShadow: `0 0 ${glow1}px rgba(255,200,60,.9), 0 0 ${glow2}px rgba(255,140,0,.5)`,
          marginBottom: "2px",
        }}>
          शुभ
        </div>
 
        {/* ── नयाँ वर्ष ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.3s ease .45s, transform 1.3s cubic-bezier(.16,1,.3,1) .45s",
          fontSize: "clamp(28px, 7vw, 64px)",
          fontWeight: "bold",
          lineHeight: 1.1,
          letterSpacing: ".04em",
          color: "#fff",
          textShadow: `0 0 ${glow1}px rgba(255,255,255,.7), 0 0 ${glow2}px rgba(200,180,255,.5)`,
          marginBottom: "4px",
        }}>
          नयाँ वर्ष
        </div>
 
        {/* ── 2083 ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transform: showText ? "scale(1)" : "scale(.72)",
          transition: "opacity 1.2s ease .1s, transform 1.4s cubic-bezier(.16,1,.3,1) .1s",
          fontSize: "clamp(64px, 18vw, 160px)",
          fontWeight: "bold",
          lineHeight: .92,
          letterSpacing: "-3px",
          background: "linear-gradient(135deg, #ffe766 0%, #ff9a00 22%, #ff4500 44%, #ff00cc 68%, #aa00ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 ${glow1}px rgba(255,180,0,.55)) drop-shadow(0 0 ${glow2}px rgba(255,80,200,.35))`,
        }}>
          २०८३
        </div>
 
        {/* ── Nepali New Year subtitle ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(-24px)",
          transition: "opacity 1.4s ease .55s, transform 1.4s cubic-bezier(.16,1,.3,1) .55s",
          fontSize: "clamp(11px, 2.6vw, 22px)",
          letterSpacing: ".55em",
          color: `rgba(220,210,255,${.75 + pulse * .25})`,
          textTransform: "uppercase",
          textShadow: `0 0 ${glow1}px rgba(180,140,255,.9), 0 0 ${glow2}px rgba(120,60,255,.5)`,
          marginTop: "6px",
        }}>
          Nepali New Year
        </div>
 
        {/* ── Divider ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transition: "opacity 2s ease 1s",
          width: "clamp(110px, 28vw, 260px)",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,210,80,.55), transparent)",
          margin: "16px 0 12px",
        }} />
 
        {/* ── Tagline ── */}
        <div style={{
          opacity: showText ? 1 : 0,
          transition: "opacity 2s ease 1.2s",
          fontSize: "clamp(8px, 1.2vw, 11px)",
          letterSpacing: ".28em",
          color: "rgba(200,200,230,.4)",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "0 20px",
        }}>
          नेपाल&nbsp;✦&nbsp;२०८३&nbsp;✦&nbsp;Bikram Sambat
        </div>
 
      </div>
    </div>
  );
}