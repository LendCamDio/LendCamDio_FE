import { motion } from "framer-motion";
import { useEffect } from "react";
import { animations } from "./animations";
import type { PageTransitionProps } from "@/types/rout.type";

export default function PageWrapper({
  children,
  animation = "fade",
}: PageTransitionProps) {
  const config = animations[animation];

  useEffect(() => {
    // Reset scroll position on animation start
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [animation]);

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
    >
      {children}
    </motion.div>
  );
}
