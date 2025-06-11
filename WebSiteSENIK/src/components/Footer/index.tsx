"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="dark:bg-gray-dark relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src="/images/senik_2.png"
                    alt="logo"
                    className="w-full dark:hidden"
                    width={80}
                    height={30}
                  />
                  <Image
                    src="/images/senik_2.png"
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={80}
                    height={30}
                  />
                </Link>
                <p className="text-body-color dark:text-body-color-dark mb-9 text-base leading-relaxed">
                  آدرس: یزد، نیایش، خیابان عاصی‌زاده، خیابان سلمان فارسی
                </p>
                <div className="flex items-center">
                  <a
                    href="https://www.aparat.com/seniksystem"
                    aria-label="آپارات"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mr-6 duration-300"
                  >
                    <img
                      src="/icons8-aparat-48.png"
                      alt="آیکون آپارات"
                      width="60"
                      height="60"
                      className="fill-current"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                اینماد و مجوزها
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      انیماد
                    </Link>
                  </li>
                  <li>
                    <img
                      src="/zarinpal.svg"
                      alt="زرین  پال"
                      width="90"
                      height="50"
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  لینک های مرتبط
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/blog"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      آموزش
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/"
                      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary"
                    >
                     قیمت های  قرارداد  و  اکانت
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/about"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      درباره ی ما
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  پشتیبانی
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/contact"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      ارسال تیکت به پشتیبان
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary mb-4 inline-block text-base duration-300"
                    >
                      درباره ی ما
                    </Link>
                  </li>
                  <li>
                    <p className="text-body-color dark:text-body-color-dark mb-3 text-base leading-relaxed">
                      واحد پشتیبانی: ۰۳۵-۹۱۰۹۵۰۵۴ داخلی ۳
                    </p>
                  </li>
                  <li>
                    <p className="text-body-color dark:text-body-color-dark mb-3 text-base leading-relaxed">
                      واحد فروش: ۰۹۹۲۴۱۳۰۸۰۰ / ۰۳۵-۹۱۰۹۵۰۵۴ داخلی ۱
                    </p>
                  </li>
                  <li>
                    <p className="text-body-color dark:text-body-color-dark mb-3 text-base leading-relaxed">
                      واحد مدیریت: ۰۹۱۳۱۵۳۳۰۵۶
                    </p>
                  </li>
                  <li>
                    <p className="text-body-color dark:text-body-color-dark mb-3 text-base leading-relaxed">
                      واحد آموزش: ۰۹۱۳۰۲۳۵۰۵۰ / ۰۳۵-۳۶۲۳۹۰۵۲
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-8">
            <p className="text-body-color text-center text-base dark:text-white">
              تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت سه‌نیک می‌باشد.
            </p>
          </div>
        </div>
        <div className="absolute top-14 right-0 z-[-1]"></div>
        <div className="absolute bottom-24 left-0 z-[-1]"></div>
      </footer>
    </>
  );
};

export default Footer;
