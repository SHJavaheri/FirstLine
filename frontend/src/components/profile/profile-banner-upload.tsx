"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2, Image, Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

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
import { Label } from "@/components/ui/label";
import { getCroppedImage } from "@/lib/crop-image";

type ProfileBannerUploadProps = {
  currentBannerUrl?: string | null;
  userName: string;
};

export function ProfileBannerUpload({ currentBannerUrl, userName }: ProfileBannerUploadProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const resetState = () => {
    setSelectedImage(null);
    setRawImage(null);
    setOriginalImage(null);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
      setRawImage(base64String);
      setIsCropping(true);
      setSelectedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApplyCrop = useCallback(async () => {
    if (!rawImage || !croppedAreaPixels) return;

    try {
      const cropped = await getCroppedImage(rawImage, croppedAreaPixels);
      setSelectedImage(cropped);
      setIsCropping(false);
      setError(null);
    } catch (error) {
      console.error("Error cropping banner:", error);
      setError("Unable to crop banner. Please try again.");
    }
  }, [croppedAreaPixels, rawImage]);

  const handleRecrop = () => {
    const imageToRecrop = originalImage || currentBannerUrl;
    if (imageToRecrop) {
      if (!originalImage && currentBannerUrl) {
        setOriginalImage(currentBannerUrl);
      }
      setRawImage(imageToRecrop);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerUrl: selectedImage }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update banner");
      }

      setOpen(false);
      resetState();
      router.refresh();
    } catch (error) {
      console.error("Error updating banner:", error);
      setError(error instanceof Error ? error.message : "Failed to update banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove your banner photo?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/banner", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove banner");
      }

      setOpen(false);
      setSelectedImage(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    } catch (error) {
      console.error("Error removing banner:", error);
      setError(error instanceof Error ? error.message : "Failed to remove banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="group relative h-48 w-full overflow-hidden rounded-t-xl">
          {currentBannerUrl ? (
            <img
              src={currentBannerUrl}
              alt={`${userName}'s banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-slate-700 to-slate-900">
              <Image className="h-16 w-16 text-slate-400" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex flex-col items-center gap-2 text-white">
              <Camera className="h-8 w-8" />
              <span className="text-sm font-medium">
                {currentBannerUrl ? "Change Banner" : "Add Banner"}
              </span>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Banner Photo</DialogTitle>
          <DialogDescription>
            Upload a banner image from your device. Recommended size: 1200x300px
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label>Banner Image</Label>
              {isCropping && rawImage ? (
                <div className="space-y-3">
                  <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-900/80">
                    <Cropper
                      image={rawImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={4}
                      cropShape="rect"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleApplyCrop}>
                      Apply Crop
                    </Button>
                  </div>
                </div>
              ) : selectedImage || currentBannerUrl ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage || currentBannerUrl || ""}
                    alt="Banner preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Image
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleRecrop}
                    >
                      Re-crop
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/30 dark:hover:border-slate-500 dark:hover:bg-slate-800/50"
                >
                  <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                    <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                    Click to upload banner image
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            {currentBannerUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={loading}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Banner
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedImage}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentBannerUrl && !selectedImage ? "Save" : "Update Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
