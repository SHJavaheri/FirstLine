"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ProfilePageContentProps = {
  children: ReactNode;
};

export function ProfilePageContent({ children }: ProfilePageContentProps) {
  return (
    <motion.div
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
