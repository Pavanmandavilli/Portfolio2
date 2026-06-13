import { useState } from 'react';
import useInView from '../hooks/useInView';
import { personalInfo } from '../data';

// Get your endpoint at https://formspree.io → New Form → copy the URL
// Then add it to .env as VITE_FORMSPREE_URL=https://formspree.io/f/xxxxxxxx
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/YOUR_FORM_ID';

const Contact = () => {
  const [headerRef, headerVisible] = useInView(0.2);
  const [infoRef,   infoVisible]   = useInView(0.15);
  const [formRef,   formVisible]   = useInView(0.15);

  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }

    setTimeout(() => setStatus(null), 4500);
  };

  const contactItems = [
    { icon: '📧', label: 'Email',    value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: '📱', label: 'Phone',    value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    { icon: '📍', label: 'Location', value: personalInfo.location, href: null },
  ];

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>// get in touch</span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>Contact Me</h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`} />
        </div>

        <div className="contact-grid">
          {/* Info */}
          <div ref={infoRef} className={`animate-left${infoVisible ? ' visible' : ''}`}>
            <h3 className="contact-info-title">
              Let's build something<br />
              <span style={{ color: 'var(--cyan)' }}>intelligent together.</span>
            </h3>
            <p className="contact-info-desc">
              I'm always open to discussing new projects, AI/ML opportunities, or just having
              a conversation about technology and innovation. Feel free to reach out!
            </p>

            <div className="contact-items">
              {contactItems.map(item => (
                <div key={item.label} className="contact-item">
                  <div className="contact-item-icon">{item.icon}</div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="contact-item-value" style={{ color: 'inherit' }}>
                        {item.value}
                      </a>
                    ) : (
                      <div className="contact-item-value">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-socials">
              <a href={personalInfo.social.github} target="_blank" rel="noreferrer" className="contact-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noreferrer" className="contact-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className={`animate-right${formVisible ? ' visible' : ''}`}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" placeholder="Your name"
                    value={form.name} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="your@email.com"
                    value={form.email} onChange={handleChange} required/>
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="Project collaboration / Job opportunity"
                  value={form.subject} onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows={6}
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message} onChange={handleChange} required/>
              </div>

              <button type="submit" className="form-submit" disabled={status === 'sending'}>
                {status === 'sending'
                  ? <><span className="form-spinner"/> Sending…</>
                  : 'Send Message →'}
              </button>

              {status === 'success' && (
                <div className="form-status success">
                  ✓ Message sent! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="form-status error">
                  ✗ Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
