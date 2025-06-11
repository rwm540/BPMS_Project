"use client";
// src/app/Dashboard/components/ChartSection.tsx

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartSectionProps {
    title: string;
}

export default function ChartSection({ title }: ChartSectionProps) {
    // مثال داده‌های نمودار (در واقعیت باید از API یا Redux بیاد)
    const chartData = {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
        datasets: [
            {
                label: 'بازدیدها',
                data: [65, 59, 80, 81, 56, 55, 100],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
                text: title,
            },
        },
        maintainAspectRatio: false, // برای کنترل بهتر ارتفاع
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-600">{title}</h3>
            {/*
              تغییرات برای ریسپانسیو کردن و کنترل بهتر اندازه:
              1. `min-h-[250px]` از div داخلی به div بیرونی (که aspect ratio را کنترل می‌کند) منتقل شد.
                 این تضمین می‌کند که div بیرونی حداقل ارتفاع 250px را داشته باشد و chartjs در این فضای موجود،
                 همچنان سعی کند responsive باشد و maintainAspectRatio: false را رعایت کند.
              2. flexbox utilities (`items-center justify-center`) از div داخلی حذف شدند زیرا
                 chart.js خودش محتوای canvas را در مرکز قرار می‌دهد و این کلاس‌ها ممکن بود
                 باعث عدم تطابق در ارتفاع شوند.
            */}
            <div className="relative w-full border border-dashed border-gray-300 rounded-md"
                 style={{ paddingBottom: '56.25%', minHeight: '250px' /* نسبت ابعاد 16:9 و حداقل ارتفاع */ }}>
                <div className="absolute top-0 left-0 w-full h-full">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </section>
    );
}