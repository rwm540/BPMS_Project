import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="درباره ی  ما"
        description="گروه نرم‌افزاری سه نیک با سال‌ها تجربه در زمینه طراحی و توسعه سیستم‌های مالی و حسابداری، راهکارهای جامع و یکپارچه‌ای را برای کسب‌وکارها ارائه می‌دهد. این گروه با بهره‌گیری از تخصص حسابداران حرفه‌ای و مهندسان نرم‌افزار، نرم‌افزارهایی با کارایی بالا، انعطاف‌پذیر و متناسب با نیاز بازار طراحی می‌کند تا به رشد و توسعه سازمان‌ها کمک کند."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
