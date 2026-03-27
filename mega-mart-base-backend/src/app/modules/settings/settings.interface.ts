
export interface TSiteSettings {
  siteName: string; 
  siteLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  about?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  discountBanner: string;
  appInfoBanner: string;
}
