"use client";

import { Bars3Icon, BellIcon, UserCircleIcon, MagnifyingGlassIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success';
  timeAgo: string;
}

export default function Header({ title, onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const notifications: Notification[] = [
    { id: 1, message: "تیکت شماره 1234 نیازمند بررسی است.", type: 'warning', timeAgo: "10 دقیقه پیش" },
    { id: 2, message: "فایل جدیدی آپلود شد.", type: 'info', timeAgo: "1 ساعت پیش" },
    { id: 3, message: "سیستم به روزرسانی شد.", type: 'success', timeAgo: "دیروز" },
    { id: 4, message: "یک پیام جدید دریافت کردید.", type: 'info', timeAgo: "2 دقیقه پیش" },
    { id: 5, message: "سفارش جدید ثبت شد.", type: 'success', timeAgo: "5 دقیقه پیش" },
  ];

  const unreadNotificationsCount = notifications.length;

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 ml-2 flex-shrink-0" />;
      case 'success':
        return <InformationCircleIcon className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const NotificationDropdown = () => (
    <div className="relative">
      <button
        ref={bellButtonRef}
        onClick={toggleNotifications}
        className="p-3 rounded-xl bg-gray-100 text-gray-700 shadow-neumorphic-button hover:shadow-neumorphic-button-hover transition-all duration-200 relative"
        aria-label="اعلان ها"
      >
        <BellIcon className="h-6 w-6" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-100">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {isNotificationsOpen && (
        <div
          ref={notificationsRef}
          className="absolute top-full mt-4
                     left-0 -translate-x-1/4
                     w-64
                     max-w-[90vw]
                     sm:w-72
                     lg:w-72 lg:max-w-none
                     bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-20
                     transition-all origin-top animate-slide-down"
        >
          {unreadNotificationsCount > 0 ? (
            <>
              <div className="px-4 py-3 bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                اعلان‌ها ({unreadNotificationsCount} جدید)
              </div>
              <div className="py-1 max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-200">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  مشاهده همه اعلان‌ها
                </a>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              اعلان جدیدی وجود ندارد.
            </div>
          )}
        </div>
      )}
    </div>
  );


  return (
    <>
      {/* هدر موبایل (نمایش در صفحات کوچک) */}
      <header className="flex justify-between items-center mb-6 lg:hidden bg-gray-100 p-4 rounded-xl shadow-neumorphic">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-gray-100 text-gray-700 shadow-neumorphic-button hover:shadow-neumorphic-button-hover transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* هدر برای دسکتاپ (مخفی در صفحات کوچک) */}
      <header className="hidden lg:flex justify-between items-center mb-8 bg-gray-100 p-6 rounded-3xl shadow-neumorphic">
        <h1 className="text-3xl font-extrabold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-6">
          {/* باکس جستجو */}
          <div className="relative mx-10">
            <input
              type="text"
              placeholder="جستجو..."
              className="py-2 px-4 pr-10 rounded-xl bg-gray-100 shadow-neumorphic-input text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <NotificationDropdown />

          {/* دکمه پروفایل */}
          <button className="p-3 rounded-xl bg-gray-100 shadow-neumorphic-button hover:shadow-neumorphic-button-hover transition-all duration-200 text-gray-700 flex items-center">
            <UserCircleIcon className="h-6 w-6 ml-2" />
            <span className="font-semibold">پروفایل</span>
          </button>
        </div>
      </header>
    </>
  );
}