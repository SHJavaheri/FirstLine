"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";

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

type RatingReplyDialogProps = {
  ratingId: string;
  consumerName: string;
  existingReply?: string | null;
};

export function RatingReplyDialog({
  ratingId,
  consumerName,
  existingReply,
}: RatingReplyDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(existingReply || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reply.trim()) {
      alert("Please enter a reply");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/ratings/${ratingId}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: reply.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit reply");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert(error instanceof Error ? error.message : "Failed to submit reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          {existingReply ? "Edit Reply" : "Reply"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {existingReply ? "Edit Your Reply" : "Reply to Rating"}
          </DialogTitle>
          <DialogDescription>
            Respond to {consumerName}&apos;s rating
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Your Response</Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Thank you for your feedback..."
                rows={6}
                required
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !reply.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingReply ? "Update Reply" : "Submit Reply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
