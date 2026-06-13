import useInView from '../hooks/useInView';
import { experience } from '../data';

const Experience = () => {
  const [headerRef, headerVisible] = useInView(0.2);
  const [timelineRef, timelineVisible] = useInView(0.1);

  return (
    <section className="experience section" id="experience">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>
            // work history
          </span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>
            Experience
          </h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`} />
        </div>

        <div
          ref={timelineRef}
          className={`timeline${timelineVisible ? ' visible' : ''}`}
        >
          {experience.map((item, i) => (
            <TimelineItem key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index }) => {
  const [ref, inView] = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`timeline-item${inView ? ' visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className={`timeline-dot${item.current ? ' current' : ''}`} />
      <div className="timeline-card">
        <div className="timeline-period">{item.period}</div>
        <h3 className="timeline-title">{item.title}</h3>
        <div className="timeline-company">
          <span>{item.company}</span>
          <span className="timeline-company-sep" />
          <span>{item.location}</span>
        </div>
        <p className="timeline-desc">{item.description}</p>
        <div className="timeline-tags">
          {item.tags.map(tag => (
            <span key={tag} className="timeline-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
