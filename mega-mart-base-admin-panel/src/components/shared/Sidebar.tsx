/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tag,
  CreditCard,
  Plus,
  Shield,
  X,
  Store,
  ArrowRightLeft,
  Package,
  BarChart3,
  Hash,
  Palette,
  Calculator,
  Truck,
  HelpCircle,
  FileText,
  UserPlus,
  User,
  Percent,
  Settings,
  ChevronRight,
  ShoppingBag,
  Box,
  UsbIcon,
  Check,
  LucideIcon,
  Wallet,
  Receipt,
  BadgePercent,
  Layers,
  Globe,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  BookOpen,
  Gavel,
  Cpu,
  Star,
  LogOut,
} from "lucide-react";
import { MdPayment, MdSettings } from "react-icons/md";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useGetSettingsQuery } from "@/redux/featured/setting/settingAPI";

type Role = "admin" | "vendor" | "user";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

function normalizeRole(value: unknown): Role {
  if (!value || typeof value !== "string") return "user";
  const v = value.toLowerCase();
  if (["admin", "superadmin", "owner", "root"].includes(v)) return "admin";
  if (["vendor", "seller", "merchant", "shop_owner"].includes(v)) return "vendor";
  return "user";
}

interface NavItem {
  icon: LucideIcon | any;
  label: string;
  href: string;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
  collapsible?: boolean;
  sectionKey?: string;
  icon?: LucideIcon;
}

// ─── Tooltip for collapsed mode ────────────────────────────────────────────
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute left-full ml-3 z-[200] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl pointer-events-none">
          {label}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </span>
      )}
    </span>
  );
}

