// src/app/Dashboard/components/Sidebar.tsx
"use client";

import {
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navItems = [
    { name: "داشبورد", href: "/", icon: HomeIcon },
    { name: "سوالات پر تکرار", href: "/faq", icon: QuestionMarkCircleIcon },
    { name: "پشتیبان", href: "/support", icon: UserGroupIcon },
    { name: "ارسال تیکت", href: "/ticket", icon: PaperAirplaneIcon },
  ];
  // وضعیت جدید برای نگهداری اینکه آیا صفحه نمایش به اندازه lg رسیده است یا خیر
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // useEffect برای بررسی اندازه صفحه نمایش در سمت کلاینت
  useEffect(() => {
    // تابع برای بررسی breakpoint lg در Tailwind CSS
    // breakpoint 'lg' به طور پیش‌فرض 1024px است.
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // بررسی اولیه هنگام mount شدن کامپوننت
    checkScreenSize();

    // اضافه کردن event listener برای تغییر اندازه صفحه
    window.addEventListener('resize', checkScreenSize);

    // پاکسازی event listener هنگام unmount شدن کامپوننت
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // فقط یک بار در mount اجرا شود


  return (
    <aside
      className={`
        fixed inset-y-0  ${isLargeScreen ? 'right-4' : 'right-0'} p-4 transition-transform duration-300 ease-in-out z-40
        bg-[#6050DC] lg:bg-[#6050DC] lg:shadow-neumorphic-dark
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0
        lg:rounded-3xl lg:h-[calc(100vh-4rem)] lg:my-8
        lg:flex lg:flex-col lg:justify-start lg:items-center
        text-white transform
        w-full max-w-[280px]
        sm:w-64
        lg:w-64
      `}
    >
      {/* لوگو و نام برند */}
      <div className="flex items-center justify-start mb-10 w-full px-4 pt-4 pb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold text-white">
          <Image
            src="/senik.png"
            alt="senik"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
      </div>

      {/* بخش اصلی ناوبری */}
      <nav className="w-full flex-grow overflow-y-auto custom-scrollbar">
        <ul className="flex flex-col items-start w-full">
          {navItems.map((item, index) => (
            <li key={item.name + index} className="mb-2 w-full">
              <Link href={item.href} passHref>
                <span
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer text-lg font-medium
                    ${
                      index === 0
                        ? "bg-opacity-20 bg-white text-white shadow-neumorphic-item-active"
                        : "text-gray-200 hover:bg-opacity-10 hover:bg-white hover:text-white shadow-neumorphic-item"
                    }
                    mr-4 ml-4`}
                >
                  <item.icon className="h-6 w-6 ml-3" />
                  <span>{item.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}