"use client";

import Image from "next/image";
import React from "react";
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
      { label: "Terms Conditions", href: "/terms-conditions" },
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
      "Return and refund policy",
    ],
  },
  {
    title: "Shop",
    links: ["Product Single", "Women", "Return & Exchange"],
  },
  {
    title: "Terms & Conditions",
    links: ["Privacy Policy Update", "Single Post", "Sports", "Terms & Conditions" , "Refund Policy" , "Privacy Policy" , "Warranty Policy", "Exchange Policy" , "EMI Policy" , "Others Policy"],
  },
];

const Footer = () => {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const site: any = settings?.[0];

  return (
    <footer className="mt-16 mb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10  bg-white md:rounded-lg border-t-2 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 ">
          {/* Logo & Social */}
          <div className="col-span-1   sm:col-span-1 md:col-span-1">
            {/* Logo */}
            <div className="relative w-40 h-16 ">
              {isLoading ? (
                <div className="w-40 h-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                <Image
                  src={site?.siteLogo || "/logo.png"}
                  alt={site?.siteName || "Logo"}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* About us */}
            <p className="mt-4 text-sm text-gray-600">
              {site?.about ||
                "Your one-stop shop for everything you need. Trusted by thousands of happy customers."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {site?.socialLinks?.facebook && (
                <Link href={site.socialLinks.facebook} target="_blank">
                  <Image src="/fb.png" alt="Facebook" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.instagram && (
                <Link href={site.socialLinks.instagram} target="_blank">
                  <Image src="/insta.png" alt="Instagram" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.linkedin && (
                <Link href={site.socialLinks.linkedin} target="_blank">
                  <Image src="/ld.png" alt="LinkedIn" width={24} height={24} />
                </Link>
              )}
              {site?.socialLinks?.youtube && (
                <Link href={site.socialLinks.youtube} target="_blank">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" alt="YouTube" width={24} height={24} />
                </Link>
              )}
            </div>
          </div>

          {/* Footer Sections */}
          {footerLinks.map(({ title, links }, i) => (
            <div key={i} className="sm:col-span-1 mx-4 ">
              <h3 className="font-semibold xl:font-bold mb-3">{title}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {links.map((link, j) =>
                  typeof link === "string" ? (
                    <li key={j}>
                      <a href="#" className="hover:text-gray-900">
                        {link}
                      </a>
                    </li>
                  ) : (
                    <li key={j}>
                      <a href={link.href} className="hover:text-gray-900">
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold xl:font-bold mb-3">Stay Connected</h3>

            <ul className="space-y-3 text-sm text-gray-700">
              {site?.contactEmail && (
                <li className="flex items-start gap-3 group">
                  <Mail size={16} className="mt-0.5 text-gray-500 group-hover:text-black transition" />
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="leading-relaxed hover:text-black transition"
                  >
                    {site.contactEmail}
                  </a>
                </li>
              )}

              {site?.contactPhone && (
                <li className="flex items-start gap-3 group">
                  <Phone size={16} className="mt-[2px] text-gray-500 group-hover:text-black transition" />
                  <a
                    href={`tel:${site.contactPhone}`}
                    className="leading-relaxed hover:text-black transition"
                  >
                    {site.contactPhone}
                  </a>
                </li>
              )}

              {site?.contactAddress && (
                <li className="flex items-start gap-3 ">
                  <div>
                    <MapPin size={16} className="mt-[2px] text-gray-500 " />
                  </div>
                  <span className="leading-relaxed">
                    {site.contactAddress}
                  </span>
                </li>
              )}
            </ul>
          </div>


        </div>
          {/* Bottom */}
          <div className="border-t  border-gray-200 mt-10 pt-6 text-center opacity-70 text-sm">
            © {new Date().getFullYear()} {site?.siteName || "Mega Mart"}. All rights reserved.
          </div>
      </div>
    </footer>
  );
};

export default Footer;
