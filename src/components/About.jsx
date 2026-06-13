import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView';
import { personalInfo, stats, certifications } from '../data';

const AnimatedCounter = ({ value, suffix, inView }) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, value]);

  return <>{count}{suffix}</>;
};

const About = () => {
  const [headerRef, headerVisible] = useInView(0.2);
  const [contentRef, contentVisible] = useInView(0.15);
  const [visualRef, visualVisible] = useInView(0.15);

  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Left: Text */}
          <div className="about-text-content" ref={contentRef}>
            <span className={`section-label${contentVisible ? ' visible' : ''}`}>
              // about me
            </span>
            <h2 className={`section-title${contentVisible ? ' visible' : ''}`} style={{ textAlign: 'left' }}>
              Crafting Intelligence,<br />One Model at a Time
            </h2>
            <div className={`section-divider${contentVisible ? ' visible' : ''}`} style={{ margin: '20px 0 0' }} />

            <p className={`about-bio animate-up${contentVisible ? ' visible' : ''}`}>
              {personalInfo.bio}
            </p>

            <div className={`about-actions animate-up${contentVisible ? ' visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noreferrer" className="btn-primary">
                LinkedIn Profile
              </a>
              <a href={personalInfo.social.github} target="_blank" rel="noreferrer" className="btn-outline">
                GitHub
              </a>
              <a href={personalInfo.social.resume} target="_blank" rel="noreferrer" className="btn-outline">
                Resume
              </a>
            </div>
          </div>

          {/* Right: Stats + Certs */}
          <div className="about-visual" ref={visualRef}>
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`stat-card animate-up${visualVisible ? ' visible' : ''}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="stat-number">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={visualVisible} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="cert-cards">
              {certifications.map((cert, i) => (
                <div
                  key={cert.name}
                  className={`cert-card animate-up${visualVisible ? ' visible' : ''}`}
                  style={{ transitionDelay: `${0.4 + i * 0.1}s` }}
                >
                  <span className="cert-icon">{cert.icon}</span>
                  <div className="cert-info">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
