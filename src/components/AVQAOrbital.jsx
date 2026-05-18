import React, { useEffect, useMemo, useRef, useState } from 'react';

const SIZE = 680;
const CENTER = SIZE / 2;
const DISPLAY_MAX = 460;

const SKILLS = [
  {
    name: 'Selenium',
    color: '#43b02a',
    orbit: 'outer',
    radius: 250,
    speed: 0.28,
    dir: 1,
    startAngle: -Math.PI / 2,
    description: 'Browser automation for robust UI regression coverage.',
    icon: 'selenium'
  },
  {
    name: 'Playwright',
    color: '#2ead6e',
    orbit: 'outer',
    radius: 250,
    speed: 0.28,
    dir: 1,
    startAngle: -Math.PI / 2 + (Math.PI * 2) / 4,
    description: 'Fast, reliable end-to-end testing across modern browsers.',
    icon: 'playwright'
  },
  {
    name: 'Load Testing',
    color: '#f97316',
    orbit: 'outer',
    radius: 250,
    speed: 0.28,
    dir: 1,
    startAngle: -Math.PI / 2 + (Math.PI * 2 * 2) / 4,
    description: 'Performance and scalability validation under traffic stress.',
    icon: 'load'
  },
  {
    name: 'Manual Testing',
    color: '#e879f9',
    orbit: 'outer',
    radius: 250,
    speed: 0.28,
    dir: 1,
    startAngle: -Math.PI / 2 + (Math.PI * 2 * 3) / 4,
    description: 'Exploratory checks for UX quality and edge-case discovery.',
    icon: 'manual'
  },
  {
    name: 'Java',
    color: '#f89820',
    orbit: 'mid',
    radius: 175,
    speed: 0.42,
    dir: -1,
    startAngle: -Math.PI / 2,
    description: 'Core language for test frameworks and automation logic.',
    icon: 'java'
  },
  {
    name: 'Postman',
    color: '#ff6c37',
    orbit: 'mid',
    radius: 175,
    speed: 0.42,
    dir: -1,
    startAngle: -Math.PI / 2 + (Math.PI * 2) / 4,
    description: 'API validation, collections, and quick workflow checks.',
    icon: 'postman'
  },
  {
    name: 'CI/CD',
    color: '#00e5ff',
    orbit: 'mid',
    radius: 175,
    speed: 0.42,
    dir: -1,
    startAngle: -Math.PI / 2 + (Math.PI * 2 * 2) / 4,
    description: 'Automated pipelines for continuous quality gates.',
    icon: 'cicd'
  },
  {
    name: 'Bug Tracking',
    color: '#ef4444',
    orbit: 'mid',
    radius: 175,
    speed: 0.42,
    dir: -1,
    startAngle: -Math.PI / 2 + (Math.PI * 2 * 3) / 4,
    description: 'Defect lifecycle management and triage discipline.',
    icon: 'bug'
  },
  {
    name: 'API Testing',
    color: '#7c3aed',
    orbit: 'inner',
    radius: 105,
    speed: 0.6,
    dir: 1,
    startAngle: -Math.PI / 2,
    description: 'Contract, schema, and status validation for service quality.',
    icon: 'api'
  },
  {
    name: 'TestNG',
    color: '#facc15',
    orbit: 'inner',
    radius: 105,
    speed: 0.6,
    dir: 1,
    startAngle: -Math.PI / 2 + (Math.PI * 2) / 3,
    description: 'Structured suite execution and reporting in Java.',
    icon: 'testng'
  },
  {
    name: 'Agile/Scrum',
    color: '#34d399',
    orbit: 'inner',
    radius: 105,
    speed: 0.6,
    dir: 1,
    startAngle: -Math.PI / 2 + (Math.PI * 2 * 2) / 3,
    description: 'Iterative collaboration and quality in delivery cadence.',
    icon: 'agile'
  }
];

