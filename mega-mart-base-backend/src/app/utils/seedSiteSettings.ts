import { SiteSettingsModel } from '../modules/settings/settings.model';

export const seedSiteSettings = async () => {
  const existing = await SiteSettingsModel.findOne();

  if (!existing) {
    await SiteSettingsModel.create({
      siteName: 'Mega Mart',
      siteLogo:
        'https://www.nkitseva.com/storage/logos/HEVUGuWXvKwdnGK7tncnpKF8rqcEHl1bxwV2qk5y.png',
      contactEmail: 'support@megamart.com',
      contactPhone: '+8801712345678',
      contactAddress: 'House #45, Road #12, Dhanmondi, Dhaka-1209, Bangladesh',
      about:
        'Mega Mart is your one-stop online shopping destination for electronics, fashion, groceries, and more. We aim to provide high-quality products at unbeatable prices with fast delivery and trusted service.',
      socialLinks: {
        facebook: 'https://facebook.com/megamartbd',
        instagram: 'https://instagram.com/megamart.bd',
        twitter: 'https://twitter.com/megamartbd',
        linkedin: 'https://linkedin.com/company/megamartbd',
        youtube: 'https://youtube.com/@megamartbd',
        tiktok: 'https://tiktok.com/@megamartbd',
      },
      discountBanner: 'https://i.ibb.co/mb3jXpq/megamart-discount-banner.jpg',
      appInfoBanner: 'https://i.ibb.co/f8Mmf1N/megamart-appinfo-banner.jpg',
    });

    console.log('✅ Mega Mart site settings seeded successfully!');
  } else {
    console.log('⚠️ Site settings already exist, skipping seed.');
  }
};
