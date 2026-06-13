import { useState } from 'react';
import useInView from '../hooks/useInView';
import { skillCategories } from '../data';

/* ── Layout ─────────────────────────────────────────────── */
const VW = 1600, VH = 960;
const L1_X = 120;
const L2_X = 400;
const L3_X = 820;
const L4_X = 1320;
const CENTER_Y = VH / 2;

const N_DOM = skillCategories.length;
const TOP_PAD = 88, BOT_PAD = 88;
const USABLE_H = VH - TOP_PAD - BOT_PAD;

const DEFAULT_CAT = 'ml-ai';

/* Domain nodes — evenly spaced */
const LAYOUT = skillCategories.map((cat, i) => ({
  ...cat,
  x: L2_X,
  y: Math.round(TOP_PAD + (i / (N_DOM - 1)) * USABLE_H),
}));

/* Skill nodes per domain — each domain spreads its skills across full height */
function skillPositions(cat) {
  const n = cat.skills.length;
  return cat.skills.map((sk, i) => ({
    ...sk,
    catId:    cat.id,
    catColor: cat.color,
    x: L3_X,
    y: n === 1 ? CENTER_Y : Math.round(TOP_PAD + (i / (n - 1)) * USABLE_H),
  }));
}

const SKILL_MAP = Object.fromEntries(
  LAYOUT.map(cat => [cat.id, skillPositions(cat)])
);
const TOTAL_SKILLS = LAYOUT.reduce((s, c) => s + c.skills.length, 0);

/* ── SVG Defs ───────────────────────────────────────────── */
const Defs = () => (
  <defs>
    <filter id="glo-sm"  x="-50%"  y="-50%"  width="200%" height="200%">
      <feGaussianBlur stdDeviation="3"  result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glo-md"  x="-70%"  y="-70%"  width="240%" height="240%">
      <feGaussianBlur stdDeviation="6"  result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glo-lg"  x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="12" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <radialGradient id="rg-input" cx="38%" cy="32%" r="65%">
      <stop offset="0%"   stopColor="#00f5ff" stopOpacity="0.95"/>
      <stop offset="100%" stopColor="#7b2ff7" stopOpacity="0.85"/>
    </radialGradient>
    <radialGradient id="rg-output" cx="35%" cy="30%" r="68%">
      <stop offset="0%"   stopColor="#00f5ff"/>
      <stop offset="45%"  stopColor="#7b2ff7" stopOpacity="0.9"/>
      <stop offset="100%" stopColor="#ff006e" stopOpacity="0.8"/>
    </radialGradient>
    <linearGradient id="rg-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor="#00f5ff" stopOpacity="0.9"/>
      <stop offset="50%"  stopColor="#7b2ff7" stopOpacity="0.6"/>
      <stop offset="100%" stopColor="#ff006e" stopOpacity="0.9"/>
    </linearGradient>
    <linearGradient id="rg-ring2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stopColor="#00ff88" stopOpacity="0.8"/>
      <stop offset="100%" stopColor="#ffc864" stopOpacity="0.8"/>
    </linearGradient>
    {skillCategories.map(cat => (
      <radialGradient key={cat.id} id={`rg-${cat.id}`} cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor={cat.color} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={cat.color} stopOpacity="0.2"/>
      </radialGradient>
    ))}
  </defs>
);

/* ── Animated edge ──────────────────────────────────────── */
const Edge = ({ x1, y1, x2, y2, color, visible, delay = 0, w = 1.2, opacity = 0.4, dot, dotDur = 2.5 }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={w}
        strokeDasharray={len} strokeDashoffset={visible ? 0 : len}
        opacity={opacity}
        style={{ transition: `stroke-dashoffset 0.9s ease ${delay}s` }}
      />
      {dot && visible && (
        <circle r="3.5" fill={color} opacity="0.92" filter="url(#glo-sm)">
          <animateMotion dur={`${dotDur}s`} repeatCount="indefinite"
            path={`M${x1},${y1} L${x2},${y2}`}/>
        </circle>
      )}
    </g>
  );
};

