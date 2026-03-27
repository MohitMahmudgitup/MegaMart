"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSiteSettings = void 0;
const settings_model_1 = require("../modules/settings/settings.model");
const seedSiteSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield settings_model_1.SiteSettingsModel.findOne();
    if (!existing) {
        yield settings_model_1.SiteSettingsModel.create({
            siteName: 'Mega Mart',
            siteLogo: 'https://www.nkitseva.com/storage/logos/HEVUGuWXvKwdnGK7tncnpKF8rqcEHl1bxwV2qk5y.png',
            contactEmail: 'support@megamart.com',
            contactPhone: '+8801712345678',
            contactAddress: 'House #45, Road #12, Dhanmondi, Dhaka-1209, Bangladesh',
            about: 'Mega Mart is your one-stop online shopping destination for electronics, fashion, groceries, and more. We aim to provide high-quality products at unbeatable prices with fast delivery and trusted service.',
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
    }
    else {
        console.log('⚠️ Site settings already exist, skipping seed.');
    }
});
exports.seedSiteSettings = seedSiteSettings;
