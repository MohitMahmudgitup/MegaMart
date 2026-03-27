"use client";

import React, { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/featured/setting/settingAPI";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { X, Upload, Mail, Phone, MapPin, FileText, Globe } from "lucide-react";

interface SocialLinks {
  [key: string]: string;
}

interface ShopInfo {
  siteName: string;
  siteLogo: File | string;
  discountBanner: File | string;
  appInfoBanner: File | string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  about: string;
  socialLinks: SocialLinks;
}

interface ShowNavigationProps {
  setShowNavigation: (value: boolean) => void;
}

const ShowNavigation: React.FC<ShowNavigationProps> = ({ setShowNavigation }) => {
  const { data: settings , refetch } = useGetSettingsQuery();
  const settingsData: any = settings?.[0];
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    siteName: "",
    siteLogo: "",
    discountBanner: "",
    appInfoBanner: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    about: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
  });

  useEffect(() => {
    if (settingsData) {
      setShopInfo({
        siteName: settingsData.siteName || "",
        siteLogo: settingsData.siteLogo || "",
        discountBanner: settingsData.discountBanner || "",
        appInfoBanner: settingsData.appInfoBanner || "",
        contactEmail: settingsData.contactEmail || "",
        contactPhone: settingsData.contactPhone || "",
        contactAddress: settingsData.contactAddress || "",
        about: settingsData.about || "",
        socialLinks: settingsData.socialLinks || {},
      });
    }
  }, [settingsData]);

  const handleSave = async () => {
    if (!settingsData?._id) return toast.error("Settings ID not found!");

    try {
      const formData : any = new FormData();

      const data = {
        siteName: shopInfo.siteName,
        contactEmail: shopInfo.contactEmail,
        contactPhone: shopInfo.contactPhone,
        contactAddress: shopInfo.contactAddress,
        about: shopInfo.about,
        socialLinks: shopInfo.socialLinks,
      };

      formData.append("data", JSON.stringify(data));

      if (shopInfo.discountBanner instanceof File)
        formData.append("discountBanner", shopInfo.discountBanner);
      if (shopInfo.appInfoBanner instanceof File)
        formData.append("appInfoBanner", shopInfo.appInfoBanner);
      if (shopInfo.siteLogo instanceof File)
        formData.append("siteLogo", shopInfo.siteLogo);

      await updateSettings({
        id: settingsData._id,
        formData,
      }).unwrap();
      refetch()
      toast.success("Settings updated successfully!");
      setShowNavigation(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings.");
    }
  };

  const socialIcons: { [key: string]: string } = {
    facebook: "📘",
    instagram: "📷",
    twitter: "🐦",
    linkedin: "💼",
    youtube: "📺",
    tiktok: "🎵",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Site Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your site information and preferences
              </p>
            </div>
            <button
              onClick={() => setShowNavigation(false)}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {/* Basic Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                <div>
                  <Label htmlFor="site-name" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Site Name
                  </Label>
                  <Input
                    id="site-name"
                    value={shopInfo.siteName}
                    onChange={(e) => setShopInfo({ ...shopInfo, siteName: e.target.value })}
                    placeholder="Enter your site name"
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Media Assets Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Media Assets
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Site Logo */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <Label htmlFor="site-logo" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Site Logo
                  </Label>
                  <Input
                    id="site-logo"
                    type="file"
                    onChange={(e) =>
                      setShopInfo({
                        ...shopInfo,
                        siteLogo: e.target.files?.[0] || "",
                      })
                    }
                    className="mt-2"
                  />
                  {typeof shopInfo.siteLogo === "string" && shopInfo.siteLogo && (
                    <div className="mt-3 relative group">
                      <img
                        src={shopInfo.siteLogo}
                        alt="Site Logo"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">Current Logo</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Discount Banner */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <Label htmlFor="discount-banner" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Discount Banner
                  </Label>
                  <Input
                    id="discount-banner"
                    type="file"
                    onChange={(e) =>
                      setShopInfo({
                        ...shopInfo,
                        discountBanner: e.target.files?.[0] || "",
                      })
                    }
                    className="mt-2"
                  />
                  {typeof shopInfo.discountBanner === "string" && shopInfo.discountBanner && (
                    <div className="mt-3 relative group">
                      <img
                        src={shopInfo.discountBanner}
                        alt="Discount Banner"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">Current Banner</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* App Info Banner */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <Label htmlFor="app-info-banner" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    App Info Banner
                  </Label>
                  <Input
                    id="app-info-banner"
                    type="file"
                    onChange={(e) =>
                      setShopInfo({
                        ...shopInfo,
                        appInfoBanner: e.target.files?.[0] || "",
                      })
                    }
                    className="mt-2"
                  />
                  {typeof shopInfo.appInfoBanner === "string" && shopInfo.appInfoBanner && (
                    <div className="mt-3 relative group">
                      <img
                        src={shopInfo.appInfoBanner}
                        alt="App Info Banner"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">Current Banner</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                <div>
                  <Label htmlFor="contact-email" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={shopInfo.contactEmail}
                    onChange={(e) => setShopInfo({ ...shopInfo, contactEmail: e.target.value })}
                    placeholder="contact@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={shopInfo.contactPhone}
                    onChange={(e) => setShopInfo({ ...shopInfo, contactPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-address" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <Input
                    id="contact-address"
                    value={shopInfo.contactAddress}
                    onChange={(e) => setShopInfo({ ...shopInfo, contactAddress: e.target.value })}
                    placeholder="123 Main St, City, Country"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="about" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    About
                  </Label>
                  <textarea
                    id="about"
                    value={shopInfo.about}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    onChange={(e) => setShopInfo({ ...shopInfo, about: e.target.value })}
                    placeholder="Tell us about your business..."
                  />
                </div>
              </div>
            </section>

            {/* Social Media Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-pink-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Social Media Links
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(shopInfo.socialLinks).map((key) => (
                    <div key={key}>
                      <Label htmlFor={key} className="text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="text-lg">{socialIcons[key]}</span>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={key}
                        value={shopInfo.socialLinks[key]}
                        onChange={(e) =>
                          setShopInfo({
                            ...shopInfo,
                            socialLinks: {
                              ...shopInfo.socialLinks,
                              [key]: e.target.value,
                            },
                          })
                        }
                        placeholder={`https://${key}.com/yourprofile`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNavigation(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowNavigation;