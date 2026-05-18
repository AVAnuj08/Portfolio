import { portfolioData } from "../data/portfolio";
import styles from "./Contact.module.css";

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section-title">
        <span className="section-icon">📬</span>
        Let's Connect
      </div>
      <div className={styles.contactCard}>
        <div className={styles.contactText}>{portfolioData.contact.text}</div>
        <div className={styles.contactLinks}>
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
      </div>
    </section>
  );
}

export default Contact;
