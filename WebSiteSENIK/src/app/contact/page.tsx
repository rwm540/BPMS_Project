import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ارسال  تیکت برای پشتیبانی",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="صفحه ی پشتیبانی"
        description="لطفا  درخواست  خود را در  قسمت توضیحات انتخاب کنید و در  قسمت توضیخات  اختیاری درخوسات  خود را توضیح دهید و شماره موبایل  خود را هم وارد کنید"
      />

      <Contact />
    </>
  );
};

export default ContactPage;
