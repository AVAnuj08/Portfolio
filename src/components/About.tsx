import { portfolioData } from "../data/portfolio";
import styles from "./About.module.css";

function About() {
  return (
    <section id="about" className="section">
      <div className="section-title">
        <span className="section-icon">👋</span>
        About Me
      </div>

      <div className={styles.aboutLayout}>
        <div className={styles.storyPanel}>
          <p className={styles.eyebrow}>Profile</p>
          <h2 className={styles.headline}>{portfolioData.aboutMe.headline}</h2>
          <p className={styles.intro}>{portfolioData.aboutMe.intro}</p>

          <div className={styles.focusList}>
            {portfolioData.aboutMe.focus.map((item) => (
              <div key={item} className={styles.focusItem}>
                <span className={styles.marker} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.snapshotPanel} aria-label="Resume snapshot">
          <p className={styles.eyebrow}>Snapshot</p>
          <div className={styles.factList}>
            {portfolioData.aboutMe.quickFacts.map((fact) => (
              <div key={fact.label} className={styles.factItem}>
                <span className={styles.factLabel}>{fact.label}</span>
                <span className={styles.factValue}>{fact.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default About;
