"use client";

import * as React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="relative">
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700">
            <img
              src={value}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRemove}
            className="mt-2"
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/30 dark:hover:border-slate-500 dark:hover:bg-slate-800/50",
            isDragging && "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-950/30",
          )}
        >
          <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
            {isDragging ? (
              <Upload className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            )}
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">
            {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
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
  );
}
