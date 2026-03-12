export interface MenuItem {
  label: string;
  href: string;
  icon: string;
  subitems?: MenuItem[];
}
