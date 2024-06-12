import clsx from "clsx";
import { Istok_Web } from "next/font/google";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function DashboardTitle({ title }: { title?: string }) {
  return (
    <h2
      className={clsx(istokWeb.className, "text-2xl font-no text-primary-800")}
    >
      {title}
    </h2>
  );
}
