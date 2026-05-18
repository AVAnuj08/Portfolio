import { portfolioData } from "../data/portfolio";
import styles from "./Experience.module.css";

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-title">
        <span className="section-icon">💼</span>
        Experience
      </div>
      {portfolioData.experience.map((item) => (
        <article key={`${item.company}-${item.role}`} className={styles.expItem}>
          <div className={styles.expHeader}>
            <div>
              <div className={styles.expTitle}>{item.role}</div>
              <div className={styles.expCompany}>{item.company}</div>
            </div>
            <div className={styles.expDate}>{item.duration}</div>
          </div>
          <div className={styles.expDesc}>{item.description}</div>
          {item.tags.length > 0 && (
            <div className={styles.expTags}>
              {item.tags.map((tag) => (
                <span key={tag} className={styles.expTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

export default Experience;
