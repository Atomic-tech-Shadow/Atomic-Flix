import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FloatingBackButtonProps {
  onClick: () => void;
  show?: boolean;
}

export function FloatingBackButton({ onClick, show = true }: FloatingBackButtonProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed top-20 left-4 z-40"
    >
      <Button
        onClick={onClick}
        size="icon"
        className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}