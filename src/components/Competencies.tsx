import { portfolioData } from "../data/portfolio";
import styles from "./Competencies.module.css";

function Competencies() {
  return (
    <section id="competencies" className="section">
      <div className="section-title">
        <span className="section-icon">✨</span>
        Core Competencies
      </div>
      <div className={styles.skillsGrid}>
        {portfolioData.competencies.map((item) => (
          <div key={item.category} className={styles.skillCard}>
            <div className={styles.skillCategory}>{item.category}</div>
            <div className={styles.skillList}>
              {item.tags.map((tag) => (
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

export default Competencies;
