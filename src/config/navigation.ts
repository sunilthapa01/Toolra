export interface NavigationItem {
  title: string;
  href: string;
  implemented: boolean;
  isAction?: 'contact';
}

export interface NavigationSection {
  title: string;
  links: NavigationItem[];
}

export const NAVBAR_ITEMS: NavigationItem[] = [
  { title: 'Home', href: '/', implemented: true },
  { title: 'Calculators', href: '/#finance', implemented: true },
  { title: 'Developer Tools', href: '/#developer', implemented: true },
  { title: 'Business Suite', href: '/#business', implemented: false },
  { title: 'PDF Tools', href: '/#pdf', implemented: true },
  { title: 'AI Tools', href: '/#ai-tools', implemented: false },
  { title: 'Roadmap', href: '/#roadmap', implemented: false },
  { title: 'Contact', href: '#', implemented: true, isAction: 'contact' },
];

export const FOOTER_SECTIONS: NavigationSection[] = [
  {
    title: 'Tools',
    links: [
      { title: 'GST Calculator', href: '/tools/gst-calculator', implemented: true },
      { title: 'EMI Calculator', href: '/tools/emi-calculator', implemented: true },
      { title: 'SIP Calculator', href: '/tools/sip-calculator', implemented: true },
      { title: 'Reverse GST', href: '/tools/reverse-gst-calculator', implemented: true },
      { title: 'PDF Merger', href: '/tools/pdf-merge-combine', implemented: true },
      { title: 'PDF Splitter', href: '/tools/pdf-split', implemented: true },
    ],
  },
  {
    title: 'Categories',
    links: [
      { title: 'Finance Tools', href: '/#finance', implemented: true },
      { title: 'PDF Tools', href: '/#pdf', implemented: true },
      { title: 'Developer Tools', href: '/#developer', implemented: true },
      { title: 'Text Tools', href: '/#text', implemented: true },
      { title: 'Business Tools', href: '/#business', implemented: false },
    ],
  },
  {
    title: 'Company & Resources',
    links: [
      { title: 'About Toolora', href: '/about', implemented: true },
      { title: 'Privacy Policy', href: '/privacy', implemented: true },
      { title: 'Terms of Service', href: '/terms', implemented: true },
      { title: 'Contact Us', href: '#', implemented: true, isAction: 'contact' },
      { title: 'GitHub', href: 'https://github.com', implemented: true },
      { title: 'Status', href: '#', implemented: true },
    ],
  },
];
