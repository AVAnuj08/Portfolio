import { portfolioData } from "../data/portfolio";
import AVQAOrbital from "./AVQAOrbital";
import styles from "./Hero.module.css";

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

function Hero() {
  const aboutParagraphs = portfolioData.about.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroTitle}>{portfolioData.name}</div>
        <div className={styles.heroSubtitle}>{portfolioData.subtitle}</div>
        <div className={styles.heroDesc}>
          {aboutParagraphs.map((paragraph, index) => (
            <p key={`hero-about-${index}`} className={styles.heroParagraph}>
              {renderFormattedText(paragraph)}
            </p>
          ))}
        </div>
        <div className={styles.ctaRow}>
          <a href={`mailto:${portfolioData.ctas.email}`} className={`${styles.btn} ${styles.btnPrimary}`}>
            {portfolioData.ctas.emailLabel}
          </a>
          <a href={portfolioData.ctas.github} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnSecondary}`}>
            GitHub -&gt;
          </a>
          <a
            href={portfolioData.ctas.linkedin}
            target="_blank"
            rel="noreferrer"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            LinkedIn -&gt;
          </a>
        </div>
      </div>
      <div className={styles.heroOrbital}>
        <AVQAOrbital />
      </div>
    </section>
  );
}

export default Hero;
