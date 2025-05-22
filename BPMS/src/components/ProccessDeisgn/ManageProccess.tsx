import { FC, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { FaSitemap } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { xml2js } from "xml-js";
import { isContentSavedEvent } from "@miragon/camunda-web-modeler";

const api = process.env.NEXT_PUBLIC_API_BASE_URL;

// Dynamic import با کلید برای جلوگیری از ریندر ناخواسته
const BpmnModeler = dynamic(
  () => import("@miragon/camunda-web-modeler").then((m) => m.BpmnModeler),
  {
    ssr: false,
    loading: () => <div>در حال بارگذاری مدلر...</div>
  }
);

interface ManageProccessinfo {
  getDataProccessinfo: (options: {
    nameOnly?: boolean;
    allProccess?: boolean;
  }) => void;
  processListinfo: {
    id: number;
    nameProccess: string;
    xml: string;
    json: string;
  }[];
}

const ManageProccess: FC<ManageProccessinfo> = ({
  getDataProccessinfo,
  processListinfo
}) => {
  const [IdSecuration, setIdSecuration] = useState(0);
  const [nameProccessyou, setProcessNameyou] = useState("");
  const [xmlServer, setXmlServer] = useState("");
  const [json, setJson] = useState<any[]>([]);
  const [bpmnElements, setBpmnElements] = useState<any[]>([]);
  const modelerRef = useRef<any>(null);
  const modelerKey = useRef(Date.now()); // کلید منحصر به فرد برای مدلر

  useEffect(() => {
    getDataProccessinfo({ allProccess: true });
  }, []);

  // تابع استخراج عناصر با استفاده از useCallback برای جلوگیری از ریندرهای اضافی
  const extractElementsWithFullConfig = useCallback((xml: string): any[] => {
    try {
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

          if (entry) {
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
      }
      return elements;
    } catch (error) {
      console.error("خطا در تجزیه XML:", error);
      return [];
    }
  }, []);

  // هندلر رویدادها با useCallback
  const handleEvent = useCallback(
    (evt: any) => {
      if (evt?.type === "modeler.created") {
        const modeler = evt?.modeler;
        modelerRef.current = modeler;

        const eventBus = modeler.get("eventBus");

        const handleCommandStackChanged = async () => {
          try {
            const result = await modeler.saveXML({ format: true });
            setXmlServer(result.xml);
            const fullData = extractElementsWithFullConfig(result.xml);
            setJson(fullData);
            setBpmnElements(fullData);
          } catch (err) {
            console.error("خطا در ذخیره XML:", err);
          }
        };

        eventBus.on("commandStack.changed", handleCommandStackChanged);
        eventBus.on("save.done", () => console.log("✅ ذخیره انجام شد"));

        return () => {
          eventBus.off("commandStack.changed", handleCommandStackChanged);
        };
      }

      if (isContentSavedEvent(evt)) {
        try {
          const newXml = evt.data.xml;
          setXmlServer(newXml);
          const fullData = extractElementsWithFullConfig(newXml);
          setBpmnElements(fullData);
        } catch (err) {
          console.error("خطا در پردازش XML:", err);
        }
      }
    },
    [extractElementsWithFullConfig]
  );

  // کامپوننت مدلر با مدیریت کلید
  const memoizedModeler = useMemo(
    () => (
      <BpmnModeler
        key={modelerKey.current}
        xml={xmlServer}
        onEvent={handleEvent}
        className="h-[600px] border rounded-lg shadow-lg"
      />
    ),
    [xmlServer, handleEvent]
  );

  const UpdateProccess = async (id: number) => {
    try {
      const updatedProcess = {
        id,
        nameProccess: nameProccessyou,
        xml: xmlServer,
        json: JSON.stringify(json)
      };

      const response = await fetch(
        `${api}/api/ControllerOne/update-process/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProcess)
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log("پاسخ سرور:", data);

      // به جای پاک کردن state، کلید مدلر را به روز کنید
      modelerKey.current = Date.now();
      setIdSecuration(0);
      setProcessNameyou("");
      getDataProccessinfo({ allProccess: true });
      alert("✅ فرآیند با موفقیت به روز شد!");
    } catch (error: any) {
      console.error("خطا در به روزرسانی:", error);
      alert(error.message || "خطا در به روزرسانی");
    }
  };

  const Del_Proccess = async (id: number) => {
    try {
      const response = await fetch(
        `${api}/api/ControllerOne/delete-process/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) throw new Error(await response.text());

      setIdSecuration(0);
      getDataProccessinfo({ allProccess: true });
      alert("✅ فرآیند با موفقیت حذف شد!");
    } catch (error: any) {
      console.error("خطا در حذف:", error);
      alert(error.message || "خطا در حذف فرآیند");
    }
  };

  return (
    <div className="container mx-auto p-6 text-black">
      {IdSecuration > 0 ? (
        <div className="bg-white rounded-lg shadow-xl p-6 text-black">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setIdSecuration(0);
                modelerKey.current = Date.now();
              }}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              بازگشت
            </button>

            <input
              value={nameProccessyou}
              onChange={(e) => setProcessNameyou(e.target.value)}
              placeholder="نام فرآیند را تغییر دهید..."
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-4">
              <button
                onClick={() => UpdateProccess(IdSecuration)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ذخیره تغییرات
              </button>
              <button
                onClick={() => Del_Proccess(IdSecuration)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف فرآیند
              </button>
            </div>
            <div
              className="relative mx-auto"
              style={{
                width: "95vw", // 95 درصد عرض viewport
                height: "95vh", // 95 درصد ارتفاع viewport
                maxWidth: "95%", // حداکثر عرض 95 درصد والد (برای اطمینان)
                maxHeight: "95%", // حداکثر ارتفاع 95 درصد والد
                boxSizing: "border-box"
              }}
            >
              {memoizedModeler}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {processListinfo.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setIdSecuration(p.id);
                setXmlServer(p.xml);
                setProcessNameyou(p.nameProccess);
                modelerKey.current = Date.now();
              }}
              className="p-6 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <FaSitemap className="text-3xl mb-3 text-blue-600" />
              <h3 className="text-xl font-semibold text-black">
                {p.nameProccess}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProccess;
