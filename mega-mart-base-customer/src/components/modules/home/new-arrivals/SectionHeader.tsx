"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  tabs?: { value: string; label: string }[];
  value?: string;
  onValueChange?: (v: string) => void;
  action?: React.ReactNode;
  viewAllLinkState?: boolean;
};

const SectionHeader = ({
  title,
  tabs,
  value,
  onValueChange,
  action,
  viewAllLinkState = false,
}: Props) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      {/* Title */}
      <h2 className="font-semibold md:text-2xl lg:text-2xl">
        {title}
      </h2>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {tabs && (
          <div>
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <Tabs value={value} onValueChange={onValueChange}>
                <TabsList className="flex gap-4 rounded-full bg-transparent">
                  {tabs.slice(0, 3).map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="rounded-full font-medium text-xs md:text-base xl:text-sm
                        px-3 xl:px-5 py-2
                        bg-[#F3F4F6]
                        data-[state=active]:bg-black data-[state=active]:text-white"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Dropdown */}
            <div className="block sm:hidden">
              <select
                className="border border-gray-300 rounded-md p-1"
                value={value}
                onChange={(e) =>
                  onValueChange && onValueChange(e.target.value)
                }
              >
                {tabs.slice(0, 3).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {action}

        {/* View All Button */}
        {viewAllLinkState && (
          <div className="rounded-full hidden lg:block font-medium text-xs md:text-base xl:text-sm
            px-3 xl:px-5 py-2
              bg-[#F3F4F6] hover:bg-black
            transition group cursor-pointer">
            <Link href="/product-collection">
              <span className="
                bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                bg-clip-text text-transparent
                group-hover:text-white
                transition-all duration-300
              ">
                View All
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
