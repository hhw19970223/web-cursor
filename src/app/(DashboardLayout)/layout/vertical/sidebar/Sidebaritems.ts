export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "HOME",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/",
      },
      {
        name: "API",
        icon: "solar:tag-price-linear",
        id: uniqueId(),
        url: "/ui/api",
      },
      {
        name: "DOCS",
        icon: "solar:documents-broken",
        id: uniqueId(),
        url: "/ui/docs",
      },
    ],
  },
];

export default SidebarContent;
