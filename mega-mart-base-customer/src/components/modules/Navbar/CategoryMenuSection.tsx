import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

type SectionItem = {
  label: string;
  link?: string;
};

type Props = {
  title?: string;
  items?: SectionItem[];
  link?: string;
};

const CategoryMenuSection = ({ title, items,link }: Props) => {
  console.log({ title, items, link });

  return (
    <div className="break-inside-avoid mb-4">
      <NavigationMenuLink asChild>
      <Link href={`/category/${link}`} className="">
        {' '}
        <h4 className="font-semibold mb-2">{title}</h4>
      </Link>
       </NavigationMenuLink>

      {items && (
        <ul className="space-y-0 text-sm whitespace-nowrap">
          {items.map(({ label, link }, idx) => (
            <li key={`${label || 'item'}-${idx}`}>
              <NavigationMenuLink asChild>
                {link ? (
                  <Link
                    href={`/category/${link}`}
                    className="hover:text-black transition-colors"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className=" cursor-not-allowed">{label}</span>
                )}
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryMenuSection;
