import { useEffect, useMemo, useState } from "react";
import {
  About,
  Certifications,
  Competencies,
  Experience,
  Footer,
  Hero,
  Highlights,
  Navbar,
  Projects,
  ReachOut,
  Skills,
  Stats,
} from "./components";

type Theme = "dark" | "light";

const getSavedTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
};

function App() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const sections = useMemo(
    () => [
      { id: "about", label: "About Me", component: <About /> },
      { id: "skills", label: "Technical Skills", component: <Skills /> },
      { id: "experience", label: "Experience", component: <Experience /> },
      { id: "projects", label: "Projects", component: <Projects /> },
      { id: "competencies", label: "Core Competencies", component: <Competencies /> },
      { id: "highlights", label: "Highlights", component: <Highlights /> },
      { id: "certifications", label: "Certifications", component: <Certifications /> },
      { id: "reach-out", label: "Reach Me Out", component: <ReachOut /> },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0.15, 0.3, 0.5],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div id="top" className="container">
      <Navbar
        items={sections.map(({ id, label }) => ({ id, label }))}
        activeId={activeSection}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <Hero />
      <div className="divider" />
      <Stats />
      <main className="sectionStack">
        {sections.map((section) => (
          <div key={section.id} className="sectionFrame">
            {section.component}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default App;
