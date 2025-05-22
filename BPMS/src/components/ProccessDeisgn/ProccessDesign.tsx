"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { isContentSavedEvent } from "@miragon/camunda-web-modeler";
import { xml2js } from "xml-js";

const api = process.env.NEXT_PUBLIC_API_BASE_URL;
const BpmnModeler = dynamic(
  () => import("@miragon/camunda-web-modeler").then((m) => m.BpmnModeler),
  { ssr: false }
);

const initialDiagramXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1" isExecutable="true">
    <startEvent id="StartEvent_1" name="شروع"/>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="100" y="100" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;


interface ProccessGetway {
  getDataProccessinfo: (options: {
    nameOnly?: boolean;
    allProccess?: boolean;
  }) => void;
}

export default function ProcessDesign({getDataProccessinfo}:ProccessGetway) {
  const [bpmnElements, setBpmnElements] = useState<any[]>([]);
  const [xml, setXml] = useState<string>(initialDiagramXml);
  const [json, setJson] = useState<any[]>([]);
  const modelerRef = useRef<any>(null);

  const [processName, setProcessName] = useState("");

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const extractElementsWithFullConfig = (xml: string): any[] => {
    const json = xml2js(xml, { compact: true }) as any;
    const processes = [].concat(json?.definitions?.process || []);
    const shapes =
      json?.definitions?.["bpmndi:BPMNDiagram"]?.["bpmndi:BPMNPlane"]?.[
        "bpmndi:BPMNShape"
      ];
    if (!processes.length || !shapes) return [];
    const diagramShapes = Array.isArray(shapes) ? shapes : [shapes];
    const elements = [];

    for (const shape of diagramShapes) {
      const elementId = shape._attributes?.bpmnElement;
      const bounds = shape["dc:Bounds"]?._attributes;
      if (!elementId || !bounds) continue;

      for (const process of processes) {
        const entry = Object.entries(process).find(([type, val]: any) => {
          if (Array.isArray(val))
            return val.find((v: any) => v._attributes?.id === elementId);
          return val?._attributes?.id === elementId;
        });

        if (!entry) continue;
        const [type, value] = entry;
        const element = Array.isArray(value)
          ? value.find((v: any) => v._attributes?.id === elementId)
          : value;

        elements.push({
          id: element._attributes.id,
          name: element._attributes.name || "",
          type: element._name || type,
          position: {
            x: parseFloat(bounds.x),
            y: parseFloat(bounds.y),
            width: parseFloat(bounds.width),
            height: parseFloat(bounds.height)
          },
          raw: element,
          xmlElement: entry
        });

        break;
      }
    }

    return elements;
  };



  
  const handleEvent = useCallback((evt: any) => {
    if (evt?.type === "modeler.created") {
      const modeler = evt?.modeler;
      modelerRef.current = modeler;

      const eventBus = modeler.get("eventBus");

      eventBus.on("commandStack.changed", async () => {
        try {
          const result = await modeler.saveXML({ format: true });
          setXml(result.xml);
          const fullData = extractElementsWithFullConfig(result.xml);
          setJson(fullData);
          setBpmnElements(fullData);
        } catch (err) {
          console.error("❌ خطا در واکشی XML بعد از تغییر:", err);
        }
      });

      eventBus.on("save.done", () => {
        console.log("✅ ذخیره انجام شد");
      });

      console.log("🎯 مدلر ساخته شد:", modeler);
    }

    if (isContentSavedEvent(evt)) {
      const newXml = evt.data.xml;
      setXml(newXml);
      try {
        const fullData = extractElementsWithFullConfig(newXml);
        setJson(fullData);
        setBpmnElements(fullData);
      } catch (err) {
        console.error("❌ خطا در تحلیل XML:", err);
        setBpmnElements([]);
      }
    }
  }, []);


  const memoizedModeler = useMemo(
    () => (
      <BpmnModeler
        xml={xml}
        onEvent={handleEvent}
        modelerTabOptions={{
          propertiesPanelOptions: { hidden: false }
        }}
      />
    ),
    []
  );

  

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#000000"
      }}
    >
      <h1 style={{ textAlign: "center", margin: "16px 0" }}>
        طراحی فرآیند
      </h1>
      <div className="flex flex-row-reverse items-center justify-end gap-4 px-4">
        <input
          type="text"
          placeholder="نام فرآیند..."
          value={processName}
          onChange={(e) => setProcessName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />

        <button
          className="px-6 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 shadow-lg whitespace-nowrap"
          onClick={async () => {
            if (!xml || json.length === 0) {
              alert("⛔ مدار هنوز لود نشده!");
              return;
            }

            if (!processName.trim()) {
              alert("⚠️ لطفاً نام فرآیند را وارد کنید.");
              return;
            }

            try {
              const response = await fetch(
                `${api}/api/ControllerOne/save-process`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    nameProccess: processName.trim(),
                    json: JSON.stringify(json),
                    xml
                  })
                }
              );

              const responseText = await response.text();
              console.log("📥 پاسخ سرور:", response.status, responseText);

              if (!response.ok) {
                throw new Error(
                  `❌ خطا از سرور: ${response.status} - ${responseText}`
                );
              }
              alert("✅ فرآیند با موفقیت ذخیره شد!");
              getDataProccessinfo({nameOnly:true});
              setProcessName(""); // بعد از ذخیره، پاکش کن
            } catch (err: any) {
              console.error("❌ خطا هنگام ارسال فرآیند:", err);
              alert(`❌ ارسال به سرور با خطا مواجه شد:\n${err.message}`);
            }
          }}
        >
          ذخیره ی فرآیند
        </button>
      </div>
      <br />
      <div style={{ height: "100vh", border: "1px solid #ccc" }}>
        {memoizedModeler}
      </div>

      {/* {bpmnElements.length > 0 && (
        <div style={{ padding: "1rem", borderTop: "1px solid #888" }}>
          <h3>🧩 عناصر BPMN با مختصات + تنظیمات:</h3>
          <ul className="space-y-4">
            {bpmnElements.map((el, index) => (
              <li key={index} className="border rounded p-2 bg-gray-50 shadow-sm">
                <div className="font-semibold mb-1">
                  🧩 {el.type} - {el.name || "بدون نام"} (ID: {el.id})<br />
                  📐 [{el.position.x}, {el.position.y}, {el.position.width}, {el.position.height}]
                </div>
                <pre className="bg-white text-xs text-gray-800 p-2 rounded overflow-auto max-h-64 border border-gray-200">
                  {JSON.stringify(el.raw, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
