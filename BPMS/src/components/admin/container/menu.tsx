"use client";

import { stat } from "fs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FC } from "react";
import {
  FaArrowDownWideShort,
  FaBagShopping,
  FaBarcode,
  FaBasketShopping,
  FaBloggerB,
  FaFileInvoiceDollar,
  FaGear,
  FaHouse,
  FaMoneyBillTransfer,
  FaPhoneVolume,
  FaQuestion,
  FaReadme,
  FaRegAddressCard,
  FaUpload,
  FaUserLarge,
  FaUserTie,
  FaSitemap,
  FaClipboardList,
  FaWpforms,
  FaChartBar,
  FaUsers,
  FaNetworkWired,
  FaWallet,
  FaIndustry
} from "react-icons/fa6";

interface State {
  proccess_design: boolean;
  dashboarding: boolean;
  create_forms: boolean;
  managment_proccess_design: boolean;
  powerbi: boolean;
  crm: boolean;
  hrm: boolean;
  erp: boolean;
  wallet: boolean;
  CustomerUser: boolean;
  Contract: boolean;
  TICKET: boolean;
  Reports: boolean;
  // هر مورد دیگه‌ای که قراره باشه
}

interface menuProps {
  SideBarActive: (key: keyof State) => void;
  state: {
    [key: string]: boolean;
  };
  numberProccess: string;
}

