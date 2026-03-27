export type SectionItem = {
  label: string;
  link?: string;
};
export type Section = {
  title?: string;
  link?: string;
  items?: SectionItem[];
};

export type MegaMenuItems = {
  Others?: Section[];
};

export const megaMenuItems: MegaMenuItems = {
  Others: [
    {
      items: [
        {
          label: 'all product brand',
          link: '/all-product-brand',
        },
        {
          label: 'contact us',
          link: '/contact-us',
        },
        {
          label: 'home lunch',
          link: '/home-lunch',
        },
        {
          label: 'product collection',
          link: '/product-collection',
        },
        {
          label: 'product details',
          link: '/product-details',
        },
        {
          label: 'product listing',
          link: '/product-listing',
        },
        {
          label: 'terms conditions',
          link: '/terms-conditions',
        },
      ],
    },
  ],
};
