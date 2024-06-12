"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Languages } from "@/lib/locales";
import { usePathname, useRouter } from "@/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Dropdown classNames={{ content: "!min-w-24 bg-primary-100 shadow" }}>
      <DropdownTrigger>
        <Globe className="text-primary cursor-pointer" size={16} />
      </DropdownTrigger>
      <DropdownMenu
        selectionMode="single"
        onSelectionChange={(key) => {
          const targetlocale = Array.from(key)[0] as string | undefined;

          if (!targetlocale) {
            return;
          }

          router.replace(`${pathname}?${searchParams.toString()}`, {
            locale: targetlocale,
          });
        }}
      >
        {Languages.map((language) => (
          <DropdownItem key={language.lang}>{language.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
