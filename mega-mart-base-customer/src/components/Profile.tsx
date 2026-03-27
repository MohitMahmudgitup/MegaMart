/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Camera, CircleUserRoundIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { IUser } from "@/types/user";
import Image from "next/image";

export default function ProfileImage({
  setImage,
  currentUser,
}: {
  setImage: any;
  currentUser?: any;
}) {
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
  });

  const previewUrl = files[0]?.preview || null;

  useEffect(() => {
    setImage(files[0]?.file);
  }, [files]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          type="button"
          className={`relative flex size-28 items-center justify-center overflow-hidden rounded-full border border-amber-600 transition-colors outline-none 
  hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 
  disabled:pointer-events-none disabled:opacity-50 data-[dragging=true]:bg-accent/50`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {/* Uploaded or current image */}
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={files[0]?.file?.name || "Uploaded image"}
              fill
              className="absolute inset-0 size-full object-cover"
            />
          ) : currentUser?.image ? (
            <Image
              src={currentUser.image}
                alt="User profile"
                fill
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-10 opacity-60" />
            </div>
          )}

          {/* Camera overlay (only on hover) */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 md:opacity-0  hover:opacity-100 transition-opacity">
            <Camera className="size-5 text-white" />
          </div>
        </button>

        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
