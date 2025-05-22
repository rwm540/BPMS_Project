"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../src/components/Loading/Loading";
import Messages from "../ErrorANDSuccess/Messagedebuger";

const DashboardPage = dynamic(
  () => import("@Page/admin/dashboard/dashboardPage"),
  {
    loading: () => <Loading />,
    ssr: false
  }
);

interface Toast {
  id: number;
  type: "error" | "success";
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [loging, setlogin] = useState(false);
  const [signup, setsingup] = useState(true);
  const [code_veryfive, setcode_veryfive] = useState(false);
  const [Loaded, setLoaded] = useState(true);
  const [ConnectDashboard, setConnectDashboard] = useState(false);
  const [mobile, setMobile] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [IdConnect,setIdConnect] = useState("");

  /* گرفتن jwt , cookie  */
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      // 👇 بررسی وجود کوکی visible
      if (!document.cookie.includes("hasSession=true")) {
        return; // ❌ هیچ ریکوئستی نزن
      }
  
      try {
        const res = await fetch(`${baseUrl}/api/ControllerOne/me`, {
          method: "GET",
          credentials: "include"
        });
  
        const data = await res.json();
        setIdConnect(data.idConnect);
        if (!data.authenticated) return;
  
        setUser(data);
        setConnectDashboard(true);
      } catch {
        // ساکت
      }
    };
  
    getUser();
  }, []);
  
  /* گرفتن jwt , cookie  */

  useEffect(() => {
    setLoaded(false);
  }, [Loaded]);

  const showToast = (type: "error" | "success", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // داخل کامپوننت اصلی:
  //برای کنترل  زمان  و  ساعت
  const TimeveryFive = useRef(30);
  const [countdown, setCountdown] = useState(TimeveryFive.current);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setsingup(true);
          setTimerActive(false);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]); // ← فقط به این وابسته باشه

  /* Registration for each  user  */
  const Registration = async (mobile: string) => {
    const payload = {
      phone: mobile,
      username: "",
      firstName: "",
      lastName: "",
      codeMeli: "0000000000",
      codeVeryFive: "",
      idConnect: ""
    };

    const url = `${baseUrl}/api/ControllerOne/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", `کاربر با شماره ${mobile} ثبت شد`);
        setsingup(false);
        setlogin(false);
        setcode_veryfive(true);
      }
      else {
        showToast("error", data.message || "خطا در ثبت‌ نام");
      }
    } catch (err) {
      showToast("error", "ارتباط با سرور برقرار نشد");
    }
  };
  /* Registration for each  user  */

  /* Login for each user */
  const Login = async (mobile: string) => {
    const url = `${baseUrl}/api/ControllerOne/login`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // مهم برای ست کردن کوکی JWT
        body: JSON.stringify({ phone: mobile })
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", "✅ ورود با موفقیت انجام شد");
        setcode_veryfive(true); // فعال‌سازی بخش وارد کردن کد
        setsingup(false);
        setlogin(false);
        setCountdown(TimeveryFive.current);
        setTimerActive(true);
        // اگه خواستی کد تایید جدید رو هم نشون بده
        console.log("🔐 کد تایید سرور:", data.codeVeryFive);
      }
      else {
        showToast("error", data.message || "❌ خطا در ورود");
      }
    } catch (err) {
      showToast("error", "❌ خطا در ارتباط با سرور");
    }
  };
  /* Login for each user */

  /* Logout pages  */
  const logout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/ControllerOne/logout`, {
        method: "POST",
        credentials: "include"
      });
      const data = await res.json();
      //console.log(data);
      setTimerActive(false);
      setsingup(true);
      setlogin(false);
      setLoaded(true);
    } catch (err) {
      showToast("error", `${err}`);
    }
  };
  
  /* Logout pages  */

  /* Code Very Five */
  const VerifyCode = async (mobile: string, verifyCode: string) => {
    const url = `${baseUrl}/api/ControllerOne/verify-code`;
  
    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: mobile.trim(),
          codeVeryFive: verifyCode.trim()
        })
      });
  
      const data = await res.json();
      setIdConnect(data.user.idConnect);
      if (res.ok) {
        showToast("success", "✅ کد تایید با موفقیت تایید شد و ورود انجام شد");
  
        setConnectDashboard(true);
        setsingup(false);
        setlogin(false);
        setcode_veryfive(false);
        
        // ✅ متوقف کردن تایمر کد تأیید:
        setTimerActive(false); // ⬅️ این خط حیاتی‌ـه
      } else {
        showToast("error", data.message || "⛔ تایید کد با خطا مواجه شد");
      }
    } catch (err) {
      showToast("error", "⛔ خطا در ارتباط با سرور هنگام تایید کد");
    }
  };
  /* Code Very Five */

  if (Loaded) return <Loading />;

  return (
    <>
      {ConnectDashboard ? (
       <DashboardPage IdConnect={IdConnect}  />
      ) : (
        <div
          className="min-h-screen flex flex-col items-center justify-center relative"
          style={{
            backgroundImage: "url('/bpms1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute top-8 z-50 w-full flex flex-col items-center space-y-2">
            <AnimatePresence>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Messages
                    error_set={toast.type === "error"}
                    success_set={toast.type === "success"}
                    Message={toast.message}
                    className={
                      toast.type === "error" ? "text-red-600" : "text-green-600"
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {loging && (
            <motion.div
              dir="rtl"
              className="bg-black/80 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-right z-10 mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {/* <h2 className="text-2xl text-white font-bold text-center mb-6">
                خوش اومدی دوباره
              </h2> */}
              <form className="space-y-5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="شماره موبایل"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-right"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!mobile.trim()) {
                      showToast("error", "شماره موبایل نمی‌تواند خالی باشد");
                      return;
                    }
                    Login(mobile.trim()); // ← اینو اضافه کن
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  ورود
                </button>
              </form>
              <p className="text-center text-white text-sm mt-4">
                حساب نداری؟{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setsingup(true);
                    setlogin(false);
                    setLoaded(true);
                  }}
                  className="text-indigo-400 hover:underline"
                >
                  ثبت‌نام
                </a>
              </p>
            </motion.div>
          )}

          {signup && !loging && (
            <motion.div
              className="bg-black/80 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-right mt-6"
              dir="rtl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl text-[#FFFFFF] font-bold text-center mb-6">
                ساخت حساب کاربری
              </h2>
              <form className="space-y-5">
                <input
                  type="text"
                  inputMode="numeric" // موبایل و کیبورد عددی در موبایل
                  pattern="[0-9]*" // فقط رقم (برای مرورگر)
                  placeholder="شماره موبایل"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    // فقط ارقام فارسی یا انگلیسی
                    if (/^[0-9]*$/.test(value)) {
                      setMobile(value);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-right"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!mobile.trim()) {
                      showToast("error", "شماره موبایل نمی‌تواند خالی باشد");
                      return;
                    }
                    setCountdown(TimeveryFive.current);
                    setTimerActive(true);
                    Registration(mobile.trim());
                  }}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  ثبت‌نام
                </button>
              </form>
              <p className="text-center text-[#FFFFFF] text-sm text-gray-500 mt-4">
                قبلاً حساب ساختی؟{" "}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setLoaded(true);
                    setsingup(false);
                    setlogin(true);
                  }}
                  className="text-teal-600 hover:underline"
                >
                  ورود
                </a>
              </p>
            </motion.div>
          )}

          {code_veryfive && !signup && !loging && (
            // داخل JSX اون بخش
            <motion.div
              className="bg-black/80 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-right mt-6"
              dir="rtl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl text-[#FFFFFF] font-bold text-center mb-6">
                کد تایید خود را وارد کنید
              </h2>
              <form className="space-y-5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="کد تایید"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-center"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();

                    if (!verifyCode.trim()) {
                      showToast("error", "کد تایید الزامی است");
                      return;
                    }

                    if (!mobile.trim()) {
                      showToast("error", "شماره موبایل مشخص نیست!");
                      return;
                    }

                    VerifyCode(mobile.trim(), verifyCode.trim()); // ← الان هر دو پارامتر داده می‌شه
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  تایید
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="inline-flex text-white items-center px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:text-red-700 transition duration-200 font-medium"
                >
                  انصراف
                </button>
              </p>
              <br />
              {countdown > 0 ? (
                <div className="flex justify-center items-center mb-6">
                  <div className="relative w-16 h-16">
                    <svg className="absolute top-0 left-0 w-full h-full">
                      <circle
                        className="text-gray-300"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className="text-teal-400 transition-all duration-1000"
                        strokeWidth="4"
                        strokeDasharray={176}
                        strokeDashoffset={(1 - countdown / 30) * 176}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="28"
                        cx="32"
                        cy="32"
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "50% 50%"
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      {countdown}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white mb-6 font-semibold">
                  ⏳ در حال انتقال به ثبت‌نام...
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
