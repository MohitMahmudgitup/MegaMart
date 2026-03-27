/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

import { useUpdateUserMutation } from "@/redux/featured/user/userApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setUser,
  logoutUser,
  selectCurrentUser,
} from "@/redux/featured/auth/authSlice";
import ProfileImage from "@/components/Profile";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  bio: string;
  notifications: boolean;
  image?: string;
}

interface ApiResponse {
  data?: Record<string, unknown>;
  user?: Record<string, unknown>;
  message?: string;
  success?: boolean;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [image, setImage] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    bio: "",
    notifications: true,
  });

  useEffect(() => {
    if (currentUser) {
      const nameParts = currentUser.name?.split(" ") || ["", ""];
      const newFormData: FormData = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: currentUser.email || "",
        contactNo: currentUser.contactNo || "",
        bio: currentUser.bio || "",
        notifications: true,
      };
      setFormData(newFormData);
    }
  }, [currentUser]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentUser?._id) return;
    const newFormData = new FormData();

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      contactNo: formData.contactNo,
      bio: formData.bio,
    };

    newFormData.append("data", JSON.stringify(userData));

    if (image) {
      newFormData.append("profile", image);
    }

    try {
      const response = await updateUser({
        id: currentUser._id,
        newFormData,
      }).unwrap();

      console.log(response);

      const apiResponse = response as ApiResponse;
      const updatedUserData =
        apiResponse.data || apiResponse.user || apiResponse;

      if (updatedUserData) {
        dispatch(
          setUser({
            ...currentUser,
            ...updatedUserData,
          })
        );
        toast.success("Profile updated successfully ✅");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status: number }).status === 401
      ) {
        toast.error("Session expired. Please login again.");
        dispatch(logoutUser());
        router.push("/auth/login");
        return;
      }

      const errMsg =
        (error as { data?: { message?: string } })?.data?.message ||
        "Profile update failed ❌";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen  rounded-lg ">
      <div className="w-full mx-auto w-full">

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <Card className="bg-white shadow-sm border rounded-lg w-full">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6 md:mb-8">
                  Profile Information
                </h2>

                <div className="space-y-6 md:space-y-8">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Email & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contact No
                      </label>
                      <Input
                        type="tel"
                        value={formData.contactNo}
                        onChange={(e) =>
                          handleInputChange("contactNo", e.target.value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="grid md:grid-cols-2  ">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        className="w-full min-h-[100px] md:min-h-[120px] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3 md:mb-4 text-center mt-1">
                        Profile Picture
                      </label>
                      <div className="flex  items-start justify-center sm:items-center gap-4 sm:gap-6">
                        <div className="relative">
                          <ProfileImage
                            setImage={setImage}
                            currentUser={currentUser}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex max-sm:flex-col items-center justify-between">
                    {/* Notifications */}
                    <div className="flex items-start justify-center gap-3">
                      <Checkbox
                        id="notifications"
                        checked={formData.notifications}
                        onCheckedChange={(checked) =>
                          handleInputChange("notifications", checked as boolean)
                        }
                      />
                      <label
                        htmlFor="notifications"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Receive email notifications
                      </label>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 md:pt-6 flex justify-center">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg w-full sm:w-auto disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