function toPersianDigits(input: string | number): string {
  return input.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

const Menu: FC<menuProps> = ({ SideBarActive, state, numberProccess }) => {
  return (
    <>
      <ul className="menu flex-nowrap overflow-x-hidden overflow-y-scroll bg-white  w-56 rounded-box h-full gap-2 shadow-md dark:shadow-slate-400">
        <li>
          <Link
            href={""}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault(); // جلوگیری از ریلود صفحه
              SideBarActive("dashboarding");
            }}
            className={`text-base ${
              state["dashboarding"]
                ? "bg-primary hover:bg-primary text-base-200"
                : "text-base-content"
            }`}
          >
            <FaHouse />
            داشبورد
          </Link>
        </li>

        {/* کیف پول */}
        <li>
          <details>
            <summary
              className={`text-base ${
                state["wallet"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaWallet />
              کیف پول
            </summary>
            <ul>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    SideBarActive("wallet");
                  }}
                  className="text-base text-base-content"
                >
                  حساب مالی شما
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    SideBarActive("wallet");
                  }}
                  className="text-base text-base-content"
                >
                  تراکنش ها
                  <span className="text-xs font-bold text-white bg-green-500 rounded-full min-w-[2rem] h-6 px-2 flex items-center justify-center whitespace-nowrap">
                    {numberProccess}
                  </span>
                </Link>
              </li>
            </ul>
          </details>
        </li>
        {/* کیف پول */}

        {/* فرآیند */}

        <li>
          <details>
            <summary
              className={`text-base ${
                state["proccess_design"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaSitemap />
              فرآیند
            </summary>
            <ul>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("proccess_design");
                  }}
                  className="text-base text-base-content"
                >
                  طراحی فرآیند
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    SideBarActive("managment_proccess_design");
                  }}
                  className="text-base text-base-content"
                >
                  مدیریت فرآیند
                  <span className="text-xs font-bold text-white bg-green-500 rounded-full min-w-[2rem] h-6 px-2 flex items-center justify-center whitespace-nowrap">
                    {numberProccess}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/list"}
                  className="text-base text-base-content"
                >
                  نقشه فرآیند سازمانی
                </Link>
              </li>
            </ul>
          </details>
        </li>

        {/* فرآیند */}

        {/* گزارش پیگیری */}
        <li>
          <details>
            <summary
              className={`text-base ${
                state["x"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaClipboardList />
              گزارش پیگیری
            </summary>
            <ul>
              <li>
                <Link
                  href={"/admin/admin/add"}
                  className="text-base text-base-content"
                >
                  تحلیل فرآیند
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/edit"}
                  className="text-base text-base-content"
                >
                  گزارش عملکرد
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/list"}
                  className="text-base text-base-content"
                >
                  گزارش ساز پویا
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/list"}
                  className="text-base text-base-content"
                >
                  گزارشات سازمانی
                </Link>
              </li>
            </ul>
          </details>
        </li>

        {/* گزارش پیگیری */}

        {/* فرم */}
        <li>
          <details>
            <summary
              className={`text-base ${
                state["create_forms"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaWpforms />
              فرم
            </summary>
            <ul>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("create_forms");
                  }}
                  className="text-base text-base-content"
                >
                  طراحی فرم
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/edit"}
                  className="text-base text-base-content"
                >
                  مدیریت فرم
                </Link>
              </li>
              <li>
                <Link
                  href={"/admin/admin/list"}
                  className="text-base text-base-content"
                >
                  زمان بندی
                </Link>
              </li>
              <li>
                <details className="text-black">
                  <summary className="cursor-pointer text-blue-400 [&::-webkit-details-marker]:text-black">
                    برنامه ریزی
                  </summary>
                  <ul className="pl-4">
                    <li>
                      <a className="text-sm  text-blue-400">زمان بندی</a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </details>
        </li>

        {/* فرم */}

        {/* CRM */}

        <li>
          <details>
            <summary
              className={`text-base ${
                state["crm"] ||
                state["CustomerUser"] ||
                state["Contract"] ||
                state["Crm_CreateForm"] ||
                state["TICKET"] ||
                state["Reports"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaUserTie />
              CRM
            </summary>
            <ul>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("crm");
                  }}
                  className="text-base text-base-content"
                >
                  گروه بندی کاربران
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("CustomerUser");
                  }}
                  className="text-base text-base-content"
                >
                  تعریف مشتری
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("Contract");
                  }}
                  className="text-base text-base-content"
                >
                  قرار دادها
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("TICKET");
                  }}
                  className="text-base text-base-content"
                >
                  تعریف تیکت
                </Link>
              </li>
              <li>
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("Reports");
                  }}
                  className="text-base text-base-content"
                >
                  گزارشات
                </Link>
              </li>
            </ul>
          </details>
        </li>

        {/* CRM */}

        {/* POER BI */}
        <li
          className={`text-base rounded-lg ${
            state["powerbi"]
              ? "bg-primary hover:bg-primary text-base-200"
              : "text-base-content"
          }`}
        >
          <Link
            href={""}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault(); // جلوگیری از ریلود صفحه
              SideBarActive("powerbi");
            }}
          >
            <FaChartBar />
            POWER BI
          </Link>
        </li>
        {/* POER BI */}

        {/* حسابداری صنعتی */}

        <li>
          <Link
            href={""}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault(); // جلوگیری از ریلود صفحه
              SideBarActive("dashboarding");
            }}
            className={`text-base ${
              state["dashboarding"]
                ? "bg-primary hover:bg-primary text-base-200"
                : "text-base-content"
            }`}
          >
            <FaIndustry />
            حسابداری صنعتی
          </Link>
        </li>
        {/* حسابداری صنعتی */}

        {/* Human Resources */}
        <li>
          <details>
            <summary
              className={`text-base ${
                state["erp"] || state["hrm"]
                  ? "bg-primary hover:bg-primary text-base-200"
                  : "text-base-content"
              }`}
            >
              <FaClipboardList />
              منابع انسانی
            </summary>
            <ul>
              <li className="text-base text-base-content">
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("erp");
                  }}
                >
                  <FaNetworkWired />
                  ERP
                </Link>
              </li>
              <li className="text-base text-base-content">
                <Link
                  href={""}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault(); // جلوگیری از ریلود صفحه
                    SideBarActive("hrm");
                  }}
                >
                  <FaUsers />
                  HRM
                </Link>
              </li>
            </ul>
          </details>
        </li>
        {/* Human Resources */}
      </ul>
    </>
  );
};
export default Menu;
