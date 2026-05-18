import { portfolioData } from "../data/portfolio";
import styles from "./Highlights.module.css";

function Highlights() {
  return (
    <section id="highlights" className="section">
      <div className="section-title">
        <span className="section-icon">🎯</span>
        Highlights
      </div>
      <div className={styles.grid}>
        {portfolioData.highlights.map((item) => (
          <article key={item} className={styles.card}>
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
