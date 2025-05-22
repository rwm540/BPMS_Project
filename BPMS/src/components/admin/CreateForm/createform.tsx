// نسخه ارتقاء یافته فرم‌ساز با قابلیت حذف و ویرایش فیلدها
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// تاریخ‌نگار و تقویم‌ها
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker"; // اضافه بالا!
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";

/* pager form */
import FormPaper from "./createFromPaper";
/* pager form */

interface FieldConfig {
  id: number;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  acceptFormats?: string[];
  maxFileSizeMB?: string;
}

type FieldType =
  | "text"
  | "number"
  | "email"
  | "file"
  | "select"
  | "checkbox"
  | "textarea"
  | "date";

  
const api = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function CreateForm() {
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());
  const [useJalali, setUseJalali] = useState(true);

  const [formJson, setFormJson] = useState<string>("");

  const [quillValues, setQuillValues] = useState<Record<string, string>>({});

  const [formTitle, setFormTitle] = useState<string>("");
  const [formNameCompany, setFormNameCompany] = useState<string>("");

  const [companyLogoBase64, setCompanyLogoBase64] = useState<string | null>(
    null
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"]
    ]
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  /*  path to the paper  */
  const [paper, setpaper] = useState(false);
  const voidPaper = (setbol: boolean) => {
    setpaper(setbol);
  };
  /*  path to the paper  */

  /* const exportFormAsJson = () => {
    const json = JSON.stringify(
      {
        title: formTitle || "",
        namecompany: formNameCompany || "",
        logo: companyLogoBase64
          ? `data:image/png;base64,${companyLogoBase64}`
          : null,
        fields: fields
      },
      null,
      2
    );
    setFormJson(json);
    localStorage.setItem("FORM_JSON", json);
    setpaper(true);
  };*/

  const exportFormAsJson = () => {
    const json = JSON.stringify(
      {
        title: formTitle || "",
        namecompany: formNameCompany || "",
        logo: companyLogoBase64
          ? `data:image/png;base64,${companyLogoBase64}`
          : null,
        fields: fields
      },
      null,
      2
    );
    setFormJson(json);
    localStorage.setItem("FORM_JSON", json);
    setpaper(true);

    sendToServer(); // 👈 اینو صدا بزن بعد از همه چی
  };
  
  const sendToServer = async () => {
    const pureJson = {
      title: formTitle || "",
      namecompany: formNameCompany || "",
      logo: companyLogoBase64
        ? `data:image/png;base64,${companyLogoBase64}`
        : null,
      fields: fields
    };

    const dtoToSend = {
      titleForm: formTitle || "",
      nameCompany: formNameCompany || "",
      images: companyLogoBase64
        ? `data:image/png;base64,${companyLogoBase64}`
        : null,
      json: JSON.stringify(pureJson)
    };

    try {
      const res = await fetch(
        `${api}/api/controllerone/save-form`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dtoToSend)
        }
      );

      const result = await res.text();
      alert(result);
    } catch (err) {
      console.error("❌ خطا در ارسال:", err);
      alert("خطا در ارتباط با سرور!");
    }
  };

  const [newField, setNewField] = useState({
    label: "",
    type: "text" as FieldType,
    placeholder: "",
    optionsText: "",
    required: false,
    maxFileSizeMB: "",
    acceptFormats: [
      ".pdf",
      ".xls",
      ".xlsx",
      ".jpg",
      ".jpeg",
      ".png",
      ".ico",
      ".jfif"
    ]
  });

  const formatOptions = [
    ".pdf",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".ico",
    ".jfif"
  ];

  const addOrUpdateField = () => {
    const updatedField: FieldConfig = {
      id: editId ?? Date.now(),
      name: `field_${editId ?? Date.now()}`,
      label: newField.label,
      type: newField.type,
      placeholder:
        newField.type === "file"
          ? newField.maxFileSizeMB
          : newField.placeholder,
      required: newField.required,
      options: newField.optionsText
        ?.split(",")
        .map((o) => o.trim())
        .filter(Boolean),
      acceptFormats: newField.acceptFormats,
      maxFileSizeMB: newField.maxFileSizeMB
    };

    if (editId !== null) {
      setFields((prev) =>
        prev.map((f) => (f.id === editId ? updatedField : f))
      );
    }
    else {
      setFields((prev) => [...prev, updatedField]);
    }

    setShowBuilder(false);
    setEditId(null);
    setNewField({
      label: "",
      type: "text",
      placeholder: "",
      optionsText: "",
      required: false,
      maxFileSizeMB: "",
      acceptFormats: formatOptions
    });
  };

  const editField = (field: FieldConfig) => {
    setNewField({
      label: field.label,
      type: field.type,
      placeholder: field.placeholder || "",
      optionsText: field.options?.join(", ") || "",
      required: field.required || false,
      maxFileSizeMB: field.maxFileSizeMB || "",
      acceptFormats: field.acceptFormats || []
    });
    setEditId(field.id);
    setShowBuilder(true);
  };

  const deleteField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const onSubmit = (data: any) => {
    const output = fields.map((f) => ({
      ...f,
      value: data[f.name] || ""
    }));
    console.log("✅ داده‌های نهایی:", output);
    alert("📥 فرم با موفقیت ثبت شد! جزئیات در کنسول مرورگر ذخیره شد.");
  };

  return (
    <>
      {paper ? (
        <FormPaper voidPaper={voidPaper} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full p-4 text-black flex flex-col items-center gap-4"
        >
          <div className="w-full max-w-2xl">
            <button
              type="button"
              className="btn btn-outline mb-4"
              onClick={() => setShowBuilder(true)}
            >
              +
            </button>

            {showBuilder && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                <input
                  className="input text-black input-bordered w-full mb-2"
                  placeholder="عنوان فیلد"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                />

                <select
                  className="select text-black select-bordered w-full mb-2"
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      type: e.target.value as FieldType
                    })
                  }
                >
                  {[
                    { label: "متن", value: "text" },
                    { label: "عدد", value: "number" },
                    { label: "ایمیل", value: "email" },
                    { label: "فایل", value: "file" },
                    { label: "لیست کشویی", value: "select" },
                    { label: "تیک‌خور", value: "checkbox" },
                    { label: "متن چندخطی", value: "textarea" },
                    { label: "تاریخ", value: "date" }
                  ].map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {newField.type === "select" && (
                  <input
                    className="input input-bordered w-full mb-2"
                    placeholder="گزینه‌ها با , جدا شوند"
                    value={newField.optionsText}
                    onChange={(e) =>
                      setNewField({ ...newField, optionsText: e.target.value })
                    }
                  />
                )}

                {newField.type !== "checkbox" && newField.type !== "select" && (
                  <input
                    className="input text-black input-bordered w-full mb-2"
                    placeholder="متن راهنما"
                    value={newField.placeholder}
                    onChange={(e) =>
                      setNewField({ ...newField, placeholder: e.target.value })
                    }
                  />
                )}

                {newField.type === "file" && (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="حداکثر حجم فایل (MB)"
                      className="input input-bordered w-full mb-2 text-black"
                      value={newField.maxFileSizeMB || ""}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          maxFileSizeMB: e.target.value
                        })
                      }
                    />
                    <div className="mb-2">
                      <label className="block mb-1 font-bold">
                        فرمت‌های مجاز:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {formatOptions.map((format) => (
                          <label
                            key={format}
                            className="flex gap-2 items-center"
                          >
                            <input
                              type="checkbox"
                              checked={newField.acceptFormats.includes(format)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewField((prev) => ({
                                    ...prev,
                                    acceptFormats: [
                                      ...prev.acceptFormats,
                                      format
                                    ]
                                  }));
                                }
                                else {
                                  setNewField((prev) => ({
                                    ...prev,
                                    acceptFormats: prev.acceptFormats.filter(
                                      (f) => f !== format
                                    )
                                  }));
                                }
                              }}
                            />
                            {format.toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                  />{" "}
                  الزامی؟
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm"
                    onClick={() => {
                      setShowBuilder(false);
                      setEditId(null);
                    }}
                  >
                    لغو
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={addOrUpdateField}
                  >
                    ایجاد
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4 w-full max-w-2xl mx-auto">
              <label className="block text-sm font-bold mb-1 text-black">
                📝 عنوان فرم
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-black"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            {/* <div className="mb-4 w-full max-w-2xl mx-auto">
          <label className="block text-sm font-bold mb-1 text-black">
            عکس  شرکت
          </label>
          <input
            type="file"
            className="input input-bordered w-full text-black"
            value={formNameCompany}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div> */}

            <div className="mb-4 w-full max-w-2xl mx-auto">
              <label className="block text-sm font-bold mb-1 text-black">
                اسم سازمان یا شرکت
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-black"
                value={formNameCompany}
                onChange={(e) => setFormNameCompany(e.target.value)}
              />

              <label className="block text-sm font-bold mb-1 text-black">
                لوگوی شرکت (فقط عکس)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.ico,.jfif,.webp"
                className="file-input file-input-bordered w-full text-black"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/gif",
                      "image/webp",
                      "image/x-icon",
                      "image/jpg"
                    ];

                    // چک کردن نوع فایل
                    if (!allowedTypes.includes(file.type)) {
                      alert("❌ فقط فرمت‌های تصویری مجاز هستند!");
                      e.target.value = "";
                      return;
                    }

                    // چک کردن حجم فایل
                    const maxSizeMB = 5;
                    const maxSizeBytes = maxSizeMB * 1024 * 1024;
                    if (file.size > maxSizeBytes) {
                      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                      alert(
                        `❌ حجم فایل (${fileSizeMB} MB) بیشتر از ${maxSizeMB} MB است!`
                      );
                      e.target.value = "";
                      return;
                    }

                    // تبدیل فایل به Base64
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result
                        ?.toString()
                        .split(",")[1]; // فقط base64
                      setCompanyLogoBase64(base64String || null);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {fields.length > 0 && (
              <div className="space-y-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="mb-3 border text-black p-3 rounded relative mt-4"
                  >
                    <label className="block font-bold mb-1">
                      {field.label}
                    </label>
                    <div className="absolute top-2 left-2 flex gap-2">
                      <button
                        type="button"
                        className="btn btn-warning btn-xs"
                        onClick={() => editField(field)}
                      >
                        ویرایش
                      </button>
                      <button
                        type="button"
                        className="btn btn-error btn-xs"
                        onClick={() => deleteField(field.id)}
                      >
                        حذف
                      </button>
                    </div>
                    {field.type === "select" ? (
                      <select
                        {...register(field.name)}
                        className="select text-black select-bordered w-full mt-4"
                      >
                        <option value="">انتخاب کنید</option>
                        {field.options?.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        {...register(field.name)}
                        className="checkbox checkbox-primary mt-4"
                      />
                    ) : field.type === "textarea" ? (
                      <ReactQuill
                        theme="snow"
                        value={quillValues[field.name] || ""}
                        onChange={(val) =>
                          setQuillValues((prev) => ({
                            ...prev,
                            [field.name]: val
                          }))
                        }
                        modules={modules}
                        className="text-black [&_.ql-editor]:text-black mt-4"
                        style={{ direction: "rtl", height: "200px" }}
                      />
                    ) : field.type === "date" ? (
                      <>
                        <DatePicker
                          value={date}
                          calendar={useJalali ? persian : gregorian}
                          locale={useJalali ? persian_fa : gregorian_en}
                          format="YYYY/MM/DD HH:mm"
                          plugins={[<TimePicker position="bottom" />]}
                          calendarPosition="bottom-right"
                          className="text-black"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline mt-4"
                          onClick={() => setUseJalali(!useJalali)}
                        >
                          {useJalali ? "سوییچ به میلادی" : "سوییچ به شمسی"}
                        </button>
                      </>
                    ) : field.type === "file" ? (
                      <input
                        type="file"
                        accept={field.acceptFormats?.join(",") || ""}
                        {...register(field.name)}
                        className="file-input file-input-bordered w-full text-black mt-4"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          const maxMB = field.maxFileSizeMB
                            ? parseFloat(field.maxFileSizeMB)
                            : 2;
                          const maxBytes = maxMB * 1024 * 1024;
                          if (file && file.size > maxBytes) {
                            const sizeInMB = (file.size / 1024 / 1024).toFixed(
                              2
                            );
                            alert(
                              `حجم فایل انتخاب‌شده (${sizeInMB} MB) بیشتر از حد مجاز (${maxMB.toFixed(
                                2
                              )} MB) است.`
                            );
                            e.target.value = "";
                          }
                        }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        {...register(field.name)}
                        placeholder={field.placeholder}
                        className="input input-bordered w-full text-black mt-4"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <br />
            <br />
            <br />
            <br />
            {/* <button type="submit" className="btn btn-success mt-6"  onClick={exportFormAsJson} > 
          ثبت نهایی فرم
        </button> */}
            <div className="flex gap-2 mt-6">
              <button className="btn btn-success" onClick={exportFormAsJson}>
                ثبت نهایی فرم
              </button>
            </div>
            {/* {formJson && (
          <div className="mt-4 bg-gray-100 p-4 rounded w-full max-w-2xl mx-auto text-black">
            <h3 className="font-bold mb-2">📄 خروجی JSON:</h3>
            <pre className="text-xs whitespace-pre-wrap">{formJson}</pre>
          </div>
        )} */}
          </div>
        </form>
      )}
    </>
  );
}
