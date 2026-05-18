import { portfolioData } from "../data/portfolio";
import styles from "./Certifications.module.css";

function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="section-title">
        <span className="section-icon">🏅</span>
        Certifications
      </div>
      <div className={styles.list}>
        {portfolioData.certifications.map((cert) => (
          <article key={`${cert.title}-${cert.year}`} className={styles.item}>
            <div>
              <div className={styles.title}>{cert.title}</div>
              <div className={styles.issuer}>{cert.issuer}</div>
            </div>
            <div className={styles.year}>{cert.year}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Certifications;
