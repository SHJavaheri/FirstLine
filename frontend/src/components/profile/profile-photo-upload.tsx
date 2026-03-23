"use client";

import { useCallback, useRef, useState, type ReactNode, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2, Upload, User } from "lucide-react";
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
import { getCroppedImage } from "@/lib/crop-image";

type ProfilePhotoUploadProps = {
  currentPhotoUrl?: string | null;
  userName: string;
  children?: ReactNode;
};

export function ProfilePhotoUpload({ currentPhotoUrl, userName, children }: ProfilePhotoUploadProps) {
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
      const base64 = reader.result as string;
      setOriginalImage(base64);
      setRawImage(base64);
      setIsCropping(true);
      setSelectedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
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
      const cropped = await getCroppedImage(rawImage, croppedAreaPixels, { circle: true });
      setSelectedImage(cropped);
      setIsCropping(false);
      setError(null);
    } catch (error) {
      console.error("Error cropping photo:", error);
      setError("Unable to crop image. Please try again.");
    }
  }, [croppedAreaPixels, rawImage]);

  const handleRecrop = () => {
    const imageToRecrop = originalImage || currentPhotoUrl;
    if (imageToRecrop) {
      if (!originalImage && currentPhotoUrl) {
        setOriginalImage(currentPhotoUrl);
      }
      setRawImage(imageToRecrop);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoData: selectedImage }),
      });

      const responseData = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to update photo");
      }

      setOpen(false);
      resetState();
      router.refresh();
    } catch (error) {
      console.error("Error updating photo:", error);
      setError(error instanceof Error ? error.message : "Failed to update photo. Please try again.");
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
      resetState();
      router.refresh();
    } catch (error) {
      console.error("Error removing photo:", error);
      alert(error instanceof Error ? error.message : "Failed to remove photo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <button type="button" className="group relative">
      {currentPhotoUrl ? (
        <img
          src={currentPhotoUrl}
          alt={userName}
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
          <User className="h-12 w-12 text-slate-500 dark:text-slate-400" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <Camera className="h-6 w-6 text-white" />
      </div>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>Upload a new profile photo from your device</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {isCropping && rawImage ? (
                <div className="space-y-3">
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900/80">
                    <Cropper
                      image={rawImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
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
              ) : selectedImage || currentPhotoUrl ? (
                <div className="space-y-3">
                  <img
                    src={selectedImage || currentPhotoUrl || ""}
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover"
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
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-8 transition hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-3">
                    <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">Click to upload profile photo</p>
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            {currentPhotoUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={loading}
                className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Photo
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetState();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedImage}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Photo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
