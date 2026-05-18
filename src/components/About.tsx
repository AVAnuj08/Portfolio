import { portfolioData } from "../data/portfolio";
import styles from "./About.module.css";

function renderFormattedText(text: string) {
  const lines = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return lines.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`b-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`i-${index}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`t-${index}`}>{part}</span>;
  });
}

function About() {
  const aboutIntro = portfolioData.about?.trim() || portfolioData.aboutMe.intro;
  const aboutParagraphs = aboutIntro.split(/\n+/).map((p) => p.trim()).filter(Boolean);

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
          <div className={styles.intro}>
            {aboutParagraphs.map((paragraph, index) => (
              <p key={`about-intro-${index}`} className={styles.introParagraph}>
                {renderFormattedText(paragraph)}
              </p>
            ))}
          </div>

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
