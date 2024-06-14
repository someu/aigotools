import clsx from "clsx";
import { ReactNode } from "react";

export default function CategoryTag({
  children,
  onClick,
  active,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-block px-2 py-1 rounded bg-blue-500 text-white hover:px-4 hover:rounded-none hover:bg-blue-700 text-sm font-medium cursor-pointer transition-all",
        className,
        {
          "!bg-blue-700": active,
        }
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
