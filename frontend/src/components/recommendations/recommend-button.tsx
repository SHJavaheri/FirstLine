"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RecommendationModal } from "./recommendation-modal";

type RecommendButtonProps = {
  professionalAccountId: string;
  professionalName: string;
  profession: string;
  initialIsRecommended?: boolean;
};

export function RecommendButton({
  professionalAccountId,
  professionalName,
  profession,
  initialIsRecommended,
}: RecommendButtonProps) {
  const [isRecommended, setIsRecommended] = useState(initialIsRecommended ?? false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(initialIsRecommended === undefined);

  useEffect(() => {
    if (initialIsRecommended !== undefined) {
      setIsInitialLoading(false);
      return;
    }

    let canceled = false;

    async function fetchRecommendationStatus() {
      try {
        setIsInitialLoading(true);
        const response = await fetch(
          `/api/recommendations/check?professionalAccountId=${professionalAccountId}`
        );
        if (!response.ok) {
          throw new Error("Failed to load recommendation status");
        }

        const data = await response.json();
        if (!canceled && typeof data.isRecommended === "boolean") {
          setIsRecommended(data.isRecommended);
        }
      } catch (error) {
        console.error("Error fetching recommendation status:", error);
      } finally {
        if (!canceled) {
          setIsInitialLoading(false);
        }
      }
    }

    fetchRecommendationStatus();

    return () => {
      canceled = true;
    };
  }, [professionalAccountId, initialIsRecommended]);

  const handleClick = () => {
    if (isRecommended) {
      handleRemoveRecommendation();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleRemoveRecommendation = async () => {
    if (!confirm("Are you sure you want to remove your recommendation?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/recommendations?professionalAccountId=${professionalAccountId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setIsRecommended(false);
      }
    } catch (error) {
      console.error("Error removing recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsRecommended(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading || isInitialLoading}
        className="h-8 w-8 p-0"
        title={isRecommended ? "Remove recommendation" : "Recommend this professional"}
      >
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
            isRecommended
              ? "border-green-600 bg-green-600 text-white"
              : "border-slate-400 dark:border-slate-500 text-slate-400 dark:text-slate-500 hover:border-green-600 hover:text-green-600"
          }`}
        >
          R
        </div>
      </Button>

      <RecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professionalName={professionalName}
        professionalAccountId={professionalAccountId}
        profession={profession}
        onSuccess={handleSuccess}
      />
    </>
  );
}
