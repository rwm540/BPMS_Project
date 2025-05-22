"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

interface FormPaper {
  voidPaper: (paper: boolean) => void;
}

export default function OfficialThreeColumnForm({ voidPaper }: FormPaper) {
  const [form, setForm] = useState<any>({});
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const json = localStorage.getItem("FORM_JSON");
    if (json) {
      const parsed = JSON.parse(json);
      setForm(parsed);
    }
  }, []);

  const generateRandomFilename = () => {
    return `form-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const PdfPaper = () => {
    if (printRef.current) {
      html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgX = 20;
        const imgY = 20;
        doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);
        doc.save(generateRandomFilename() + ".pdf");
      });
    }
  };

  const ExcelPaper = () => {
    if (printRef.current) {
      const wb = XLSX.utils.table_to_book(printRef.current);
      XLSX.writeFile(wb, generateRandomFilename() + ".xlsx");
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-6 print:hidden">
        <button
          type="button"
          className="btn bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => voidPaper(false)}
        >
          برگشت
        </button>
        <button
          type="button"
          className="btn bg-orange-500 text-white hover:bg-orange-600"
          onClick={PdfPaper}
        >
          PDF
        </button>
        <button
          type="button"
          className="btn bg-orange-500 text-white hover:bg-orange-600"
          onClick={ExcelPaper}
        >
          Excel
        </button>
      </div>

      <br />
      <br />
      <br />

      {/* 📄 فرم کامل تمام‌صفحه */}
      <div
        ref={printRef}
        className="min-h-screen w-full bg-white p-8 text-gray-800"
      >
        <div className="w-full border border-gray-300 shadow-md p-8 relative">
          {/* ✅ لوگو بالا سمت چپ */}
          <div className="absolute top-0 left-0 w-28 h-28">
            <img
              src={form.logo || "/bpms3.jpg"}
              alt="لوگو"
              className="w-full h-full object-contain"
            />
          </div>
          <br/>
          <br/>
          <br/>
          {/* ✅ عنوان و نام شرکت وسط */}
          <div className="flex flex-col items-center text-center mb-16 mt-2">
            <h1 className="text-2xl font-bold mb-1">{form.title}</h1>
            <p className="text-sm text-gray-500">{form.namecompany}</p>
          </div>

          {/* ✅ فیلدهای فرم داینامیک */}
          <div className="grid grid-cols-5 gap-6 text-sm">
            {form?.fields?.map((field: any, index: number) => {
              if (field.type === "textarea") {
                return (
                  <div key={index} className="col-span-5">
                    <label className="block mb-1">{field.label}</label>
                    <textarea
                      className="border border-gray-400 w-full h-24 rounded-md p-2"
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }

              if (field.type === "date") {
                return (
                  <div key={index} className="col-span-2">
                    <label className="block mb-1">{field.label}</label>
                    <input
                      type="text"
                      className="border border-gray-400 w-full rounded-md p-2"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                );
              }

              return (
                <div key={index} className="col-span-1">
                  <label className="block mb-1">{field.label}</label>
                  <div className="border-b border-gray-500 h-8" />
                </div>
              );
            })}
          </div>

          {/* ✅ امضا و نام */}
          <div className="flex justify-between items-end mt-16 text-sm">
             <div>
              <div className=" w-48 mt-2" />
            </div> 
            <div>
              <p className="text-right">امضا :</p>
              <div className="border-b border-gray-500 w-48 mt-2 float-left" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
