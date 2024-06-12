import clsx from "clsx";
import React from "react";

export default function Container({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full max-w-[1480px] box-border mx-auto px-4 sm:px-6",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
}
