"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type RatingDialogProps = {
  professionalAccountId: string;
  professionalName: string;
  existingRating?: number;
  existingComment?: string;
};

export function RatingDialog({
  professionalAccountId,
  professionalName,
  existingRating,
  existingComment,
}: RatingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingComment || "");

  useEffect(() => {
    if (open) {
      setRating(existingRating || 0);
      setComment(existingComment || "");
    }
  }, [open, existingRating, existingComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalAccountId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your rating?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/ratings?professionalAccountId=${professionalAccountId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting rating:", error);
      alert("Failed to delete rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={existingRating ? "outline" : "default"} size="sm">
          <Star className="mr-2 h-4 w-4" />
          {existingRating ? "Edit Rating" : "Rate Professional"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {existingRating ? "Edit Your Rating" : "Rate Professional"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with {professionalName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-slate-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            {existingRating && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Delete Rating
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || rating === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingRating ? "Update Rating" : "Submit Rating"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
