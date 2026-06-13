import { useState, useEffect } from 'react';

const links = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Education',  href: '#education' },
  { label: 'Contact',    href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-bracket">{'/>'}</span>
        </div>

        <button
          className={`navbar-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          {links.map(link => (
            <li key={link.href}>
              <a href={link.href} onClick={e => handleNav(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="navbar-cta"
              onClick={e => handleNav(e, '#contact')}
            >
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
