"use client";

import { motion } from "framer-motion";
import { LawyerCard } from "@/components/lawyers/lawyer-card";
import type { LawyerListItem } from "@/types";

type AnimatedCardsGridProps = {
  lawyers: LawyerListItem[];
  showFavoriteButton: boolean;
  showRecommendButton: boolean;
};

export function AnimatedCardsGrid({
  lawyers,
  showFavoriteButton,
  showRecommendButton,
}: AnimatedCardsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lawyers.map((lawyer, index) => (
        <motion.div
          key={lawyer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.35 + Math.min(index, 11) * 0.075,
            ease: "easeOut",
          }}
        >
          <LawyerCard
            lawyer={lawyer}
            showFavoriteButton={showFavoriteButton}
            showRecommendButton={showRecommendButton}
          />
        </motion.div>
      ))}
    </div>
  );
}
