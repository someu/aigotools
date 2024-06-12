import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Istok_Web } from "next/font/google";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function Title() {
  const t = useTranslations("submit");

  return (
    <div className={clsx("mt-16 max-w-[1000px] mx-auto text-center")}>
      <h2
        className={clsx(
          istokWeb.className,
          "mt-10 sm:mt-16 text-3xl sm:text-5xl leading-[1.3] font-bold text-primary-800",
        )}
      >
        {t("title")}
      </h2>
      <div className="text-sm sm:text-lg mt-2 font-normal text-primary-500">
        {t("subTitle")}
      </div>
    </div>
  );
}
