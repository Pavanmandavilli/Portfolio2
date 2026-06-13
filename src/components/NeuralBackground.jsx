import { useEffect, useRef } from 'react';

const CYAN   = { r: 0,   g: 245, b: 255 };
const PURPLE = { r: 123, g: 47,  b: 247 };
const WHITE  = { r: 255, g: 255, b: 255 };
const NODE_COLORS = [CYAN, CYAN, PURPLE, WHITE];

const MAX_DIST = 155;
const NUM_NODES = 90;

function rand(min, max) { return min + Math.random() * (max - min); }

class NeuronNode {
  constructor(w, h) {
    this.reset(w, h);
    this.pulse = rand(0, Math.PI * 2);
    this.pulseSpeed = rand(0.015, 0.035);
    this.color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
    this.isHub = Math.random() < 0.12;
    this.baseRadius = this.isHub ? rand(2.5, 4) : rand(1, 2.2);
    this.activationLevel = 0;
  }

  reset(w, h) {
    this.x = rand(0, w);
    this.y = rand(0, h);
    this.vx = rand(-0.35, 0.35);
    this.vy = rand(-0.35, 0.35);
  }

  update(w, h, mx, my) {
    this.pulse += this.pulseSpeed;

    // Mouse attraction
    if (mx >= 0) {
      const dx = mx - this.x;
      const dy = my - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220 && dist > 1) {
        const force = ((220 - dist) / 220) * 0.06;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
        if (dist < 80) this.activationLevel = Math.min(1, this.activationLevel + 0.05);
      }
    }

    this.activationLevel *= 0.97;

    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 1.4) {
      this.vx = (this.vx / speed) * 1.4;
      this.vy = (this.vy / speed) * 1.4;
    }

    this.vx *= 0.995;
    this.vy *= 0.995;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -20) this.x = w + 20;
    else if (this.x > w + 20) this.x = -20;
    if (this.y < -20) this.y = h + 20;
    else if (this.y > h + 20) this.y = -20;
  }

  draw(ctx) {
    const { r, g, b } = this.color;
    const pulseFactor = 1 + 0.45 * Math.sin(this.pulse);
    const activation = this.activationLevel;
    const radius = this.baseRadius * pulseFactor * (1 + activation * 0.6);
    const alpha = 0.7 + activation * 0.3;

    // Outer glow
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 8);
    grad.addColorStop(0, `rgba(${r},${g},${b},${0.25 + activation * 0.25})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 8, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }
}

class SynapticPulse {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.progress = 0;
    this.speed = rand(0.018, 0.032);
    this.color = Math.random() < 0.6 ? CYAN : PURPLE;
    this.done = false;
    this.size = rand(3, 6);
  }

  update() {
    this.progress += this.speed;
    if (this.progress >= 1) {
      this.done = true;
      this.to.activationLevel = Math.min(1, this.to.activationLevel + 0.4);
    }
  }

  draw(ctx) {
    const { r, g, b } = this.color;
    const t = this.progress;
    const x = this.from.x + (this.to.x - this.from.x) * t;
    const y = this.from.y + (this.to.y - this.from.y) * t;
    const tail = Math.max(0, t - 0.15);
    const tx = this.from.x + (this.to.x - this.from.x) * tail;
    const ty = this.from.y + (this.to.y - this.from.y) * tail;

    // Trail
    const trailGrad = ctx.createLinearGradient(tx, ty, x, y);
    trailGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
    trailGrad.addColorStop(1, `rgba(${r},${g},${b},0.8)`);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(x, y);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Head glow
    const headGrad = ctx.createRadialGradient(x, y, 0, x, y, this.size * 2.5);
    headGrad.addColorStop(0, `rgba(${r},${g},${b},1)`);
    headGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(x, y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = headGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, this.size * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    ctx.fill();
  }
}

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouse = { x: -999, y: -999 };
    let frameCount = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onTouch = (e) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const nodes = Array.from({ length: NUM_NODES }, () => new NeuronNode(w, h));
    const pulses = [];

    const spawnPulse = () => {
      if (pulses.length > 35) return;
      const i = Math.floor(Math.random() * nodes.length);
      const from = nodes[i];
      let closest = null;
      let closestDist = Infinity;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const d = Math.hypot(nodes[j].x - from.x, nodes[j].y - from.y);
        if (d < MAX_DIST && d < closestDist) {
          closestDist = d;
          closest = nodes[j];
        }
      }
      if (closest) pulses.push(new SynapticPulse(from, closest));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frameCount++;

      if (frameCount % 28 === 0) spawnPulse();

      // Update
      nodes.forEach(n => n.update(w, h, mouse.x, mouse.y));

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            const t = 1 - dist / MAX_DIST;
            const actBoost = (nodes[i].activationLevel + nodes[j].activationLevel) * 0.5;
            const alpha = (t * 0.28 + actBoost * 0.15);
            const { r, g, b } = nodes[i].color;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => n.draw(ctx));

      // Update & draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].update();
        if (pulses[i].done) { pulses.splice(i, 1); continue; }
        pulses[i].draw(ctx);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.65,
        pointerEvents: 'none',
      }}
    />
  );
};

export default NeuralBackground;
