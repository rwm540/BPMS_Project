import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "خانه",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "درباره ی ما",
    path: "/about",
    newTab: false,
  },
  {
    id: 33,
    title: "آموزش ها",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "پشتیبانی",
    path: "/contact",
    newTab: false,
  },
  {
    id: 4,
    title: "خدمات سه نیک",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "خدمات 1",
        path: "/about",
        newTab: false,
      },
      {
        id: 42,
        title: "خدمات 2",
        path: "/contact",
        newTab: false,
      }
    ],
  },
];
export default menuData;
