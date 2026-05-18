import { portfolioData } from "../data/portfolio";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.connectTitle}>Let's Connect</div>
      <div className={styles.connectText}>{portfolioData.contact.text}</div>
      <div className={styles.contactRow}>
        <a href={`mailto:${portfolioData.contact.email}`} className={styles.contactLink}>
          📧 Email
        </a>
        <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className={styles.contactLink}>
          💻 GitHub
        </a>
        <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className={styles.contactLink}>
          🔗 LinkedIn
        </a>
      </div>
      <span>{portfolioData.footer}</span>
    </footer>
  );
}

export default Footer;