function drawIcon(ctx, icon, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  if (icon === 'selenium') {
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.moveTo(0, -12);
    ctx.lineTo(0, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d6ffe5';
    ctx.font = 'bold 7px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Se', 0, 20);
  } else if (icon === 'playwright') {
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(12, 0);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(-4, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  } else if (icon === 'load') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(-12, 4, 4, 8);
    ctx.rect(-5, 1, 4, 11);
    ctx.rect(2, -3, 4, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-13, -6);
    ctx.quadraticCurveTo(-4, -12, 8, -7);
    ctx.stroke();
  } else if (icon === 'manual') {
    ctx.beginPath();
    ctx.moveTo(-10, 7);
    ctx.quadraticCurveTo(-11, 0, -7, -2);
    ctx.lineTo(-7, -9);
    ctx.lineTo(-4, -9);
    ctx.lineTo(-3, -2);
    ctx.lineTo(-1, -10);
    ctx.lineTo(2, -10);
    ctx.lineTo(2, -1);
    ctx.lineTo(4, -9);
    ctx.lineTo(7, -9);
    ctx.lineTo(6, -1);
    ctx.lineTo(8, -7);
    ctx.lineTo(11, -6);
    ctx.lineTo(9, 8);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6, 1);
    ctx.lineTo(7, 1);
    ctx.moveTo(-5, 4);
    ctx.lineTo(6, 4);
    ctx.stroke();
  } else if (icon === 'java') {
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.quadraticCurveTo(-1, -13, 2, -9);
    ctx.quadraticCurveTo(4, -7, 0, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.lineTo(8, 2);
    ctx.moveTo(-8, 6);
    ctx.lineTo(10, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(8, 4, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === 'postman') {
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-5, 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-3, 3);
    ctx.lineTo(8, -7);
    ctx.stroke();
  } else if (icon === 'cicd') {
    const pts = [
      [-8, -7],
      [8, -7],
      [-8, 7],
      [8, 7]
    ];
    ctx.beginPath();
    for (const p of pts) {
      ctx.moveTo(p[0] + 2, p[1]);
      ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-8, -7);
    ctx.lineTo(-8, 7);
    ctx.moveTo(8, -7);
    ctx.lineTo(8, 7);
    ctx.stroke();
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(-8, -7);
    ctx.lineTo(8, -7);
    ctx.moveTo(-8, 7);
    ctx.lineTo(8, 7);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (icon === 'bug') {
    ctx.beginPath();
    ctx.ellipse(0, 1, 6, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-6, i * 4);
      ctx.lineTo(-11, i * 4 - 2);
      ctx.moveTo(6, i * 4);
      ctx.lineTo(11, i * 4 - 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-2, -7);
    ctx.lineTo(-5, -11);
    ctx.moveTo(2, -7);
    ctx.lineTo(5, -11);
    ctx.stroke();
  } else if (icon === 'api') {
    ctx.fillStyle = color;
    const w = 22;
    const h = 12;
    const r = 4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r, -h / 2);
    ctx.lineTo(w / 2 - r, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    ctx.lineTo(w / 2, h / 2 - r);
    ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    ctx.lineTo(-w / 2 + r, h / 2);
    ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    ctx.lineTo(-w / 2, -h / 2 + r);
    ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('API', 0, 1);
  } else if (icon === 'testng') {
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(10, 8);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NG', 0, 2);
  } else if (icon === 'agile') {
    ctx.beginPath();
    ctx.arc(0, 0, 10, -0.2 * Math.PI, 1.45 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(9, 5);
    ctx.lineTo(12, 1);
    ctx.lineTo(7, 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-7, -7, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function AVQAOrbital() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [speedMult, setSpeedMult] = useState(1.0);
  const [isCompact, setIsCompact] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 700 : false));

  const stateRef = useRef({
    nodeAngles: SKILLS.map((s) => s.startAngle),
    nodeScales: SKILLS.map(() => 1),
    nodeGlows: SKILLS.map(() => 0),
    nodePositions: SKILLS.map(() => ({ x: 0, y: 0 })),
    t: 0,
    lastTime: 0,
    hoveredNode: -1,
    activeNode: -1,
    paused: false,
    speedMult: 1
  });

  const rings = useMemo(() => [250, 175, 105], []);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

  useEffect(() => {
    stateRef.current.speedMult = speedMult;
  }, [speedMult]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = () => setIsCompact(window.innerWidth < 700);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const draw = (timeMs) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = timeMs;

      let dt = (timeMs - s.lastTime) / 1000;
      s.lastTime = timeMs;
      dt = Math.min(dt, 0.05);

      if (!s.paused) {
        s.t += dt;
        for (let i = 0; i < SKILLS.length; i += 1) {
          const skill = SKILLS[i];
          s.nodeAngles[i] += skill.speed * s.speedMult * dt * skill.dir;
        }
      }

      ctx.clearRect(0, 0, SIZE, SIZE);

      const bgGradient = ctx.createRadialGradient(CENTER, CENTER, 70, CENTER, CENTER, 360);
      bgGradient.addColorStop(0, 'rgba(20, 26, 38, 0.75)');
      bgGradient.addColorStop(1, '#0a0c10');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, SIZE, SIZE);

      const ringPulse = 0.5 + 0.5 * Math.sin(s.t * 1.4);
      const ringColors = ['#00e5ff', '#7c3aed', '#00e5ff'];
      for (let i = 0; i < rings.length; i += 1) {
        ctx.save();
        ctx.globalAlpha = 0.2 + 0.25 * ringPulse;
        ctx.strokeStyle = ringColors[i];
        ctx.setLineDash([7 + i * 2, 8]);
        ctx.lineDashOffset = s.t * (18 + i * 8) * (i % 2 === 0 ? -1 : 1);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, rings[i], 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < SKILLS.length; i += 1) {
        const skill = SKILLS[i];
        const angle = s.nodeAngles[i];
        const x = CENTER + Math.cos(angle) * skill.radius;
        const y = CENTER + Math.sin(angle) * skill.radius;
        s.nodePositions[i] = { x, y };

        const targetScale = s.hoveredNode === i ? 1.25 : 1;
        const targetGlow = s.hoveredNode === i || s.activeNode === i ? 1 : 0;
        s.nodeScales[i] += (targetScale - s.nodeScales[i]) * 0.12;
        s.nodeGlows[i] += (targetGlow - s.nodeGlows[i]) * 0.12;

        const radius = 32 * s.nodeScales[i];
        const glow = s.nodeGlows[i];

        if (glow > 0.01) {
          ctx.save();
          ctx.globalAlpha = 0.35 * glow;
          ctx.shadowBlur = 26 * glow;
          ctx.shadowColor = skill.color;
          ctx.fillStyle = skill.color;
          ctx.beginPath();
          ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.fillStyle = '#10141c';
        ctx.strokeStyle = skill.color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        drawIcon(ctx, skill.icon, x, y - 2, skill.color);

        ctx.fillStyle = skill.color;
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(skill.name, x, y + radius + 9);
        ctx.restore();
      }

      const cp = 0.4 + 0.15 * Math.sin(s.t * 1.8);
      const coreR = 78 + cp * 6;
      const coreGrad = ctx.createRadialGradient(CENTER - 8, CENTER - 10, 8, CENTER, CENTER, coreR + 20);
      coreGrad.addColorStop(0, '#1a1040');
      coreGrad.addColorStop(1, '#0d0f18');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, coreR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#7c3aed';
      ctx.shadowBlur = 16 * cp;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, coreR + 11, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14 * cp;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, coreR - 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 44px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AV', CENTER, CENTER - 8);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('QA ENGINEER', CENTER, CENTER + 30);

      for (let i = 0; i < 6; i += 1) {
        const a = s.t * 0.45 + (Math.PI * 2 * i) / 6;
        const x = CENTER + Math.cos(a) * 310;
        const y = CENTER + Math.sin(a) * 310;
        const blink = 0.4 + 0.6 * Math.abs(Math.sin(s.t * 2.2 + i));

        ctx.save();
        ctx.globalAlpha = blink;
        ctx.fillStyle = i % 2 === 0 ? '#00e5ff' : '#7c3aed';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rings]);

  const findHoveredNode = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;

    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const mx = (event.clientX - rect.left) * scaleX;
    const my = (event.clientY - rect.top) * scaleY;

    const s = stateRef.current;
    for (let i = SKILLS.length - 1; i >= 0; i -= 1) {
      const p = s.nodePositions[i];
      const dx = mx - p.x;
      const dy = my - p.y;
      if (dx * dx + dy * dy <= 38 * 38) return i;
    }
    return -1;
  };

  const handleMouseMove = (event) => {
    const idx = findHoveredNode(event);
    stateRef.current.hoveredNode = idx;
  };

  const handleMouseLeave = () => {
    stateRef.current.hoveredNode = -1;
  };

  const handleClick = (event) => {
    const idx = findHoveredNode(event);
    if (idx < 0) return;

    stateRef.current.activeNode = stateRef.current.activeNode === idx ? -1 : idx;
  };

  const resetAll = () => {
    const s = stateRef.current;
    s.nodeAngles = SKILLS.map((skill) => skill.startAngle);
    s.nodeScales = SKILLS.map(() => 1);
    s.nodeGlows = SKILLS.map(() => 0);
    s.activeNode = -1;
    s.hoveredNode = -1;
    s.t = 0;
    s.lastTime = 0;
    setPaused(false);
    setSpeedMult(1);
  };

  const baseButtonStyle = {
    borderRadius: 20,
    padding: isCompact ? '8px 12px' : '8px 14px',
    border: 'none',
    background: 'var(--surface2, #10141c)',
    color: 'var(--text, #c7cfde)',
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 700,
    fontSize: isCompact ? 11 : 12,
    cursor: 'pointer',
    transition: 'all 160ms ease',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--border, #2a3242) 70%, transparent), 0 8px 18px rgba(0, 0, 0, 0.22)'
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: DISPLAY_MAX,
        margin: '0 auto',
        borderRadius: 20,
        background:
          'radial-gradient(circle at 24% 16%, rgba(0, 229, 255, 0.08), transparent 42%), radial-gradient(circle at 82% 84%, rgba(124, 58, 237, 0.12), transparent 45%), var(--surface, #0a0c10)',
        padding: isCompact ? 10 : 14,
        fontFamily: '"JetBrains Mono", monospace',
        boxShadow: '0 22px 50px rgba(0, 0, 0, 0.35)',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ width: '100%', display: 'block', borderRadius: 16, touchAction: 'manipulation' }}
      />

      <div
        style={{
          marginTop: isCompact ? 10 : 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          justifyContent: isCompact ? 'flex-start' : 'center'
        }}
      >
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          style={{
            ...baseButtonStyle,
            color: 'var(--accent, #00e5ff)',
            boxShadow:
              'inset 0 0 0 1px rgba(124, 58, 237, 0.45), 0 8px 18px rgba(0, 0, 0, 0.22), 0 0 14px rgba(0, 229, 255, 0.2)'
          }}
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>

        <button
          type="button"
          onClick={() => setSpeedMult((v) => Math.max(0.2, Number((v - 0.3).toFixed(1))))}
          style={baseButtonStyle}
        >
          ⏪ Slower
        </button>

        <button
          type="button"
          onClick={() => setSpeedMult((v) => Math.min(3, Number((v + 0.3).toFixed(1))))}
          style={baseButtonStyle}
        >
          ⏩ Faster
        </button>

        <button type="button" onClick={resetAll} style={baseButtonStyle}>
          ↺ Reset
        </button>

        <span style={{ color: 'var(--muted, #7f89a0)', fontSize: isCompact ? 11 : 12, fontWeight: 700 }}>
          speed: {speedMult.toFixed(1)}x
        </span>
      </div>

    </div>
  );
}

export default AVQAOrbital;
