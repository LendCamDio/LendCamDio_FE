import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function scrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export function scrollToSection(id: string) {
  const navbarHeight = 80; // Đúng chiều cao thật của Navbar
  const element = document.getElementById(id);

  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}
