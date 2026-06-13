import useInView from '../hooks/useInView';
import { education } from '../data';

const EduCard = ({ item, index }) => {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`edu-card${inView ? ' visible' : ''}`}
      style={{ transitionDelay: `${index * 0.13}s` }}
    >
      <span className="edu-icon">{item.icon}</span>
      <h3 className="edu-degree">{item.degree}</h3>
      <div className="edu-institution">{item.institution}</div>
      <div className="edu-location">{item.location}</div>
      <span className="edu-period">{item.period}</span>
    </div>
  );
};

const Education = () => {
  const [headerRef, headerVisible] = useInView(0.2);

  return (
    <section className="education section" id="education">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>
            // academic background
          </span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>
            Education
          </h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`} />
        </div>

        <div className="education-grid">
          {education.map((item, i) => (
            <EduCard key={item.institution} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
