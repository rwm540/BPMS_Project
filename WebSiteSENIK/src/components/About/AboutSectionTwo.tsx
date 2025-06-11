import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-25/24 max-w-[600px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/About.png"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/About.png"
                alt="about image"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                درباره سه نیک
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                مهندس محمدصادق پاکزاد از سال ۱۳۷۳ در عرصه نرم افزار های حسابداری شروع ب فعالیت کردند و نرم افزار حسابداری امین و آریا را تحت سیستم عامل DOS طراحی و تولید کردند.شرکت آما پردازش ایساتیس نیز در سال 1387 به منظور فعالیت در زمینه تولید نرم افزارهای مالی توسط مهندس محمدصادق پاکزاد تاسیس گرديد و راه پر فراز و نشیب رشد و پیشرفت در اين عرصه را به منظور کسب تجربه و خدمت به پیشرفت تکنولوژي در کشور با همراهی مديران و متخصصین علوم فناوري اطلاعات و حسابداری پیموده است .در سال 1401به علت بعضی تغییرات در هیئت مدیره شرکت جدیدی به نام شرکت به آما پردازش فرتاک تاسیس شد و با همان رویکرد روبه جلو ب کار خورد ادامه میدهد.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                اهداف سیستم یکپارچه سه نیک
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                گروه نرم افزاری سه نیک با تشکیل تیمی تخصصی و متبحر در زمینه های مالی – نرم افزاری و سخت افزاری مفتخر است تا بهترین مشاوره ها در زمینه مکانیزاسیون سیستم های مالی و اداری به شما ارائه نماید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
