import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-black mb-1">MEGA</h2>
                            <div className="text-sm tracking-widest text-gray-600 mb-4">B A Z A R</div>
                            <p className="text-sm text-gray-600 mb-6">
                                Connect with our social Media Platform
                            </p>

                            {/* Social Media Icons */}
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Facebook className="w-4 h-4 text-white" />
                                </div>
                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                    <Instagram className="w-4 h-4 text-white" />
                                </div>
                                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                                    <Linkedin className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* App Store Buttons */}
                            <div className="flex gap-3">
                                <Image
                                    src="/app-store-download-button.png"
                                    alt="Download on App Store"
                                    width={120}
                                    height={40}
                                    className="rounded"
                                />
                                <Image
                                    src="/get-it-on-google-play-button.png"
                                    alt="Get it on Google Play"
                                    width={120}
                                    height={40}
                                    className="rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div>
                        <h3 className="font-semibold text-black mb-4">About</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Search</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Shop</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="font-semibold text-black mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                            <li><a href="mailto:example@email.com" className="hover:text-black transition-colors">example@email.com</a></li>
                            <li><a href="tel:+12545685479" className="hover:text-black transition-colors">Call us: +1 254 568-5479</a></li>
                            <li><a href="mailto:yourexample@email.com" className="hover:text-black transition-colors">yourexample@email.com</a></li>
                        </ul>
                    </div>

                    {/* Shop Section */}
                    <div>
                        <h3 className="font-semibold text-black mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black transition-colors">Product Single</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Women</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Return & Exchange</a></li>
                        </ul>
                    </div>

                    {/* Our Information Section */}
                    <div>
                        <h3 className="font-semibold text-black mb-4">Our Information</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-black transition-colors">Privacy Policy Update</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Single Post</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Sports</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        All right reserved - Design & Developed by RedQ
                    </p>
                </div>
            </div>
        </footer>
    );
}