export function AppSidebar({
  isOpen,
  onClose,
  role: roleProp,
  isCollapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const derivedRole = normalizeRole((currentUser as any)?.role);
  const role: Role = roleProp ?? derivedRole;

  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const [openSection, setOpenSection] = useState<string | null>(null);
  const { data: settings } = useGetSettingsQuery();
  const site: any = settings?.[0];

  // Auto-open section if child is active
  useEffect(() => {
    // We'll let individual sections detect this
  }, [pathname]);

  // ── Navigation data ──────────────────────────────────────────────────────
  const nav = useMemo(() => ({
    shopManagement: [
      { icon: Store, label: "All Shops", href: "/admin/all-shop" },
      { icon: Plus, label: "Add New Shop", href: "/admin/create-shop" },
      { icon: Bell, label: "Inactive Shops", href: "/admin/in-active-new-shops", badge: "3" },
    ],
    shopVendor: [
      { icon: Plus, label: "Add New Shop", href: "/vendor/create-shop" },
      { icon: Store, label: "My Shops", href: "/vendor/my-shops" },
    ],
    productManagement: [
      { icon: Package, label: "All Products", href: "/admin/all-product" },
      { icon: Plus, label: "Add New Product", href: "/admin/add-new-product" },
      { icon: FileText, label: "Draft Products", href: "/admin/draft-products" },
    ],
    productVendor: [
      { icon: Package, label: "All Products", href: "/vendor/all-product" },
      { icon: Plus, label: "Add New Product", href: "/vendor/add-new-product" },
    ],
    walletItems: [
      { icon: Check, label: "Approved Deposits", href: "/admin/approved-deposits" },
      { icon: X, label: "Reject Deposits", href: "/admin/reject-deposits" },
      { icon: Receipt, label: "Refund Requests", href: "/admin/refund-requests" },
    ],
    faqItems: [
      { icon: BookOpen, label: "All FAQs", href: "/admin/faqs" },
      { icon: Plus, label: "Add New FAQ", href: "/admin/add-new-faq" },
    ],
    termsItems: [
      { icon: Gavel, label: "All Terms", href: "/admin/all-terms" },
      { icon: Plus, label: "Add New Terms", href: "/admin/terms" },
    ],
    couponsItems: [
      { icon: BadgePercent, label: "All Coupons", href: "/admin/coupons" },
      { icon: Plus, label: "Add Coupon", href: "/admin/coupons/add-new-coupons" },
    ],
    settingsItems: [
      { icon: Settings, label: "General Settings", href: "/admin/shop-setting" },
      { icon: MdPayment as any, label: "Payment Settings", href: "/admin/payment-settings" },
      { icon: Globe, label: "SEO Settings", href: "/admin/SEOPage" },
      { icon: HelpCircle, label: "System FAQ", href: "/admin/faqs" },
    ],
    vendorItems: [
      { icon: Store, label: "Vendors", href: "/admin/all-vendors" },
      { icon: User, label: "Customers", href: "/admin/customers" },
    ],
    ecommerceManagement: [
      { icon: Calculator, label: "Taxes", href: "/admin/taxes" },
      { icon: Truck, label: "Shippings", href: "/admin/shippings" },
      { icon: CreditCard, label: "Withdrawals", href: "/admin/withdrawals" },
      { icon: UsbIcon, label: "Hero Banners", href: "/admin/banners" },
    ],
    orderManagement: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/order" },
      { icon: Shield, label: "Fraud Checker", href: "/admin/fraud-check" },
      { icon: Plus, label: "Create Order", href: "/admin/create-order" },
      { icon: ArrowRightLeft, label: "Transactions", href: "/admin/transaction" },
    ],
    orderVendor: [
      { icon: ShoppingCart, label: "Orders", href: "/vendor/order" },
    ],
    ecommerceManagementVendor: [
      { icon: CreditCard, label: "Withdrawals", href: "/vendor/withdrawals" },
    ],
    vendorCoupons: [
      { icon: BadgePercent, label: "All Coupons", href: "/vendor/coupons" },
      { icon: Plus, label: "Add Coupon", href: "/vendor/coupons/add-new-coupons" },
    ],
  }), []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const hasActiveChild = (items: NavItem[]) =>
    items.some((i) => isActive(i.href));

  // ── Render: single link ──────────────────────────────────────────────────
  const renderLink = (href: string, Icon: LucideIcon | any, label: string, badge?: string | number) => {
    const active = isActive(href);
    const linkEl = (
      <Link
        href={href}
        key={`link-${href}`}
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) onClose();
        }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
          isCollapsed ? "justify-center p-2.5 mx-1" : "px-3 py-2.5",
          active
            ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
        )}
      >
        {/* Active left bar */}
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-indigo-500" />
        )}
        <Icon
          size={17}
          className={cn(
            "flex-shrink-0 transition-colors",
            active ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600",
          )}
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge && (
              <span className="ml-auto rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                {badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return <Tooltip key={`tt-${href}`} label={label}>{linkEl}</Tooltip>;
    }
    return linkEl;
  };

  // ── Render: collapsible group ────────────────────────────────────────────
  const renderCollapsible = (
    Icon: LucideIcon | any,
    label: string,
    items: NavItem[],
    sectionKey: string,
  ) => {
    const childActive = hasActiveChild(items);
    const isExpanded = openSection === sectionKey || (childActive && openSection === null);

    const trigger = (
      <button
        onClick={() => setOpenSection(isExpanded ? null : sectionKey)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isCollapsed ? "justify-center p-2.5 mx-1 w-auto" : "",
          childActive
            ? "text-indigo-600"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
        )}
      >
        <Icon
          size={17}
          className={cn(
            "flex-shrink-0 transition-colors",
            childActive ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600",
          )}
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            <ChevronRight
              size={14}
              className={cn(
                "flex-shrink-0 text-slate-400 transition-transform duration-200",
                isExpanded ? "rotate-90 text-indigo-500" : "",
              )}
            />
          </>
        )}
      </button>
    );

    return (
      <div key={`collapsible-${sectionKey}`}>
        {isCollapsed ? (
          <Tooltip label={label}>{trigger}</Tooltip>
        ) : trigger}

        {!isCollapsed && isExpanded && (
          <div className="mt-0.5 ml-3 space-y-0.5 border-l-2 border-indigo-100 pl-3">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={`${sectionKey}-${item.href}`}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                    active
                      ? "bg-indigo-50 font-medium text-indigo-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                  )}
                >
                  <item.icon size={15} className={cn("flex-shrink-0", active ? "text-indigo-500" : "text-slate-400")} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Render: section header + flat items ─────────────────────────────────
  const renderSection = (title: string, items: NavItem[]) => (
    <div key={`section-${title}`} className="space-y-0.5">
      {!isCollapsed && (
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
      )}
      {isCollapsed && <div className="my-1 mx-2 h-px bg-slate-100" />}
      {items.map((item) => renderLink(item.href, item.icon, item.label, item.badge))}
    </div>
  );

  // ── Section divider label ────────────────────────────────────────────────
  const sectionLabel = (title: string) =>
    !isCollapsed ? (
      <p className="mb-1 mt-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {title}
      </p>
    ) : (
      <div className="my-2 mx-2 h-px bg-slate-100" />
    );

  // ── User info strip ──────────────────────────────────────────────────────
  const userName = (currentUser as any)?.name ?? "User";
  const userEmail = (currentUser as any)?.email ?? "";
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50  h-screen flex flex-col",
          "bg-white border-r border-slate-100 shadow-xl shadow-slate-200/60",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static",
          isCollapsed ? "w-[84px]" : "w-[260px]",
        )}
      >
        {/* ── Logo area ── */}
        <div
          className={cn(
            "relative flex h-16 items-center shrink-0 border-b border-slate-100",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 flex-shrink-0 rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center shadow-sm">
              <Image
                src={site?.siteLogo ?? "/logo.png"}
                alt="logo"
                fill
                className="object-contain p-1"
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {site?.siteName ?? "Dashboard"}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">{role} panel</p>
              </div>
            )}
          </div>

          {/* Collapse toggle — desktop only */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={cn(
                "hidden md:flex absolute items-center justify-center rounded-full",
                "h-5 w-5 bg-white border border-slate-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all",
                isCollapsed ? "right-[-10px] top-5" : "right-[-10px] top-5",
              )}
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={11} className="text-slate-500" />
              ) : (
                <PanelLeftClose size={11} className="text-slate-500" />
              )}
            </button>
          )}
        </div>

        {/* ── Mobile close bar ── */}
        {isOpen && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 md:hidden">
            <span className="text-sm font-semibold text-slate-700">Navigation</span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        )}

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

          {/* Dashboard — always visible */}
          {sectionLabel("Main")}
          {renderLink("/", LayoutDashboard, "Dashboard")}

          {/* ── ADMIN ── */}
          {role === "admin" && (
            <>
              {/* Shop */}
              {sectionLabel("Shop Management")}
              {renderCollapsible(Store, "Shops", nav.shopManagement, "shopManagement")}
              {renderLink("/admin/my-shops", ShoppingBag, "My Shops")}
              {renderLink("/admin/shop-transfer-request", ArrowRightLeft, "Transfer Requests")}

              {/* Products */}
              {sectionLabel("Products")}
              {renderCollapsible(Package, "Products", nav.productManagement, "productManagement")}
              {renderLink("/admin/category-management", Hash, "Categories")}
              {renderLink("/admin/subcategory-management", Layers, "Sub Categories")}
              {renderLink("/admin/tag-management", Tag, "Tags")}
              {renderLink("/admin/brand-management", Star, "Brands")}
              {renderLink("/admin/product-attributes", Palette, "Attributes")}
              {renderLink("/admin/inventory-management", BarChart3, "Inventory")}

              {/* Ecommerce */}
              {sectionLabel("E-Commerce")}
              {renderLink("/admin/taxes", Calculator, "Taxes")}
              {renderLink("/admin/shippings", Truck, "Shipping")}
              {renderLink("/admin/withdrawals", CreditCard, "Withdrawals")}
              {renderLink("/admin/banners", UsbIcon, "Hero Banners")}

              {/* Wallet */}
              {sectionLabel("Wallet")}
              {renderCollapsible(Wallet, "Wallet", nav.walletItems, "walletItems")}

              {/* Orders */}
              {sectionLabel("Orders")}
              {renderLink("/admin/order", ShoppingCart, "All Orders")}
              {renderLink("/admin/fraud-check", Shield, "Fraud Checker")}
              {renderLink("/admin/create-order", Plus, "Create Order")}
              {renderLink("/admin/transaction", ArrowRightLeft, "Transactions")}

              {/* Layout / Pages */}
              {sectionLabel("Layout / Pages")}
              {renderCollapsible(HelpCircle, "FAQs", nav.faqItems, "faqItems")}
              {renderCollapsible(Gavel, "Terms", nav.termsItems, "termsItems")}
              {renderLink("/admin/become-seller", UserPlus, "Become a Seller")}

              {/* Users */}
              {sectionLabel("User Control")}
              {renderLink("/admin/all-users", Users, "All Users")}
              {renderLink("/admin/admin-list", Shield, "Admin List")}
              {renderCollapsible(Store, "Vendors & Customers", nav.vendorItems, "vendorItems")}

              {/* Coupons */}
              {sectionLabel("Coupons")}
              {renderCollapsible(BadgePercent, "Coupons", nav.couponsItems, "couponsItems")}

              {/* Settings */}
              {sectionLabel("Settings")}
              {renderCollapsible(Settings, "Settings", nav.settingsItems, "settingsItems")}
            </>
          )}

          {/* ── VENDOR ── */}
          {role === "vendor" && (
            <>
              {sectionLabel("Shop")}
              {renderCollapsible(Store, "My Shops", nav.shopVendor, "shopManagement")}

              {sectionLabel("Products")}
              {renderCollapsible(Package, "Products", nav.productVendor, "productManagement")}

              {sectionLabel("Orders")}
              {renderLink("/vendor/order", ShoppingCart, "Orders")}

              {sectionLabel("E-Commerce")}
              {renderLink("/vendor/withdrawals", CreditCard, "Withdrawals")}

              {sectionLabel("Coupons")}
              {renderCollapsible(BadgePercent, "Coupons", nav.vendorCoupons, "couponsItems")}
            </>
          )}

          {/* ── USER ── */}
          {role === "user" && (
            <>
              {sectionLabel("Orders")}
              {renderLink("/account/orders", ShoppingCart, "My Orders")}
              {sectionLabel("Account")}
              {renderLink("/account/profile", User, "Profile")}
              {renderLink("/account/settings", Settings, "Settings")}
            </>
          )}
        </nav>

        {/* ── User footer strip ── */}
        <div
          className={cn(
            "shrink-0 border-t border-slate-100 p-2",
            isCollapsed ? "flex flex-col items-center gap-2 py-3" : "flex items-center gap-3 px-3 py-2.5",
          )}
        >
          <div className="relative h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {avatarLetter}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-slate-700">{userName}</p>
              <p className="truncate text-[10px] text-slate-400">{userEmail}</p>
            </div>
          )}
          {!isCollapsed && (
            <button className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;