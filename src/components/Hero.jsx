import useTypewriter from '../hooks/useTypewriter';
import { personalInfo } from '../data';

const Hero = () => {
  const typedRole = useTypewriter(personalInfo.roles, 85, 45, 2000);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg-orbs">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="hero-content">
        <h1
          className="hero-name"
          data-text={personalInfo.name}
        >
          <span className="hero-name-text">{personalInfo.name}</span>
        </h1>

        <div className="hero-role-line">
          <span>I am a</span>
          <span className="hero-role">{typedRole}</span>
          <span className="hero-cursor" />
        </div>

        <p className="hero-bio">{personalInfo.bio}</p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo('#projects')}>
            View My Work
          </button>
          <button className="btn-outline" onClick={() => scrollTo('#contact')}>
            Get In Touch
          </button>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span className="hero-scroll-label">scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
