import { Brand } from "@/types/brand";
import Image from "next/image";
import brandsData from "./brandsData";

export type Brandlefting = {
  id: number;
  name: string;
  href: string;
  image?: string;
  imageLight?: string;
};

const Brands = () => {
  return (
    <section className="pt-16">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="bg-gray-light dark:bg-gray-dark flex flex-wrap items-center justify-center rounded-xs px-8 py-8 sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px] 2xl:px-[70px] 2xl:py-[60px]">
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, imageLight, name } = brand;

  return (
    <div className="flex w-1/2 items-center justify-center px-3 py-[15px] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative h-30 w-full opacity-70 transition hover:opacity-100 dark:opacity-60 dark:hover:opacity-100"
        style={{ aspectRatio: "3 / 1" }} // نسبت عرض به ارتفاع مناسب آیکون‌ها
      >
        {imageLight && (
          <Image
            src={imageLight}
            alt={name}
            fill
            style={{ objectFit: "contain" }}
            className="hidden dark:block"
            priority
          />
        )}

        {image && (
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "contain" }}
            className="block dark:hidden"
            priority
          />
        )}
      </a>
    </div>
  );
};
