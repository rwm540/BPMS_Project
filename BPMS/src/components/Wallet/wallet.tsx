import { useState,FC,useEffect } from "react";
import { themeChange } from "theme-change";


interface WalletProps {
  idConnect: string; // شناسه یکتای کاربر
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Wallet: FC<WalletProps> = ({ idConnect }) => {
  const [balance, setBalance] = useState<number>(0); // موجودی والت
  const [transactionAmount, setTransactionAmount] = useState<number>(0); // مقدار تراکنش
  const [transactionType, setTransactionType] = useState<string>("deposit"); // نوع تراکنش (واریز یا برداشت)

  // دریافت موجودی والت
  const getBalance = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/ControllerOne/wallet/${idConnect}`, {
        method: "GET",
        credentials: "include", // ارسال کوکی‌های JWT
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance); // دریافت موجودی از سرور
      } else {
        console.error("خطا در دریافت موجودی");
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
    }
  };

  // انجام تراکنش (واریز/برداشت)
  const handleTransaction = async () => {
    if (transactionAmount <= 0) {
      alert("مقدار تراکنش باید بزرگتر از صفر باشد");
      return;
    }

    const payload = {
      idConnect: idConnect,
      amount: transactionAmount,
      type: transactionType, // نوع تراکنش
    };

    try {
      const res = await fetch(`${baseUrl}/api/ControllerOne/wallet/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance); // بروزرسانی موجودی
        alert("تراکنش موفقیت‌آمیز بود!");
      } else {
        console.error("خطا در انجام تراکنش:", data.message);
      }
    } catch (error) {
      console.error("خطا در ارتباط با سرور:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-black mb-4">مدیریت والت</h3>

       {/* حساب انتقالی */} 
      <div className="mb-4">
        <label className="block text-black mb-2">حساب حواله ای </label>
        <div className="text-black text-xl mb-4">{idConnect}</div>
      </div>
      {/* نمایش موجودی والت */}
      <div className="mb-4">
        <label className="block text-black mb-2">موجودی فعلی:</label>
        <div className="text-black text-xl mb-4">{balance} تومان</div>
      </div>

      {/* وارد کردن مقدار تراکنش */}
      {/* <div className="mb-4">
        <label className="block text-black mb-2">مقدار تراکنش:</label>
        <input
          type="number"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
          placeholder="مقدار تراکنش"
        />
      </div> */}

      {/* انتخاب نوع تراکنش */}
      {/* <div className="mb-4">
        <label className="block text-black mb-2">نوع تراکنش:</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
        >
          <option value="deposit">واریز</option>
          <option value="withdrawal">برداشت</option>
        </select>
      </div> */}

      {/* انجام تراکنش */}
      {/* <button
        onClick={handleTransaction}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        انجام تراکنش
      </button> */}

      {/* دکمه دریافت موجودی */}
      {/* <button
        onClick={getBalance}
        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 mt-4 transition"
      >
        دریافت موجودی
      </button> */}
    </div>
  );
};

export default Wallet;
