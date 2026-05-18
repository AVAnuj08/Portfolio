import { portfolioData } from "../data/portfolio";
import styles from "./Skills.module.css";

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-title">
        <span className="section-icon">⚙️</span>
        Technical Skills
      </div>
      <div className={styles.skillsGrid}>
        {portfolioData.technicalSkills.map((skillGroup) => (
          <div key={skillGroup.category} className={styles.skillCard}>
            <div className={styles.skillCategory}>{skillGroup.category}</div>
            <div className={styles.skillList}>
              {skillGroup.tags.map((tag) => (
                <span key={tag} className={styles.skillTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
