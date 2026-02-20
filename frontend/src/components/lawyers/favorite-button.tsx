"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

type FavoriteButtonProps = {
  professionalAccountId: string;
  initialIsFavorite?: boolean;
};

export function FavoriteButton({ professionalAccountId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(initialIsFavorite === undefined);

  async function toggleFavorite() {
    setIsLoading(true);
    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites?professionalAccountId=${professionalAccountId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorite(false);
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionalAccountId }),
        });

        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (initialIsFavorite !== undefined) {
      setIsInitialLoading(false);
      return;
    }

    let canceled = false;

    async function fetchFavoriteStatus() {
      try {
        setIsInitialLoading(true);
        const response = await fetch(
          `/api/favorites?professionalAccountId=${professionalAccountId}`
        );
        if (!response.ok) {
          throw new Error("Failed to load favorite status");
        }

        const data = await response.json();
        if (!canceled && typeof data.favorite === "boolean") {
          setIsFavorite(data.favorite);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      } finally {
        if (!canceled) {
          setIsInitialLoading(false);
        }
      }
    }

    fetchFavoriteStatus();

    return () => {
      canceled = true;
    };
  }, [professionalAccountId, initialIsFavorite]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading || isInitialLoading}
      className="h-8 w-8 p-0"
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"}`}
      />
    </Button>
  );
}
