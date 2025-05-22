import { useEffect, type FC, useState } from "react";
import Menu from "./menu";
import Drawer from "./drawer";

import Navbar from "./navbar";
import { themeChange } from "theme-change";
import Information from "./information";
import TopChart from "@Component/admin/dashboard/topChart";

/*  Proccess Design  طراحی  فرآیند  */
import ProccessDesgin from "../../ProccessDeisgn/ProccessDesign";
import ManageProccess from "../../ProccessDeisgn/ManageProccess";
import PorweBI from "../../Pwerbi/powerbi";
import MenuGoupUsers from "src/components/CRM/MenuGroupUsers";
import MenuDefineCustomer from "src/components/CRM/MenuCustomerUsers";
import MenuContract from "../../CRM/MenuContract";
import Wallet from "../../Wallet/wallet";
import CreateForm from "../CreateForm/createform";
import LoadingFrom from "../../Loading/Loadingdashboard";
// import Dashboard from "src/app/admin/dashboard/page";
import TicketDefine from "src/components/CRM/TicketDefine";
import MenuReports from "src/components/CRM/MenuReports";

interface containerProps {
  children: React.ReactNode;
  search?: boolean;
  breadcrumb?: boolean;
}

const api = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Containerpage {
  IdConnect:string;
}

const Container: FC<Containerpage> = ({ IdConnect }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [processList, setProcessList] = useState<any[]>([]);

  useEffect(() => {
    // شبیه‌سازی بارگذاری داده‌ها
    const loadData = async () => {
      // فرض کنید از اینجا داده‌ها را بارگذاری می‌کنید
      await new Promise((resolve) => setTimeout(resolve, 100)); // شبیه‌سازی تاخیر
      setIsLoading(false); // به محض بارگذاری داده‌ها، لودینگ را غیر فعال کنید
    };
    getDataProccess({nameOnly:true});
    loadData();
  }, []);

  useEffect(() => {
    themeChange(false);
  }, []);

  // تعریف وضعیت‌ها در useState
  const [state, setState] = useState({
    dashboarding: true,
    create_forms: false,
    proccess_design: false,
    managment_proccess_design: false,
    powerbi:false,
    crm:false,
    hrm:false,
    erp:false,
    wallet:false,
    CustomerUser:false,
    Contract:false,
    Crm_CreateForm:false,
    TICKET:false,
    Reports:false

  });

  // تابع برای تغییر مقدار وضعیت‌ها
  const SideBarActive = (key: keyof typeof state) => {
    setState((prev) => {
      if (prev[key] === true) {
        // اگه همون کلید همین الآن فعاله، هیچ کاری نکن
        return prev;
      }
      const entries = Object.keys(prev).map((k) => {
        return [k, k === key];
      });
      return Object.fromEntries(entries) as typeof prev;
    });
  };

  /* گرفتن فرآیند */
  const getDataProccess = async (options: { nameOnly?: boolean; allProccess?: boolean } = {}) => {
    const { nameOnly = false, allProccess = false } = options;
  
    const queryParams = new URLSearchParams();
    if (nameOnly) queryParams.append("nameOnly", "true");
    if (allProccess) queryParams.append("allProccess", "true");
  
    const url = `${api}/api/ControllerOne/get-processes?${queryParams.toString()}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (!res.ok) throw new Error("❌ خطا در واکشی فرآیندها");
  
      setProcessList(data);
      // console.log(data);
    } catch (error) {
      console.error("🚨 خطا در دریافت لیست فرآیندها:", error);
    } finally {
      setIsLoading(false);
    }
  };
  /* گرفتن فرآیند */


   /* Logout pages  */
   const logout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/ControllerOne/logout`, {
        method: "POST",
        credentials: "include"
      });
  
      if (!res.ok) {
        throw new Error("⛔ خروج از سیستم با خطا مواجه شد.");
      }
      const data = await res.json();
      window.location.href = "/"; 
    } catch (err: any) {
      console.error("🚨 logout error:", err);
    }
  };
  /* Logout pages  */
  

  return (
    <div className="h-dvh w-full fixed">
      <div className="w-full h-auto">
        <Navbar logout={logout} />
      </div>
      <div className="containerStyle flex gap-4 pr-4 pl-4 pt-3">
        <div className="flex-none h-full hidden lg:block">
          <Menu SideBarActive={SideBarActive} state={state} numberProccess={processList.length.toLocaleString("fa-IR")} />
          <Drawer SideBarActive={SideBarActive} />
        </div>

        <div className="grow h-full bg-white rounded-box p-4 overflow-x-hidden overflow-y-scroll shadow-md dark:shadow-slate-400">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="scale-150">
                <LoadingFrom />
              </div>
            </div>
          ) : (
            <>
              {state.dashboarding ? (
                <h1 className="text-black">خوش آمدید</h1>
              ) : state.proccess_design ? (
                <ProccessDesgin getDataProccessinfo={getDataProccess} />
              ) : state.create_forms ? (
                <CreateForm />
              ) : state.managment_proccess_design ? (
                <ManageProccess 
                  getDataProccessinfo={getDataProccess}
                  processListinfo={processList}
                 />
              ) : state.powerbi ? (
                  <PorweBI />
              ) : state.crm  ? (
                  <MenuGoupUsers />
              ) : state.CustomerUser ? (
                  <MenuDefineCustomer />
              ) : state.Contract ? (
                  <MenuContract />
              ) : state.erp ? (
                <div className="text-black">ERP :: TOEKN</div>
              ) : state.hrm ? (
                <div className="text-black">HRM ::: OPEN</div>
              ) :state.wallet ? (
                  <Wallet idConnect={IdConnect}/>
              ) : state.TICKET ? (
                <TicketDefine  />
              ) : state.Reports ? (
                <MenuReports />
              )  :  (
                <h1 className="text-black">خوش آمدید</h1>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Container;
