"use client";

import { useEffect, useState } from "react";
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
  FaPen,
  FaCheck
} from "react-icons/fa6";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const fieldTypes = [
  { type: "text", label: "متنی" },
  { type: "number", label: "عددی" },
  { type: "date", label: "تاریخ" },
  { type: "textarea", label: "متن بلند" },
  { type: "checkbox", label: "چک‌باکس" },
  { type: "select", label: "انتخابی" }
];

const generateRandomCode = () => {
  return "CNT-" + Math.floor(100000 + Math.random() * 900000).toString();
};

export default function MenuContract() {
  const [fields, setFields] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");

  useEffect(() => {
    const contractCodeField = {
      id: "contract-code",
      type: "text",
      title: "شناسه قرارداد",
      value: generateRandomCode(),
      fixed: true,
      editing: false
    };
    setFields([contractCodeField]);
  }, []);

  const handleAddField = () => {
    if (!title || !selectedType) return;
    const newField = {
      id: Date.now().toString(),
      type: selectedType,
      title,
      options: selectedType === "select" ? options.split("\n") : [],
      editing: false
    };
    setFields([...fields, newField]);
    setSelectedType("");
    setTitle("");
    setOptions("");
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field?.fixed) return;
    setFields(fields.filter(f => f.id !== id));
  };

  const handleToggleEdit = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field?.fixed) return;
    setFields(fields.map(f => f.id === id ? { ...f, editing: !f.editing } : f));
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, title: newTitle } : f));
  };

  const handleUpdateOption = (id: string, newOptions: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, options: newOptions.split("\n") } : f));
  };

  const handleUpdateType = (id: string, newType: string) => {
    setFields(fields.map(f =>
      f.id === id
        ? {
            ...f,
            type: newType,
            options: newType === "select" ? [] : f.options
          }
        : f
    ));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setFields(reordered);
  };

  const renderFieldInput = (field: any) => {
    if (field.id === "contract-code") {
      return (
        <input
          type="text"
          value={field.value}
          readOnly
          className="border px-2 py-1 rounded w-full text-black text-sm bg-gray-100"
        />
      );
    }

    switch (field.type) {
      case "text":
        return <input type="text" className="border px-2 py-1 rounded w-full text-black text-sm" placeholder="مقدار وارد کنید" />;
      case "number":
        return <input type="number" className="border px-2 py-1 rounded w-full text-black text-sm" placeholder="عدد وارد کنید" />;
      case "date":
        return <DatePicker calendar={persian} locale={persian_fa} inputClass="w-full px-2 py-1 text-black text-sm border rounded" />;
      case "textarea":
        return <textarea rows={2} className="border px-2 py-1 rounded w-full text-black text-sm" placeholder="توضیحات..." />;
      case "checkbox":
        return <input type="checkbox" className="scale-125" />;
      case "select":
        return (
          <select className="border px-2 py-1 rounded w-full text-black text-sm">
            {field.options.map((opt: string, idx: number) => (
              <option key={idx}>{opt}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  const handleGenerateJSON = () => {
    const json = JSON.stringify(fields.map(({ id, editing, fixed, ...rest }) => rest), null, 2);
    setJsonOutput(json);
  };

  return (
    <div className="flex flex-wrap gap-4 items-start w-full overflow-x-hidden">
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
              <option key={ft.type} value={ft.type}>{ft.label}</option>
            ))}
          </select>
        </div>
        {selectedType === "select" && (
          <div className="mb-2">
            <div className="text-xs text-black mb-1">گزینه‌ها (هر خط یک گزینه)</div>
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
          <FaListUl className="text-gray-700" /> ساختن فرم قرارداد
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
                  <p className="text-gray-500 text-sm">فعلاً فیلدی اضافه نشده است.</p>
                )}
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white border rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-black text-sm flex items-center gap-2">
                            {field.editing ? (
                              <>
                                <input
                                  type="text"
                                  value={field.title}
                                  onChange={(e) => handleUpdateTitle(field.id, e.target.value)}
                                  className="px-2 py-1 text-black text-sm border rounded"
                                />
                                <select
                                  value={field.type}
                                  onChange={(e) => handleUpdateType(field.id, e.target.value)}
                                  className="px-2 py-1 text-black text-sm border rounded"
                                >
                                  {fieldTypes.map((ft) => (
                                    <option key={ft.type} value={ft.type}>{ft.label}</option>
                                  ))}
                                </select>
                              </>
                            ) : (
                              <span>{field.title}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!field.fixed && (
                              <>
                                <button
                                  onClick={() => handleToggleEdit(field.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  title="ویرایش عنوان"
                                >
                                  <FaPen />
                                </button>
                                <button
                                  onClick={() => handleDeleteField(field.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {field.editing && field.type === "select" && (
                          <textarea
                            rows={2}
                            defaultValue={field.options.join("\n")}
                            onBlur={(e) => handleUpdateOption(field.id, e.target.value)}
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

        {jsonOutput && (
          <div className="mt-6">
            <h3 className="text-md font-bold text-black mb-2">📦 خروجی JSON فرم</h3>
            <pre className="bg-gray-200 p-4 rounded text-black overflow-auto text-sm whitespace-pre-wrap">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
