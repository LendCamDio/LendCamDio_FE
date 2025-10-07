import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Khi component render lần đầu, scroll lên đầu
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.99 }} // Initial state: slightly faded, offset downward, and scaled down
      animate={{ opacity: 1, y: 0, scale: 1 }} // Animate to fully visible, centered, and normal scale
      exit={{ opacity: 0, y: -20, scale: 0.99 }} // Exit state: fade out, move upward, and scale down
    >
      {children}
    </motion.div>
  );
}
