import useInView from '../hooks/useInView';
import { blogs } from '../data';

const BlogCard = ({ blog, index }) => {
  const [ref, inView] = useInView(0.1);

  return (
    <a
      ref={ref}
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card blog-card${inView ? ' visible' : ''}`}
      style={{
        transitionDelay: `${index * 0.12}s`,
        '--card-gradient': blog.gradient,
        '--accent-color': blog.accent,
        textDecoration: 'none',
        display: 'block',
      }}
    >
      <div className="project-card-glow" />

      <div className="project-category" style={{ color: blog.accent }}>
        <span
          className="project-category-dot"
          style={{ background: blog.accent, boxShadow: `0 0 8px ${blog.accent}` }}
        />
        {blog.category}
      </div>

      <div className="blog-meta">
        <span className="blog-date">{blog.date}</span>
        <span className="blog-read-link" style={{ color: blog.accent }}>
          Read on LinkedIn ↗
        </span>
      </div>

      <h3 className="project-name">{blog.title}</h3>
      <p className="project-desc">{blog.description}</p>

      <div className="project-tags">
        {blog.tags.map(tag => (
          <span key={tag} className="project-tag">{tag}</span>
        ))}
      </div>
    </a>
  );
};

const Blogs = () => {
  const [headerRef, headerVisible] = useInView(0.2);

  return (
    <section className="projects section" id="blogs">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className={`section-label${headerVisible ? ' visible' : ''}`}>
            // writing
          </span>
          <h2 className={`section-title${headerVisible ? ' visible' : ''}`}>
            Blog Posts
          </h2>
          <div className={`section-divider${headerVisible ? ' visible' : ''}`} />
        </div>

        <div className="projects-grid blogs-grid">
          {blogs.map((blog, i) => (
            <BlogCard key={blog.title} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
