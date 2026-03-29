"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetSettingsQuery } from "@/redux/featured/setting/settingAPI";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
  {
    title: "Menu",
    links: [
      { label: "All Product Brand", href: "/all-product-brand" },
      { label: "Become a Seller", href: "/home-lunch" },
      { label: "Product Collection", href: "/product-collection" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Privacy Policy", href: "/privacy-trust" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "FAQ", href: "/faqs-page" },
      { label: "Privacy Policy", href: "/privacy-trust" },
      "Search",
      "Shop",
      "Return & Refund Policy",
    ],
  },
  {
    title: "Shop",
    links: ["Product Single", "Women", "Return & Exchange"],
  },
  {
    title: "Policies",
    links: [
      "Privacy Policy Update",
      "Single Post",
      "Sports",
      "Terms & Conditions",
      "Refund Policy",
      "Warranty Policy",
      "Exchange Policy",
      "EMI Policy",
      "Others Policy",
    ],
  },
];

const Footer = () => {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const site: any = settings?.[0];

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo & About */}
          <div className="col-span-1">
            <div className="relative w-36 h-16">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
              ) : (
                <Image
                  src={site?.siteLogo || "/logo.png"}
                  alt={site?.siteName || "Logo"}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600">
              {site?.about ||
                "Your one-stop shop for everything you need. Trusted by thousands of happy customers."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {site?.socialLinks?.facebook && (
                <Link
                  href={site.socialLinks.facebook}
                  target="_blank"
                  className="transition hover:scale-110"
                >
                  <Image src="/fb.png" alt="Facebook" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.instagram && (
                <Link
                  href={site.socialLinks.instagram}
                  target="_blank"
                  className="transition hover:scale-110"
                >
                  <Image src="/insta.png" alt="Instagram" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.linkedin && (
                <Link
                  href={site.socialLinks.linkedin}
                  target="_blank"
                  className="transition hover:scale-110"
                >
                  <Image src="/ld.png" alt="LinkedIn" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.youtube && (
                <Link
                  href={site.socialLinks.youtube}
                  target="_blank"
                  className="transition hover:scale-110"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
                    alt="YouTube"
                    width={24}
                    height={24}
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map(({ title, links }, i) => (
            <div key={i} className="sm:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {links.map((link, j) =>
                  typeof link === "string" ? (
                    <li key={j}>
                      <a href="#" className="hover:text-gray-900 transition">
                        {link}
                      </a>
                    </li>
                  ) : (
                    <li key={j}>
                      <Link href={link.href} className="hover:text-gray-900 transition">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="sm:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3">Stay Connected</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {site?.contactEmail && (
                <li className="flex items-start gap-3 group">
                  <Mail className="mt-0.5 text-gray-500 group-hover:text-black transition" />
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="hover:text-black transition"
                  >
                    {site.contactEmail}
                  </a>
                </li>
              )}

              {site?.contactPhone && (
                <li className="flex items-start gap-3 group">
                  <Phone className="mt-0.5 text-gray-500 group-hover:text-black transition" />
                  <a
                    href={`tel:${site.contactPhone}`}
                    className="hover:text-black transition"
                  >
                    {site.contactPhone}
                  </a>
                </li>
              )}

              {site?.contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-gray-500" />
                  <span>{site.contactAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {site?.siteName || "Mega Mart"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;