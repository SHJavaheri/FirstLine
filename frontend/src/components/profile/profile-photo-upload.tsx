"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2, User } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfilePhotoUploadProps = {
  currentPhotoUrl?: string | null;
  userName: string;
};

export function ProfilePhotoUpload({ currentPhotoUrl, userName }: ProfilePhotoUploadProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl.trim()) {
      alert("Please enter a photo URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: photoUrl.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update photo");
      }

      setOpen(false);
      setPhotoUrl("");
      router.refresh();
    } catch (error) {
      console.error("Error updating photo:", error);
      alert(error instanceof Error ? error.message : "Failed to update photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/photo", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove photo");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error removing photo:", error);
      alert(error instanceof Error ? error.message : "Failed to remove photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt={userName}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
              <User className="h-12 w-12 text-slate-500" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Enter a URL for your profile photo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                required
              />
              <p className="text-xs text-slate-600">
                Enter a direct link to an image (JPG, PNG, etc.)
              </p>
            </div>
            {currentPhotoUrl && (
              <div className="space-y-2">
                <Label>Current Photo</Label>
                <img
                  src={currentPhotoUrl}
                  alt="Current profile"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            {currentPhotoUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={loading}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Photo
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !photoUrl.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Photo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
