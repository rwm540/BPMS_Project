"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
  Legend
} from "chart.js";
import Select from "react-select";
import * as XLSX from "xlsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

export default function PowerBI() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [chartType, setChartType] = useState("line");
  const [xKey, setXKey] = useState<string>("");
  const [yKey, setYKey] = useState<string>("");
  const [columnOptions, setColumnOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const chartOptions = [
    { value: "line", label: "Line Chart 📈" },
    { value: "bar", label: "Bar Chart 📊" },
    { value: "pie", label: "Pie Chart 🥧" },
    { value: "doughnut", label: "Doughnut Chart 🍩" },
    { value: "radar", label: "Radar Chart 🕸️" },
    { value: "polar", label: "Polar Area Chart ❄️" },
    { value: "bubble", label: "Bubble Chart 🫧" },
    { value: "scatter", label: "Scatter Chart 🔬" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      setWorkbook(wb);
      setSheetNames(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (workbook && selectedSheet) {
      const worksheet = workbook.Sheets[selectedSheet];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      setRawData(jsonData);

      const columns = Object.keys(jsonData[0] || {}).map((key) => ({
        value: key,
        label: key
      }));
      setColumnOptions(columns);

      if (columns.length >= 2) {
        setXKey(columns[0].value);
        setYKey(columns[1].value);
      }
    }
  }, [workbook, selectedSheet]);

  const chartData = {
    labels: rawData.map((row) => row[xKey]),
    datasets: [
      {
        label: yKey || "داده‌ها",
        data: rawData.map((row) => Number(row[yKey]) || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)"
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };

  const bubbleScatterData = {
    datasets: [
      {
        label: yKey || "مقدار",
        data: rawData.map((row) => ({
          x: Number(row[xKey]) || 0,
          y: Number(row[yKey]) || 0,
          r: 5
        })),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  };

  return (
    <div className="p-6 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        📊 لطفا فایل Excel خود را قرار دهید
      </h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4  p-2 text-black w-[90%]"
      />
      {sheetNames.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedSheet || ""}
            onChange={(e) => setSelectedSheet(e.target.value)}
            className="border border-gray-700 p-2 rounded bg-gray-800 text-white"
          >
            {sheetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Select
            options={chartOptions}
            defaultValue={chartOptions[0]}
            onChange={(option) => setChartType(option?.value || "line")}
            className="min-w-[200px] text-black"
          />
          <Select
            options={columnOptions}
            value={columnOptions.find((o) => o.value === xKey)}
            onChange={(option) => setXKey(option?.value || "")}
            placeholder="ستون X"
            className="min-w-[200px] text-black"
          />
          <Select
            options={columnOptions}
            value={columnOptions.find((o) => o.value === yKey)}
            onChange={(option) => setYKey(option?.value || "")}
            placeholder="ستون Y"
            className="min-w-[200px] text-black"
          />
           <input
            type="text"
            placeholder="..."
            className="mb-4 border border-gray-700 p-2 rounded text-black"
          />
        </div>
      )}

      {rawData.length > 0 && xKey && yKey && (
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-[800px] h-[400px]">
            {chartType === "line" && <Line data={chartData} />}
            {chartType === "bar" && <Bar data={chartData} />}
            {chartType === "pie" && <Pie data={chartData} />}
            {chartType === "doughnut" && <Doughnut data={chartData} />}
            {chartType === "radar" && <Radar data={chartData} />}
            {chartType === "polar" && <PolarArea data={chartData} />}
            {chartType === "bubble" && <Bubble data={bubbleScatterData} />}
            {chartType === "scatter" && <Scatter data={bubbleScatterData} />}
          </div>
        </div>
      )}
    </div>
  );
}
