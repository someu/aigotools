import clsx from "clsx";
import { ReactNode } from "react";

export default function ListItem({ children }: { children: ReactNode }) {
  return (
    <li
      className={clsx(
        "relative pl-6 font-medium mb-2",
        "before:content-start before:w-1 before:h-1 before:bg-primary-900 before:overflow-hidden before:block",
        "before:absolute before:left-3 before:top-2 before:-translate-x-[50%] before:translate-y-[50%]",
      )}
    >
      {children}
    </li>
  );
}
