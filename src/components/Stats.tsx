import { portfolioData } from "../data/portfolio";
import styles from "./Stats.module.css";

function Stats() {
  return (
    <section className={styles.stats}>
      {portfolioData.stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <div className={styles.statVal}>{stat.value}</div>
          <div className={styles.statLbl}>{stat.label}</div>
        </div>
      ))}
    </section>
  );
}

export default Stats;
