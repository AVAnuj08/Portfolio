import { MouseEvent, useEffect, useState } from "react";
import styles from "./Navbar.module.css";

type NavItem = {
  id: string;
  label: string;
};

type NavbarProps = {
  items: NavItem[];
  activeId: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

function Navbar({ items, activeId, theme, onToggleTheme }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    const handleResize = () => {
      if (window.innerWidth > 720) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", closeMenu);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", closeMenu);
    };
  }, []);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const navbar = document.querySelector("[data-portfolio-navbar]") as HTMLElement | null;
    const navOffset = (navbar?.getBoundingClientRect().height ?? 0) + 52;
    const targetTop = targetId === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });

    window.history.replaceState(null, "", targetId === "top" ? window.location.pathname : `#${targetId}`);
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.navbar} data-portfolio-navbar>
      <span className={styles.topBlur} aria-hidden="true" />
      <a className={styles.topLink} href="#top" aria-label="Back to top" onClick={(event) => scrollToSection(event, "top")}>
        AV
      </a>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="portfolio-nav-links"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav
        id="portfolio-nav-links"
        className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ""}`}
        aria-label="Portfolio sections"
      >
        {items.map((item) => (
          <a
            key={item.id}
            className={`${styles.navLink} ${activeId === item.id ? styles.activeLink : ""}`}
            href={`#${item.id}`}
            onClick={(event) => scrollToSection(event, item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={styles.themeButton}
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-pressed={theme === "light"}
      >
        <span className={styles.themeTrack} aria-hidden="true">
          <svg className={styles.themeIcon} viewBox="0 0 24 24" focusable="false">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2.5M12 19.5V22M4.93 4.93 6.7 6.7M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77" />
          </svg>
          <svg className={styles.themeIcon} viewBox="0 0 24 24" focusable="false">
            <path d="M21 14.2A8.6 8.6 0 0 1 9.8 3a7 7 0 1 0 11.2 11.2Z" />
          </svg>
          <span className={styles.themeThumb} />
        </span>
      </button>
    </header>
  );
}

export default Navbar;
