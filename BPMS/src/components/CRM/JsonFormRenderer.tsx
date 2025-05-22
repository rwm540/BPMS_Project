"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaCheck, FaXmark, FaPen, FaTrash } from "react-icons/fa6";

type FieldType = {
  type: string;
  title: string;
  options?: string[];
};

type Props = {
  schema: FieldType[];
};

const JsonFormRenderer = ({ schema }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<Record<string, any>[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [information,setInformation] = useState("ثبت");

  useEffect(() => {
    const initial: Record<string, any> = {};
    schema.forEach((field) => {
      initial[field.title] = field.type === "date" ? null : "";
    });
    setFormData(initial);
  }, [schema]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const initial: Record<string, any> = {};

    schema.forEach((field) => {
      if (field.type === "auto-id") {
        const prefix = field.title?.split(" ")[0]?.toUpperCase() || "ID";
        const uniqueId = `${prefix}-${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        initial[field.title] = uniqueId;
      }
      else if (field.type === "date") {
        initial[field.title] = null;
      }
      else {
        initial[field.title] = "";
      }
    });

    setFormData(initial);
  }, [schema]);

  const handleEdit = (index: number) => {
    setFormData(submittedData[index]);
    setEditIndex(index);
    setInformation("ویرایش");
  };

  const handleDelete = (index: number) => {
    const filtered = submittedData.filter((_, i) => i !== index);
    setSubmittedData(filtered);
    if (editIndex === index) {
      setEditIndex(null);
    }
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...submittedData];
      updated[editIndex] = formData;
      setSubmittedData(updated);
      setEditIndex(null);
    }
    else {
      setSubmittedData((prev) => [...prev, formData]);
    }

    const resetForm: Record<string, any> = {};
    schema.forEach((field) => {
      if (field.type === "auto-id") {
        const prefix = field.title?.split(" ")[0]?.toUpperCase() || "ID";
        resetForm[field.title] = `${prefix}-${Math.floor(
          100000 + Math.random() * 900000
        )}`;
      }
      else if (field.type === "date") {
        resetForm[field.title] = null;
      }
      else {
        resetForm[field.title] = "";
      }
    });
    setFormData(resetForm);
    setInformation("ثبت");
  };

 

  const renderField = (field: FieldType, index: number) => {
    const inputClass =
      "w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black bg-white";

    switch (field.type) {
      case "text":
      case "number":
        return (
          <input
            type={field.type}
            className={inputClass}
            placeholder={`${field.title}`}
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder={`در صورت نیاز، ${field.title} را وارد کنید...`}
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          />
        );

      case "select":
        return (
          <select
            className={inputClass}
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          >
            <option value="">انتخاب کنید</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={formData[field.title]}
            onChange={(date) =>
              handleChange(field.title, date?.format("YYYY/MM/DD"))
            }
            inputClass={inputClass}
            placeholder={`انتخاب ${field.title}`}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              checked={formData[field.title] || false}
              onChange={(e) => handleChange(field.title, e.target.checked)}
            />
          </div>
        );

      case "auto-id":
        return (
          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-black">
            {formData[field.title]}
          </div>
        );

      default:
        return (
          <input
            type="text"
            className={inputClass}
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mx-auto mt-6">
      <h2 className="text-xl font-bold text-black mb-6">
        📋 گروه‌بندی کاربران
      </h2>
      <div className="space-y-5">
        {schema.map((field, i) => (
          <div key={i}>
            <label className="block mb-1 text-black font-medium">
              {field.title}
            </label>
            {renderField(field, i)}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
        {information}
        </button>
      </div>

      {submittedData.length > 0 && (
        <div className="mt-10">
          <h3 className="text-md font-bold text-black mb-4">
            📦 لیست اطلاعات ثبت‌شده
          </h3>

          <div className="overflow-auto rounded-lg shadow border border-gray-300">
            <table className="min-w-full bg-white text-sm text-right rtl:text-right text-gray-700">
              <thead className="bg-gray-100 border-b text-gray-800">
                <tr>
                  <th className="px-4 py-2 border-l text-center">ردیف</th>
                  {Object.keys(submittedData[0]).map((key, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 border-l whitespace-nowrap text-center"
                    >
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-2 border-l text-center">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {submittedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 border-l font-bold text-center">
                      {rowIndex + 1}
                    </td>

                    {Object.keys(row).map((key, colIndex) => {
                      const value = row[key];
                      const isBooleanLike =
                        typeof value === "boolean" ||
                        typeof value === "undefined";

                      return (
                        <td
                          key={colIndex}
                          className="px-4 py-2 border-l text-center whitespace-nowrap"
                        >
                          {isBooleanLike ? (
                            value ? (
                              <FaCheck
                                className="text-green-600 text-lg inline-block"
                                title="تأیید شده"
                              />
                            ) : (
                              <FaXmark
                                className="text-red-500 text-lg inline-block"
                                title="رد شده"
                              />
                            )
                          ) : value !== undefined &&
                            value !== null &&
                            value !== "" ? (
                            value
                          ) : (
                            <FaXmark
                              className="text-red-500 text-lg inline-block"
                              title="رد شده"
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2 border-l text-center whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-800 mx-1"
                        onClick={() => handleEdit(rowIndex)}
                        title="ویرایش"
                      >
                        <FaPen className="inline-block text-lg" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 mx-1"
                        onClick={() => handleDelete(rowIndex)}
                        title="حذف"
                      >
                        <FaTrash className="inline-block text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonFormRenderer;
