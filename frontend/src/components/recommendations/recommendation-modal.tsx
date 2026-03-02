"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getTagsForProfession, WOULD_USE_AGAIN_OPTIONS, type WouldUseAgainOption } from "@/config/recommendation-tags";

type RecommendationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  professionalName: string;
  professionalAccountId: string;
  profession: string;
  onSuccess: () => void;
};

export function RecommendationModal({
  isOpen,
  onClose,
  professionalName,
  professionalAccountId,
  profession,
  onSuccess,
}: RecommendationModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [wouldUseAgain, setWouldUseAgain] = useState<WouldUseAgainOption | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tagCategories = getTagsForProfession(profession);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      setError("Please select at least one tag");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalAccountId,
          category: profession,
          selectedTags,
          note: comment || undefined,
          wouldUseAgain: wouldUseAgain || undefined,
          isFavorite: false,
          visibility: "PUBLIC",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create recommendation");
      }

      const shouldFavorite = window.confirm(
        "Recommendation created successfully! Would you also like to add this professional to your favorites?"
      );

      if (shouldFavorite) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ professionalAccountId }),
        });
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recommendation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedTags([]);
    setComment("");
    setWouldUseAgain("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recommend {professionalName}</h2>
            <p className="text-sm text-slate-600">Share your experience to help friends</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-900">
                Select up to 3 tags <span className="text-red-600">*</span>
              </label>
              <span className="text-xs text-slate-500">
                {selectedTags.length}/3 selected
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(tagCategories).map(([category, tags]) => (
                <div key={category}>
                  <h3 className="mb-2 text-sm font-medium text-slate-700">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      const isDisabled = !isSelected && selectedTags.length >= 3;
                      
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          disabled={isDisabled}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : isDisabled
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 200))}
              placeholder="Share more details about your experience..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-slate-500">{comment.length}/200 characters</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Would you use this professional again? (Optional)
            </label>
            <select
              value={wouldUseAgain}
              onChange={(e) => setWouldUseAgain(e.target.value as WouldUseAgainOption | "")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              {WOULD_USE_AGAIN_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedTags.length === 0}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Recommendation"}
          </button>
        </div>
      </div>
    </div>
  );
}
