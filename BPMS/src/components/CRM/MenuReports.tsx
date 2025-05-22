"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface ReportItem {
  customerID: string;
  customerName: string;
  contractCode: string;
  date: string;
  phone: string;
  status: string;
}

const dummyReports: ReportItem[] = [
  {
    customerID: "CUST-123456",
    customerName: "علی احمدی",
    contractCode: "CNT-458721",
    date: "1402/12/10",
    phone: "09121234567",
    status: "فعال"
  },
  {
    customerID: "CUST-789012",
    customerName: "سارا حسینی",
    contractCode: "CNT-998877",
    date: "1403/01/02",
    phone: "09351234567",
    status: "غیرفعال"
  },
  {
    customerID: "CUST-345678",
    customerName: "رضا کریمی",
    contractCode: "CNT-345678",
    date: "1402/11/25",
    phone: "09105554433",
    status: "مسدود شده"
  }
];

export default function Reports() {
  const [searchName, setSearchName] = useState("");
  const [searchContract, setSearchContract] = useState("");
  const [searchDate, setSearchDate] = useState<any>(null);
  const [filtered, setFiltered] = useState(dummyReports);

  useEffect(() => {
    const name = searchName.trim();
    const contract = searchContract.trim();
    const date = searchDate?.format?.("YYYY/MM/DD") ?? "";

    const result = dummyReports.filter((item) => {
      const matchesName = item.customerName.includes(name);
      const matchesContract = item.contractCode.includes(contract);
      const matchesDate = !date || item.date === date;
      return matchesName && matchesContract && matchesDate;
    });

    setFiltered(result);
  }, [searchName, searchContract, searchDate]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-black mb-4">📊 گزارشات مشتریان</h2>

      {/* فیلترها */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام مشتری"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-black text-sm focus:ring-2 focus:ring-teal-500"
        />

        <input
          type="text"
          placeholder="جستجو بر اساس کد قرارداد"
          value={searchContract}
          onChange={(e) => setSearchContract(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-black text-sm focus:ring-2 focus:ring-teal-500"
        />

        <DatePicker
          value={searchDate}
          onChange={setSearchDate}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          inputClass="w-full px-4 py-2 border rounded-lg text-black text-sm focus:ring-2 focus:ring-teal-500"
          placeholder="فیلتر بر اساس تاریخ"
        />
      </div>

      {/* جدول گزارش */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-black text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-right">
            <tr>
              <th className="border px-4 py-2">کد مشتری</th>
              <th className="border px-4 py-2">نام مشتری</th>
              <th className="border px-4 py-2">کد قرارداد</th>
              <th className="border px-4 py-2">تاریخ</th>
              <th className="border px-4 py-2">تلفن</th>
              <th className="border px-4 py-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  هیچ نتیجه‌ای یافت نشد.
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr
                  key={index}
                  className={`text-right transition ${
                    item.status === "فعال"
                      ? "bg-green-50 hover:bg-green-100"
                      : item.status === "غیرفعال"
                      ? "bg-yellow-50 hover:bg-yellow-100"
                      : "bg-red-50 hover:bg-red-100"
                  }`}
                >
                  <td className="border px-4 py-2">{item.customerID}</td>
                  <td className="border px-4 py-2">{item.customerName}</td>
                  <td className="border px-4 py-2">{item.contractCode}</td>
                  <td className="border px-4 py-2">{item.date}</td>
                  <td className="border px-4 py-2">{item.phone}</td>
                  <td className="border px-4 py-2 font-bold">{item.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
