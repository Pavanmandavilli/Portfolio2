import useInView from '../hooks/useInView';
import { projects } from '../data';

const ProjectCard = ({ project, index }) => {
  const [ref, inView] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`project-card${inView ? ' visible' : ''}`}
      style={{
        transitionDelay: `${(index % 3) * 0.1}s`,
        '--card-gradient': project.gradient,
        '--accent-color': project.accent,
      }}
    >
      <div className="project-card-glow" />

      <div className="project-category" style={{ color: project.accent }}>
        <span
          className="project-category-dot"
          style={{ background: project.accent, boxShadow: `0 0 8px ${project.accent}` }}
        />
        {project.category}
      </div>

      <h3 className="project-name">{project.name}</h3>
      <p className="project-desc">{project.description}</p>

      <div className="project-tags">
        {project.tags.map(tag => (
          <span key={tag} className="project-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

const Projects = () => {
  const [headerRef, headerVisible] = useInView(0.2);

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>
            // portfolio
          </span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>
            Projects
          </h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`} />
        </div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
