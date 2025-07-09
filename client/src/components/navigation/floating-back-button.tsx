import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingBackButtonProps {
  onClick: () => void;
  show?: boolean;
}

export function FloatingBackButton({ onClick, show = true }: FloatingBackButtonProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -50 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed top-24 left-6 z-50"
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="h-12 w-12 rounded-full atomic-card atomic-hover-scale atomic-hover-glow border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/25"
      >
        <ArrowLeft className="h-5 w-5 text-cyan-400" />
      </motion.button>
    </motion.div>
  );
}