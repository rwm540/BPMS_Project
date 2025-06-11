'use client';
import NewsLatterBox from "./NewsLatterBox";
import { Listbox } from '@headlessui/react'
import { useState } from 'react'



const problems = [
  { id: 1, name: 'درخواست تماس', value: 'call_request' },
  { id: 2, name: 'مشکل ورود به حساب', value: 'login_issue' },
  { id: 3, name: 'سؤال درباره فاکتور', value: 'invoice_question' },
  { id: 4, name: 'سایر موارد', value: 'other' }
]


const Contact = () => {
  const [selected, setSelected] = useState(problems[0])

  
  return (
    <>
    
    </>
//     <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
//       <div className="container">
//         <div className="-mx-4 flex flex-wrap">
//           <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
//             <div
//               className="shadow-three dark:bg-gray-dark mb-12 rounded-xs bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
//               data-wow-delay=".15s
//               "
//             >
//               <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl dark:text-white">
//                 ارسال تیکت برای پشتیبانی
//               </h2>
//               <p className="text-body-color mb-12 text-base font-medium">
//                 آرامش خیال مشتری، مأموریت ماست در سه‌نیک.
//               </p>
//               <form>
//                 <div className="-mx-4 flex flex-wrap">
//                   <div className="w-full px-4 md:w-1/2">
//                     <div className="mb-8">
//                       <label
//                         htmlFor="name"
//                         className="text-dark mb-3 block text-sm font-medium dark:text-white"
//                       >
//                        شناسه ی  کاربری
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="شماره  موبایل  خود را وارد کنید..."
//                         className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full px-4 md:w-1/2">
//   <div className="mb-8">
//     <label className="text-dark mb-3 block text-sm font-medium dark:text-white">
//      عنوان مشکلات
//     </label>
//     <Listbox value={selected} onChange={setSelected}>
//       <div className="relative">
//         <Listbox.Button className="w-full flex justify-between items-center rounded-xs border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two focus:border-primary dark:focus:border-primary">
//           <span>{selected.name}</span>
//           {/* فلش پایین */}
//           <svg
//             className="ml-2 h-5 w-5 text-gray-500 dark:text-white pointer-events-none"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             aria-hidden="true"
//           >
//             <path
//               fillRule="evenodd"
//               d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </Listbox.Button>

//         <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xs bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#2C303B] dark:text-body-color-dark">
//           {problems.map((problem) => (
//             <Listbox.Option
//               key={problem.id}
//               value={problem}
//               className={({ active }) =>
//                 `cursor-pointer select-none px-4 py-2 ${
//                   active ? 'bg-primary text-white' : 'text-gray-900 dark:text-white'
//                 }`
//               }
//             >
//               {problem.name}
//             </Listbox.Option>
//           ))}
//         </Listbox.Options>
//       </div>
//     </Listbox>
//   </div>
// </div>



//                   <div className="w-full px-4">
//                     <div className="mb-8">
//                       <label
//                         htmlFor="message"
//                         className="text-dark mb-3 block text-sm font-medium dark:text-white"
//                       >
//                         توضیحات(اختیاری)
//                       </label>
//                       <textarea
//                         name="message"
//                         rows={5}
//                         placeholder="توضیحات  خود  را وارد  کنید..."
//                         className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full resize-none rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
//                       ></textarea>
//                     </div>
//                   </div>
//                   <div className="w-full px-4">
//                     <button className="bg-primary shadow-submit hover:bg-primary/90 dark:shadow-submit-dark rounded-xs px-9 py-4 text-base font-medium text-white duration-300">
//                     ارسال
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
//             {/* <NewsLatterBox /> */}
//           </div>
//         </div>
//       </div>
//     </section>
  );
};

export default Contact;