/* ── Input node ─────────────────────────────────────────── */
const InputNode = ({ visible }) => (
  <g>
    {[0, 1, 2, 3].map(i => (
      <circle key={i} cx={L1_X} cy={CENTER_Y} r={50}
        fill="none" stroke="rgba(0,245,255,0.45)" strokeWidth="1.5"
        className="nr-input" style={{ animationDelay: `${i * 0.6}s` }}/>
    ))}
    <circle cx={L1_X} cy={CENTER_Y} r={58}
      fill="rgba(0,245,255,0.04)" stroke="rgba(0,245,255,0.15)" strokeWidth="1"
      filter="url(#glo-md)"/>
    <circle cx={L1_X} cy={CENTER_Y} r={48}
      fill="url(#rg-input)" stroke="rgba(0,245,255,0.75)" strokeWidth="2.5"
      filter="url(#glo-lg)"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.1s' }}/>
    <text x={L1_X} y={CENTER_Y - 9} textAnchor="middle" fontSize="12.5" fill="white"
      fontFamily="'Space Grotesk',sans-serif" fontWeight="800" letterSpacing="2"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
      SKILLS
    </text>
    <text x={L1_X} y={CENTER_Y + 9} textAnchor="middle" fontSize="8" fill="rgba(0,245,255,0.75)"
      fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}>
      INPUT
    </text>
  </g>
);

