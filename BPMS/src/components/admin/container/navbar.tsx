import { useState, useEffect, type FC } from "react";
import Drawer from "./drawer";
import { setDir } from "src/util";

import {
  FaGraduationCap,
  FaIdBadge,
  FaBriefcase
} from "react-icons/fa6";

interface navbarProps {
  logout:()=>void;
}

const Navbar: FC<navbarProps> = ({logout}:navbarProps) => {
  const [checkTheme, setCheckTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // اینجا کدی می‌نویسی که فقط یه بار باید اجرا شه
    setCheckTheme("light");
    setDir("rtl");
    document.documentElement.classList.toggle("dark", checkTheme === "dark");
    document.documentElement.setAttribute("data-theme", checkTheme);
  }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <span className="block lg:hidden">
          <Drawer />
        </span>
        <a className="">
        {/* <img src="./senik.png" className="w-[40px] h-[40px]"/> */}
        </a>
      </div>
      <div className="flex-none gap-2">
        {/* <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-primary m-1 text-white">
            Lang
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-24"
          >
            <li>
              <a onClick={() => setDir("ltr")}>English</a>
            </li>
            <li>
              <a onClick={() => setDir("rtl")}>Persian</a>
            </li>
          </ul>
        </div>  */}

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="m-1 text-black"
          >
           <FaGraduationCap className="text-3xl text-indigo-600 drop-shadow-md hover:text-indigo-800 transition duration-300" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-[160px]"
          >
            <li>
              <a className="block w-[150px] text-center py-2 px-4">منابع</a>
            </li>
            <li>
              <a className="block w-[150px] text-center py-2 px-4">آموزش </a>
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="m-1 text-black"
          >
           < FaBriefcase className="text-2xl text-amber-600 hover:text-amber-800 transition duration-300" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-[160px]"
          >
            <li>
              <a className="block w-[150px] text-center py-2 px-4">
                مدیریت منابع انسانی
              </a>
            </li>
            <li>
              <a className="block w-[150px] text-center py-2 px-4">
                مدیریت پروژه
              </a>
            </li>
            <li>
              <a className="block w-[150px] text-center py-2 px-4">
                مدیریت مالی
              </a>
            </li>
            <li>
              <a className="block w-[150px] text-center py-2 px-4">
                مدیریت اداری
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="m-1 text-black"
          >
            <FaIdBadge className="text-2xl text-emerald-600 hover:text-emerald-800 transition duration-300" />
          </div>
          {/* <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 text-base-content rounded-box w-[160px]">
            <li>
              <a className="block w-[150px] text-center py-2 px-4">مدیریت منابع انسانی</a>
            </li>
          </ul>  */}
        </div>

        {/* 🌗 Toggle Theme */}
        <input
          type="checkbox"
          checked={checkTheme === "dark"}
          onChange={() => {
            const newTheme = checkTheme === "dark" ? "light" : "dark";
            setCheckTheme(newTheme);
            document.documentElement.classList.toggle(
              "dark",
              newTheme === "dark"
            );
            document.documentElement.setAttribute("data-theme", newTheme);
          }}
          className="toggle"
        />

        {/* 👤 Dropdown Avatar */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img src="./senik.png" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${
              checkTheme === "dark" ? "text-white" : "text-black"
            }`}
          >
            <li>
              <a className="justify-between">
                پروفایل
                <span className="badge">جدید</span>
              </a>
            </li>
            <li>
              <a>تنظیمات</a>
            </li>
            <li>
              <a onClick={()=>logout()}>خروج</a>
            </li>
          </ul>
        </div>
      </div>


    </div>
  );
};
export default Navbar;
