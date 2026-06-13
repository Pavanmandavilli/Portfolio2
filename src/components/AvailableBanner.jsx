import useInView from '../hooks/useInView';
import { personalInfo } from '../data';

const AvailableBanner = () => {
  const [ref, visible] = useInView(0.3);

  return (
    <div className="avail-wrapper" ref={ref}>
      <div className={`avail-banner${visible ? ' visible' : ''}`}>
        {/* Left — status pill */}
        <div className="avail-status">
          <span className="avail-dot" />
          <span className="avail-status-text">Available for Opportunities</span>
        </div>

        {/* Center — role tags */}
        <div className="avail-roles">
          {['AI Engineer', 'ML Engineer', 'Backend Developer'].map(r => (
            <span key={r} className="avail-role-tag">{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableBanner;
