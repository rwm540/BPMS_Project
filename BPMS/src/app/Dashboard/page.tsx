// src/app/Dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ChartSection from './components/ChartSection';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex rtl">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* اوورلی برای سایدبار در موبایل */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* محتوای اصلی */}
      {/* lg:mr-64 برای ایجاد فضای سمت راست سایدبار */}
      <div className="flex-1 lg:mr-64 p-4 sm:p-6 md:p-8">
        {/* هدر داشبورد */}
        <Header
          title="داشبورد"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        {/* بخش کارت‌های آمار */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="تیکت های من"
            value="75"
            change="+۵ از دیروز"
            changeType="increase"
            color="blue"
          />
          <StatCard
            title="زمان باقی بامانده برای پشتیبان"
            // value="حداقل زمان رسیدی  به مشکلات"
            value="7"
            change="دقیقه تا پاسخ"
            changeType="increase"
            color="blue"
          />
          <StatCard
            title="وضعیت کابری"
            value=""
            change="فعال"
            changeType="increase"
            color="blue"
          />
        </section>
        {/* بخش نمودار فعالیت */}
        <ChartSection title="نمودار فعالیت هفتگی" />
      </div>
    </div>
  );
}