/* ── Domain node (L2) ───────────────────────────────────── */
const DomainNode = ({ cat, activeCat, selected, onEnter, onLeave, onClick, visible, idx }) => {
  const active = activeCat === cat.id;
  const dim    = activeCat && activeCat !== '__all__' && !active;
  const R      = active ? 26 : 21;

  return (
    <g style={{ cursor: 'pointer',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${0.5 + idx * 0.08}s` }}
      onMouseEnter={() => onEnter(cat.id)}
      onMouseLeave={onLeave}
      onClick={() => onClick(cat.id)}>

      {/* Pulsing ring when active */}
      {active && (
        <circle cx={cat.x} cy={cat.y} r={R + 4}
          fill="none" stroke={cat.color} strokeWidth="2"
          className="nr-cat-ring" opacity="0.55"/>
      )}
      {/* Solid locked ring when selected */}
      {selected && (
        <circle cx={cat.x} cy={cat.y} r={R + 9}
          fill="none" stroke={cat.color} strokeWidth="1.5"
          strokeDasharray="4 3" opacity="0.7"/>
      )}
      <circle cx={cat.x} cy={cat.y} r={R + 10}
        fill={cat.color} opacity={active ? 0.22 : dim ? 0.02 : 0.07}
        filter="url(#glo-sm)" style={{ transition: 'opacity 0.3s' }}/>
      <circle cx={cat.x} cy={cat.y} r={R}
        fill={`url(#rg-${cat.id})`} stroke={cat.color}
        strokeWidth={active ? 2.5 : 1.5} opacity={dim ? 0.22 : 1}
        filter={active ? 'url(#glo-md)' : 'none'}
        style={{ transition: 'all 0.35s ease' }}/>
      <text x={cat.x} y={cat.y + 7} textAnchor="middle" fontSize="15"
        style={{ userSelect: 'none', opacity: dim ? 0.25 : 1, transition: 'opacity 0.3s' }}>
        {cat.icon}
      </text>
      <text x={cat.x - R - 10} y={cat.y + 4} textAnchor="end" fontSize="10.5"
        fill={active ? cat.color : 'rgba(255,255,255,0.6)'}
        fontFamily="'Space Grotesk',sans-serif" fontWeight={active ? '700' : '500'}
        opacity={dim ? 0.18 : 1}
        filter={active ? `drop-shadow(0 0 8px ${cat.color})` : 'none'}
        style={{ transition: 'all 0.3s ease', pointerEvents: 'none', userSelect: 'none' }}>
        {cat.label}
      </text>
    </g>
  );
};

/* ── Skill node (L3) — same visual weight as domain nodes ── */
const SkillNode = ({ sk, active, visible, idx }) => {
  const R = 20;
  return (
    <g opacity={active || visible ? (active ? 1 : 0) : 0}
      style={{ transition: `opacity 0.4s ease ${idx * 0.04}s`, pointerEvents: 'none' }}>

      {active && (
        <circle cx={sk.x} cy={sk.y} r={R + 5}
          fill="none" stroke={sk.catColor} strokeWidth="1.5"
          className="nr-cat-ring" opacity="0.45"/>
      )}
      {/* Glow halo */}
      <circle cx={sk.x} cy={sk.y} r={R + 10}
        fill={sk.catColor} opacity={active ? 0.18 : 0.04}
        filter="url(#glo-sm)" style={{ transition: 'opacity 0.3s' }}/>
      {/* Core */}
      <circle cx={sk.x} cy={sk.y} r={R}
        fill={`color-mix(in srgb, ${sk.catColor} 35%, #06061a)`}
        stroke={sk.catColor} strokeWidth="2"
        filter={active ? 'url(#glo-md)' : 'url(#glo-sm)'}
        style={{ transition: 'all 0.35s ease' }}/>
      {/* Level % inside circle */}
      <text x={sk.x} y={sk.y + 4} textAnchor="middle" fontSize="9"
        fill={sk.catColor} fontFamily="'JetBrains Mono',monospace" fontWeight="700"
        style={{ userSelect: 'none' }}>
        {sk.level}%
      </text>
      {/* Skill name — to the right, visible when active */}
      <text x={sk.x + R + 10} y={sk.y + 4}
        textAnchor="start" fontSize="11"
        fill={active ? '#fff' : 'transparent'}
        fontFamily="'Inter',sans-serif" fontWeight="600"
        filter={active ? `drop-shadow(0 0 6px ${sk.catColor})` : 'none'}
        style={{ transition: 'fill 0.3s, filter 0.3s', userSelect: 'none' }}>
        {sk.name}
      </text>
    </g>
  );
};

/* ── Output node (L4) ───────────────────────────────────── */
const OutputNode = ({ visible, onEnter, onLeave, isHovered }) => {
  const x = L4_X, y = CENTER_Y;
  const orbits = [
    { r: 80, color: '#00f5ff', size: 5.5, dur: 9,  start: 0   },
    { r: 80, color: '#7b2ff7', size: 5,   dur: 11, start: 45  },
    { r: 80, color: '#ff006e', size: 5,   dur: 8,  start: 90  },
    { r: 80, color: '#00ff88', size: 4.5, dur: 13, start: 135 },
    { r: 93, color: '#ffc864', size: 4,   dur: 7,  start: 180 },
    { r: 93, color: '#b4b4ff', size: 4,   dur: 15, start: 225 },
    { r: 93, color: '#38bdf8', size: 4,   dur: 10, start: 270 },
    { r: 93, color: '#34d399', size: 4,   dur: 12, start: 315 },
  ];
  return (
    <g opacity={visible ? 1 : 0}
      style={{ transition: 'opacity 0.8s ease 2s', cursor: 'pointer' }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>

      {['#00f5ff','#7b2ff7','#ff006e','#00ff88','#ffc864'].map((c, i) => (
        <circle key={i} cx={x} cy={y} r={57}
          fill="none" stroke={c} strokeWidth="1.5"
          className="nr-output-ring" style={{ animationDelay: `${i * 0.5}s` }}/>
      ))}
      <circle cx={x} cy={y} r={76} fill="none" stroke="url(#rg-ring1)"
        strokeWidth="2" strokeDasharray="10 7" opacity="0.65">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="16s" repeatCount="indefinite"/>
      </circle>
      <circle cx={x} cy={y} r={65} fill="none" stroke="url(#rg-ring2)"
        strokeWidth="1.5" strokeDasharray="5 12" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate"
          from={`360 ${x} ${y}`} to={`0 ${x} ${y}`} dur="10s" repeatCount="indefinite"/>
      </circle>
      {orbits.map((o, i) => (
        <circle key={i} cx={x + o.r} cy={y} r={o.size}
          fill={o.color} filter="url(#glo-sm)" opacity="0.95">
          <animateTransform attributeName="transform" type="rotate"
            from={`${o.start} ${x} ${y}`} to={`${o.start + 360} ${x} ${y}`}
            dur={`${o.dur}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      <circle cx={x} cy={y} r={64}
        fill="rgba(0,245,255,0.05)" stroke="rgba(0,245,255,0.2)" strokeWidth="1"
        filter="url(#glo-lg)"/>
      <circle cx={x} cy={y} r={54}
        fill="url(#rg-output)" stroke="rgba(0,245,255,0.8)" strokeWidth="3"
        filter={isHovered ? 'url(#glo-lg)' : 'url(#glo-md)'}
        style={{ transition: 'filter 0.3s' }}/>
      <text x={x} y={y - 18} textAnchor="middle" fontSize="8.5"
        fill="rgba(0,245,255,0.85)"
        fontFamily="'JetBrains Mono',monospace" letterSpacing="2">FULL STACK</text>
      <text x={x} y={y + 2} textAnchor="middle" fontSize="20" fill="white"
        fontFamily="'Space Grotesk',sans-serif" fontWeight="900">AI</text>
      <text x={x} y={y + 21} textAnchor="middle" fontSize="8.5"
        fill="rgba(0,245,255,0.85)"
        fontFamily="'JetBrains Mono',monospace" letterSpacing="2">ENGINEER</text>
      <text x={x} y={y + 37} textAnchor="middle" fontSize="7"
        fill="rgba(255,255,255,0.4)"
        fontFamily="'JetBrains Mono',monospace" letterSpacing="1">
        {TOTAL_SKILLS} SKILLS
      </text>
    </g>
  );
};

/* ── Main component ─────────────────────────────────────── */
const Skills = () => {
  const [headerRef, headerVisible] = useInView(0.2);
  const [graphRef,  graphVisible]  = useInView(0.05);
  const [hoveredCat,  setHoveredCat]  = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  const activeCat = hoveredCat || selectedCat || DEFAULT_CAT;

  const handleClick = (catId) => {
    setSelectedCat(prev => prev === catId ? null : catId);
  };

  const l12Op = (catId) =>
    activeCat === '__all__' ? 0.65 : activeCat === catId ? 0.85 : 0.07;
  const l23Op = (catId) =>
    activeCat === '__all__' ? 0.45 : activeCat === catId ? 0.75 : 0;
  const l34Op = (catId) =>
    activeCat === '__all__' ? 0.3  : activeCat === catId ? 0.55 : 0;

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>// expertise</span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>Neural Skill Map</h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`}/>
          <p className={`skills-subtitle animate-up${headerVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}>
            Hover any domain · {TOTAL_SKILLS} skills · {skillCategories.length} domains
          </p>
        </div>
      </div>

      <div className="skills-graph-wide">
        <div ref={graphRef} className="neural-wrap">
          <div className="neural-scroll">
            <svg viewBox={`0 0 ${VW} ${VH}`} className="neural-svg"
              preserveAspectRatio="xMidYMid meet">
              <Defs/>

              {/* ── L2 → L3: Domain → Skill edges ── */}
              {LAYOUT.map(cat =>
                SKILL_MAP[cat.id].map((sk, j) => (
                  <Edge key={`l23-${sk.catId}-${j}`}
                    x1={cat.x + 22} y1={cat.y}
                    x2={sk.x - 20}  y2={sk.y}
                    color={cat.color} visible={graphVisible}
                    delay={0.6 + j * 0.04}
                    opacity={l23Op(cat.id)}
                    w={activeCat === cat.id ? 1.5 : 0.7}
                    dot={activeCat === cat.id}
                    dotDur={1.8 + j * 0.07}
                  />
                ))
              )}

              {/* ── L3 → L4: Skill → Output edges ── */}
              {LAYOUT.map(cat =>
                SKILL_MAP[cat.id].map((sk, j) => (
                  <Edge key={`l34-${sk.catId}-${j}`}
                    x1={sk.x + 20} y1={sk.y}
                    x2={L4_X - 57} y2={CENTER_Y}
                    color={cat.color} visible={graphVisible}
                    delay={1.0 + j * 0.04}
                    opacity={l34Op(cat.id)}
                    w={activeCat === cat.id ? 1.3 : 0.6}
                    dot={false}
                  />
                ))
              )}

              {/* ── L1 → L2: Input → Domain edges ── */}
              {LAYOUT.map((cat, i) => (
                <Edge key={`l12-${cat.id}`}
                  x1={L1_X + 48} y1={CENTER_Y}
                  x2={cat.x - 22} y2={cat.y}
                  color={cat.color} visible={graphVisible}
                  delay={0.3 + i * 0.06}
                  opacity={l12Op(cat.id)}
                  w={activeCat === cat.id ? 2 : 1}
                  dot={activeCat === cat.id || activeCat === '__all__'}
                  dotDur={2.2 + i * 0.14}
                />
              ))}

              {/* ── Skill nodes (L3) — all rendered, opacity driven by activeCat ── */}
              {LAYOUT.map(cat =>
                SKILL_MAP[cat.id].map((sk, j) => (
                  <SkillNode key={`sk-${sk.catId}-${j}`}
                    sk={sk}
                    active={activeCat === cat.id}
                    visible={graphVisible}
                    idx={j}
                  />
                ))
              )}

              {/* Input node */}
              <InputNode visible={graphVisible}/>

              {/* Domain nodes */}
              {LAYOUT.map((cat, i) => (
                <DomainNode key={cat.id} cat={cat}
                  activeCat={activeCat}
                  selected={selectedCat === cat.id}
                  onEnter={setHoveredCat}
                  onLeave={() => setHoveredCat(null)}
                  onClick={handleClick}
                  visible={graphVisible} idx={i}
                />
              ))}

              {/* Output node */}
              <OutputNode
                visible={graphVisible}
                onEnter={() => setHoveredCat('__all__')}
                onLeave={() => setHoveredCat(null)}
                isHovered={hoveredCat === '__all__'}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
