import { portfolioData } from "../data/portfolio";
import styles from "./Projects.module.css";

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-title">
        <span className="section-icon">🚀</span>
        Projects & Frameworks
      </div>
      {portfolioData.projects.map((project) => (
        <article key={project.title} className={styles.projectItem}>
          <div className={styles.projectTitle}>{project.title}</div>
          <div className={styles.projectDesc}>{project.description}</div>
          <div className={styles.projectStack}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.stackTag}>
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

export default Projects;
