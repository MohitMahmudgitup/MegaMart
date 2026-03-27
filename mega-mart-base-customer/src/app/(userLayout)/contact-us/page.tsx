

import ContactUs from "@/components/ContactUS/ContactUS";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "CartX | Contact",
  description: "Vendor management website",
};
export default function ContactPage() {
  return (
    <div>
      <ContactUs />
    </div>
  );
}
