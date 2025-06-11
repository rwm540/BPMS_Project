"use client";

// src/app/Dashboard/components/StatCard.tsx
interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease' | 'neutral'; // نوع تغییر برای رنگ
    color: 'indigo' | 'green' | 'red' | 'blue'; // رنگ اصلی کارت
}

export default function StatCard({ title, value, change, changeType, color }: StatCardProps) {
    const changeColorClass =
        changeType === 'increase'
            ? 'text-green-500'
            : changeType === 'decrease'
            ? 'text-red-500'
            : 'text-gray-500';

    const textColorClass = `text-${color}-500`; // برای عنوان کارت

    return (
        // The classes below inherently make the card responsive based on its container.
        // The main point for responsiveness of StatCard lies in the parent component's layout.
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-transparent hover:border-t-indigo-500">
            <h3 className={`text-xl font-semibold mb-2 ${textColorClass}`}>{title}</h3>
            <p className="text-4xl font-bold mb-1">{value}</p>
            <p className={`text-sm ${changeColorClass}`}>{change}</p>
        </div>
    );
}