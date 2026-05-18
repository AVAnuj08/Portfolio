import { portfolioData } from "../data/portfolio";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroTitle}>{portfolioData.name}</div>
      <div className={styles.heroSubtitle}>{portfolioData.subtitle}</div>
      <div className={styles.heroDesc}>{portfolioData.about}</div>
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
    </section>
  );
}

export default Hero;
