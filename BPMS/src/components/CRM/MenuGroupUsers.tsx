"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";
import {
  FaPlus,
  FaTrash,
  FaWpforms,
  FaListUl,
  FaCode,
  FaPen,
  FaCheck
} from "react-icons/fa6";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import JsonFormRenderer from "./JsonFormRenderer";

const fieldTypes = [
  { type: "text", label: "متنی" },
  { type: "number", label: "عددی" },
  { type: "date", label: "تاریخ" },
  { type: "textarea", label: "متن بلند" },
  { type: "checkbox", label: "چک‌باکس" },
  { type: "select", label: "انتخابی" }
  // { type: "auto-id", label: "شناسه یکتا (خودکار)" }
];

export default function GroupUserDynamicForm() {
  const [fields, setFields] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState("");

  const [jsonOutput, setJsonOutput] = useState("");
  const [grouperFieldId, setGrouperFieldId] = useState<string | null>(null);

  const handleAddField = () => {
    if (!title || !selectedType) return;
    const newField = {
      id: Date.now().toString(),
      type: selectedType,
      title,
      options: selectedType === "select" ? options.split("\n") : [],
      editing: false,
      grouper: false // ← پیش‌فرض
    };
    setFields([...fields, newField]);
    setSelectedType("");
    setTitle("");
    setOptions("");
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleToggleEdit = (id: string) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, editing: !f.editing } : f))
    );
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, title: newTitle } : f)));
  };

  const handleUpdateOption = (id: string, newOptions: string) => {
    setFields(
      fields.map((f) =>
        f.id === id ? { ...f, options: newOptions.split("\n") } : f
      )
    );
  };

  const handleUpdateType = (id: string, newType: string) => {
    setFields(
      fields.map((f) =>
        f.id === id
          ? {
              ...f,
              type: newType,
              options: newType === "select" ? [] : f.options
            }
          : f
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setFields(reordered);
  };
  
  /* فارسی  سازی */
  const toPersianDigits = (str: string) => {
    const enDigits = "0123456789";
    const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return str.replace(/\d/g, (d) => faDigits[enDigits.indexOf(d)] || d);
  };
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderFieldInput = (field: any) => {
    const inputClass = "border px-2 py-1 rounded w-full text-black text-sm";
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = toPersianDigits(e.target.value);
      handleChange(field.title, val);
    };

    const persianToEnglishDigits = (str: string) => {
      return str.replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728));
    };
    
    const englishToPersianDigits = (str: string) => {
      return str.replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 1728));
    };
  
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className={inputClass}
            placeholder="مقدار وارد کنید"
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          />
        );
  
      case "number":
        return (
          <input
            type="text" // نه number چون فارسی رو قبول نمی‌کنه
            className={inputClass}
            placeholder="عدد وارد کنید"
            value={formData[field.title] ? englishToPersianDigits(formData[field.title]) : ""}
            onChange={(e) => {
              const rawValue = persianToEnglishDigits(e.target.value);
              if (/^\d*\.?\d*$/.test(rawValue)) {
                handleChange(field.title, rawValue);
              }
            }}
            inputMode="decimal"
            pattern="[0-9]*"
          />
        );
  
      case "textarea":
        return (
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="توضیحات..."
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          />
        );
  
      case "date":
        return (
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            inputClass={inputClass}
            value={formData[field.title]}
            onChange={(date) => handleChange(field.title, date?.format("YYYY/MM/DD"))}
            placeholder={`انتخاب ${field.title}`}
          />
        );
  
      case "checkbox":
        return (
          <input
            type="checkbox"
            className="scale-125"
            checked={formData[field.title] || false}
            onChange={(e) => handleChange(field.title, e.target.checked)}
          />
        );
  
      case "select":
        return (
          <select
            className={inputClass}
            value={formData[field.title] || ""}
            onChange={(e) => handleChange(field.title, e.target.value)}
          >
            {field.options.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
  
      default:
        return null;
    }
  };


  const [createTables, setCreateTables] = useState(false);
  const handleGenerateJSON = () => {
    const json = JSON.stringify(
      fields.map(({ id, editing, ...rest }) => rest),
      null,
      2
    );
    setJsonOutput(json);
    setCreateTables(true);
  };

  const handleUpdateTables = () => {
    setCreateTables(false);
  };

  const toggleGrouper = (id: string) => {
    if (grouperFieldId === id) {
      // کاربر روی همون فیلد دوباره کلیک کرده → حذف grouper
      setFields(
        fields.map((f) => (f.id === id ? { ...f, grouper: false } : f))
      );
      setGrouperFieldId(null);
    }
    else {
      // روی یه فیلد دیگه کلیک کرده → تغییر grouper
      setFields(
        fields.map((f) => ({
          ...f,
          grouper: f.id === id
        }))
      );
      setGrouperFieldId(id);
    }
  };



  return (
    <div className="flex flex-wrap gap-4 items-start w-full overflow-x-hidden">
      {createTables ? (
        <>
          {jsonOutput && (
            <div className="mt-6">
              <h3 className="text-md font-bold text-black mb-2">
                📦 خروجی JSON فرم
              </h3>
              <pre className="bg-gray-200 p-4 rounded text-black overflow-auto text-sm whitespace-pre-wrap">
                {jsonOutput}
              </pre>
            </div>
          )}
          <button
            onClick={handleUpdateTables}
            className="min-w-[140px] px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            تغییر فرم
          </button>
          <JsonFormRenderer schema={JSON.parse(jsonOutput)} />
        </>
      ) : (
        <>
          <div className="w-80 bg-white shadow-lg p-2 rounded-xl border border-gray-200">
            <h2 className="font-bold text-md mb-4 text-black flex items-center gap-2">
              <FaWpforms className="text-teal-600" /> افزودن فیلد جدید
            </h2>
            <div className="mb-2">
              <div className="text-xs text-black mb-1">عنوان فیلد</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded text-black text-sm"
                placeholder="مثلاً شماره تماس"
              />
            </div>
            <div className="mb-2">
              <div className="text-xs text-black mb-1">نوع فیلد</div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-2 py-1 border rounded text-black text-sm"
              >
                <option value="">انتخاب کنید</option>
                {fieldTypes.map((ft) => (
                  <option key={ft.type} value={ft.type}>
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedType === "select" && (
              <div className="mb-2">
                <div className="text-xs text-black mb-1">
                  گزینه‌ها (هر خط یک گزینه)
                </div>
                <textarea
                  rows={2}
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-black text-sm"
                  placeholder={`مثلاً گزینه ۱\nگزینه ۲`}
                ></textarea>
              </div>
            )}
            <button
              onClick={handleAddField}
              className="w-full mt-2 bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700 transition text-sm flex items-center justify-center gap-2"
            >
              <FaPlus /> افزودن فیلد
            </button>
            <button
              onClick={handleGenerateJSON}
              className="w-full mt-2 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2"
            >
                ایجاد فرم
            </button>
          </div>

          <div className="flex-1 p-4">
            <h1 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <FaListUl className="text-gray-700" /> ساختن فرم گروه بندی کاربران
            </h1>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {fields.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        فعلاً فیلدی اضافه نشده است.
                      </p>
                    )}

                    {fields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white border rounded-lg p-3 shadow-sm"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-black text-sm flex items-center gap-2 flex-wrap">
                                {/* Grouper toggle */}
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={field.grouper || false}
                                      onChange={() => toggleGrouper(field.id)}
                                    />
                                  </label>

                                  {field.grouper && (
                                    <span className="text-indigo-600 font-bold">
                                      [Grouper]
                                    </span>
                                  )}
                                </div>

                                {/* Title + Type */}
                                {field.editing ? (
                                  <>
                                    <input
                                      type="text"
                                      value={field.title}
                                      onChange={(e) =>
                                        handleUpdateTitle(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                      className="px-2 py-1 text-black text-sm border rounded"
                                    />
                                    <select
                                      value={field.type}
                                      onChange={(e) =>
                                        handleUpdateType(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                      className="px-2 py-1 text-black text-sm border rounded"
                                    >
                                      {fieldTypes.map((ft) => (
                                        <option key={ft.type} value={ft.type}>
                                          {ft.label}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                ) : (
                                  <span>{field.title}</span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleEdit(field.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  title="ویرایش"
                                >
                                  <FaPen />
                                </button>
                                <button
                                  onClick={() => handleDeleteField(field.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title="حذف"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>

                            {field.editing && field.type === "select" && (
                              <textarea
                                rows={2}
                                defaultValue={field.options.join("\n")}
                                onBlur={(e) =>
                                  handleUpdateOption(field.id, e.target.value)
                                }
                                className="w-full px-2 py-1 border rounded text-black text-sm mb-2"
                                placeholder="ویرایش گزینه‌ها"
                              ></textarea>
                            )}

                            {renderFieldInput(field)}
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>
      )}
    </div>
  );
}
