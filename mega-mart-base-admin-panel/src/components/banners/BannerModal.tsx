/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, FormProvider } from "react-hook-form";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/featured/Banner/bannerApi";

// ---------- Types ----------
export interface BannerFormValues {
  title: string;
  subTitle: string;
  image: string;
  discount: number;
  isActive: boolean;
  buttonText: string;
  buttonLink: string;
}

export interface Banner {
  _id: string;
  title?: string;
  subTitle?: string;
  image?: string;
  discount?: number;
  isActive?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface BannerCreateUpdateProps {
  children: React.ReactNode;
  type?: "edit" | "create";
  editBanner?: Banner;
  refetch?: () => void;
}

// ---------- Component ----------
export default function BannerCreateUpdate({
  children,
  type,
  editBanner,
  refetch,
}: BannerCreateUpdateProps) {
  const [createBanner, { isLoading }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: editLoading }] = useUpdateBannerMutation();
  const [bannerImg, setBannerImg] = useState<FileWithPreview | null>(null);
  const [open, setOpen] = useState(false);

  const methods = useForm<BannerFormValues>({
    defaultValues: {
      title: "",
      subTitle: "",
      image: "",
      discount: 0,
      isActive: false,
      buttonText: "",
      buttonLink: "",
    },
  });

  const { handleSubmit, register, setValue, watch, reset } = methods;

  // Prefill form if editing
  useEffect(() => {
    if (editBanner) {
      reset({
        title: editBanner.title || "",
        subTitle: editBanner.subTitle || "",
        image: editBanner.image || "",
        discount: editBanner.discount || 0,
        isActive: editBanner.isActive || false,
        buttonText: editBanner.buttonText || "",
        buttonLink: editBanner.buttonLink || "",
      });
    }
  }, [editBanner, reset]);

  // ---------- Submit Handler ----------
  const onSubmit = async (data: BannerFormValues) => {
    const submitToast = toast.loading(
      type === "edit" ? "Updating Banner..." : "Creating Banner..."
    );

    try {
      const formData = new FormData();

      // Append each field individually
      formData.append("title", data.title);
      formData.append("subTitle", data.subTitle);
      formData.append("discount", String(data.discount));
      formData.append("isActive", String(data.isActive));
      formData.append("buttonText", data.buttonText);
      formData.append("buttonLink", data.buttonLink);

      if (bannerImg?.file) {
        formData.append("image", bannerImg.file as File);
      }

      if (type === "edit" && editBanner?._id) {
        await updateBanner({
          id: editBanner._id,
          body: formData,
        }).unwrap();
        toast.success("Banner updated successfully!", { id: submitToast });
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully!", { id: submitToast });
      }

      setOpen(false);
      reset();
      refetch?.();
      setBannerImg(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        error?.message || "Something went wrong!";
      toast.error(errorMessage, { id: submitToast });
    }
  };

  // ---------- Render ----------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* ✅ Children can now be any React element */}
        {children}
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            {type === "edit" ? "Edit Banner" : "Add Banner"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add or update banner details here.
        </DialogDescription>

        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <div className="max-h-[300px]">
              <BannerImage setBannerImg={setBannerImg} editBanner={editBanner} />

              <FormProvider {...methods}>
                <form
                  id="banner-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label>Banner Title</Label>
                      <Input
                        placeholder="Banner Title"
                        {...register("title")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label>Sub Title</Label>
                      <Input
                        placeholder="Banner Sub Title"
                        {...register("subTitle")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 space-y-2">
                      <Label>Discount %</Label>
                      <Input
                        type="number"
                        placeholder="Banner discount"
                        {...register("discount")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Status
                    </Label>

                    <div
                      onClick={() => setValue("isActive", !watch("isActive"))}
                      className={`relative flex items-center w-28 h-9 cursor-pointer rounded-full p-1 transition-all duration-300 shadow-sm ${watch("isActive")
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow-md transform transition-transform duration-300 ${watch("isActive")
                          ? "translate-x-[68px]"
                          : "translate-x-0"
                          }`}
                      ></div>

                      <div className="flex justify-between w-full px-3 text-xs font-semibold text-white select-none">
                        <span
                          className={`${watch("isActive") ? "opacity-100" : "opacity-50"
                            }`}
                        >
                          Active
                        </span>
                        <span
                          className={`${!watch("isActive") ? "opacity-100" : "opacity-50"
                            }`}
                        >
                          Inactive
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      placeholder="Button Text"
                      {...register("buttonText")}
                    />
                    <Label>Button Link</Label>
                    <Input
                      placeholder="/link-here"
                      {...register("buttonLink")}
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button form="banner-form" type="submit" disabled={isLoading || editLoading}>
            {isLoading || editLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Banner Image Upload ----------
function BannerImage({
  setBannerImg,
  editBanner,
}: {
  setBannerImg: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  editBanner?: Banner;
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: [],
    });

  useEffect(() => {
    if (files && files.length > 0) {
      setBannerImg(files[0]);
    } else {
      setBannerImg(null);
    }
  }, [files, setBannerImg]);

  const currentImage = files[0]?.preview || null;

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden">
        <Image
          className="size-full object-cover"
          src={
            currentImage ||
            editBanner?.image ||
            "https://via.placeholder.com/512x96?text=No+Banner"
          }
          alt="Banner Image"
          width={512}
          height={96}
        />

        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>

          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />
    </div>
  );
}
