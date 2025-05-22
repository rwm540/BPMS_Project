"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

// 🎫 ساخت شناسه یکتا
const generateTicketID = () => {
  return "TK-" + Math.floor(10000000 + Math.random() * 90000000);
};

// 📊 نگاشت اولویت به سطح فارسی
const priorityLevels: Record<number, string> = {
  1: "طلایی",
  2: "نقره‌ای",
  3: "برنزی",
  4: "پلاتینیومی",
  5: "سیاه"
};

// 🎨 نگاشت وضعیت به رنگ استایل
const STATUS_COLORS: Record<string, string> = {
  "در حال انتظار": "bg-yellow-200 text-yellow-800 font-bold",
  "در حال پیگیری": "bg-blue-200 text-blue-800 font-bold",
  "اتمام یافته": "bg-green-200 text-green-800 font-bold",
  ناقص: "bg-orange-200 text-orange-800 font-bold",
  "عدم پاسخ‌دهی": "bg-red-300 text-red-900 font-bold"
};

const TicketDefine = () => {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3); // پیش‌فرض: برنزی
  const [status, setStatus] = useState("در حال انتظار");
  const [customer, setCustomer] = useState("");
  const [assignee, setAssignee] = useState("");
  const [ticketID, setTicketID] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [optionalNote, setOptionalNote] = useState("");

  useEffect(() => {
    setTicketID(generateTicketID());
    setCreatedAt(new Date().toLocaleString("fa-IR"));
  }, []);

  const predefinedDescriptionsGrouped = [
    {
      label: "ارتباط با دستگاه",
      options: [
        { label: "اتصال به دستگاه پوز برقرار نمی‌شود", value: "pos_error" },
        { label: "مشکل در ارتباط با پرینتر", value: "printer_error" },
        { label: "عدم هماهنگی با بارکدخوان", value: "barcode_error" }
      ]
    },
    {
      label: "وب و ویترین",
      options: [
        { label: "خطا در وب ویترین", value: "web_error" },
        { label: "عدم بارگذاری برنامه صندوق آنلاین", value: "pos_app_load" }
      ]
    },
    {
      label: "به‌روزرسانی و نصب",
      options: [
        { label: "مشکل در به‌روزرسانی فروشگاهی", value: "store_update" },
        { label: "برنامه اندروید اجرا نمی‌شود", value: "android_fail" },
        { label: "خطا در نصب اولیه روی فروشگاه", value: "first_install_error" }
      ]
    },
    {
      label: "پشتیبانی و آموزش",
      options: [
        { label: "آموزش گزارشات انبارداری", value: "inventory_training" },
        { label: "آموزش اینترنتی از راه دور", value: "remote_training" },
        { label: "جابجایی سرور و نیاز به تنظیمات مجدد", value: "server_move" }
      ]
    }
  ];

  const handleSave = () => {
    const ticket = {
      id: ticketID,
      description,
      priority,
      status,
      customer,
      assignee,
      createdAt,
      note: optionalNote
    };
    if (editIndex !== null) {
      const updated = [...tickets];
      updated[editIndex] = ticket;
      setTickets(updated);
      setEditIndex(null);
    }
    else {
      setTickets((prev) => [...prev, ticket]);
    }
    alert("✅ تیکت ذخیره شد!");
    resetForm();
  };

  const resetForm = () => {
    setTicketID(generateTicketID());
    setCreatedAt(new Date().toLocaleString("fa-IR"));
    setDescription("");
    setPriority(3);
    setStatus("در حال انتظار");
    setCustomer("");
    setAssignee("");
  };

  const handleDelete = (index: number) => {
    const filtered = tickets.filter((_, i) => i !== index);
    setTickets(filtered);
  };

  const handleEdit = (index: number) => {
    const t = tickets[index];
    setTicketID(t.id);
    setDescription(t.description);
    setPriority(t.priority);
    setStatus(t.status);
    setCustomer(t.customer);
    setAssignee(t.assignee);
    setCreatedAt(t.createdAt);
    setEditIndex(index);
    setShowList(false);
    setOptionalNote(t.note || "");
  };

  const sortedTickets = [...tickets].sort((a, b) => a.priority - b.priority);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">تعریف تیکت</h2>
        <button
          onClick={() => setShowList(!showList)}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          {showList ? "➕ ایجاد تیکت جدید" : "📄 نمایش لیست تیکت‌ها"}
        </button>
      </div>

      {showList ? (
        <table className="w-full text-sm border-collapse rounded-md overflow-hidden shadow">
          <thead className="text-black">
            <tr>
              <th className="border px-2 py-2">شناسه</th>
              <th className="border px-2 py-2">مشتری</th>
              <th className="border px-2 py-2">توضیحات</th>
              <th className="border px-2 py-2">اولویت</th>
              <th className="border px-2 py-2">وضعیت</th>
              <th className="border px-2 py-2">تاریخ ثبت</th>
              <th className="border px-2 py-2">یادداشت</th>
              <th className="border px-2 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map((t, i) => (
              <tr
                key={i}
                className={`${
                  STATUS_COLORS[t.status]
                } bg-opacity-60 text-black`}
              >
                <td className="border px-2 py-1">{t.id}</td>
                <td className="border px-2 py-1">{t.customer}</td>
                <td className="border px-2 py-1">{t.description}</td>
                <td className="border px-2 py-1">
                  {priorityLevels[parseInt(t.priority as string)] ?? "نامشخص"}
                </td>
                <td className={`p-2 rounded ${STATUS_COLORS[t.status]}`}>
                  {t.status}
                </td>
                <td className="border px-2 py-1">{t.createdAt}</td>
                <td className="border px-2 py-1">
                    {t.note ? (t.note.length > 10 ? t.note.slice(0, 10) + "..." : t.note) : "-"}
                </td>
                <td className="border px-2 py-1 space-x-1 rtl:space-x-reverse bg-white">
                  <button
                    onClick={() => handleEdit(i)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-black mb-1">شناسه تیکت</label>
            <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-black select-none">
              {ticketID}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">عنوان مشکلات</label>
            <Select
              options={predefinedDescriptionsGrouped}
              placeholder="یک مورد را انتخاب کنید"
              onChange={(selectedOption) =>
                setDescription(selectedOption?.label || "")
              }
              className="text-black"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  borderColor: "#14b8a6",
                  padding: "2px"
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 100
                })
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">توضیحات (اختیاری)</label>
            <textarea
              value={optionalNote}
              onChange={(e) => setOptionalNote(e.target.value)}
              rows={4}
              placeholder="در صورت نیاز، توضیحاتی اضافه کنید..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-black mb-1">اولویت</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
              >
                <option value={1}>طلایی</option>
                <option value={2}>نقره‌ای</option>
                <option value={3}>برنزی</option>
                <option value={4}>پلاتینیومی</option>
                <option value={5}>سیاه</option>
              </select>
            </div>

            <div>
              <label className="block text-black mb-1">وضعیت</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
              >
                {Object.keys(STATUS_COLORS).map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-black mb-1">مشتری</label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
              >
                <option value="">انتخاب مشتری</option>
                <option value="1029384756">علی رضایی</option>
                <option value="9823456789">نگار مرادی</option>
              </select>
            </div>

            <div>
              <label className="block text-black mb-1">مسئول پیگیری</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="مثلاً پشتیبان فنی"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {editIndex !== null ? "به‌روزرسانی تیکت" : "ثبت تیکت"}
          </button>
        </>
      )}
    </div>
  );
};

export default TicketDefine;
