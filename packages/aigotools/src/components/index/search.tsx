"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { History, SearchIcon, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import Container from "@/components/common/container";

export default function Search({
  defaultSearch,
  className,
}: {
  defaultSearch?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultSearch || "");
  const router = useRouter();

  const t = useTranslations("index");

  const [histories, setHistories] = useState([] as string[]);

  const loadHistories = useCallback(() => {
    try {
      setHistories(JSON.parse(window.localStorage.getItem("histories") || ""));
    } catch {}
  }, []);

  const saveHistories = useCallback(
    (newRecord: string) => {
      window.localStorage.setItem(
        "histories",
        JSON.stringify([newRecord, ...histories].slice(10)),
      );
      loadHistories();
    },
    [histories, loadHistories],
  );

  const clearHistories = useCallback(() => {
    window.localStorage.setItem("histories", JSON.stringify([]));
    loadHistories();
  }, [loadHistories]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const history = (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <History
          className="text-primary-400 hover:text-default-foreground transition-all cursor-pointer"
          size={16}
          strokeWidth={3}
        />
      </DropdownTrigger>
      <DropdownMenu>
        {
          histories.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={() => {
                setValue(item);
                router.push(`/search?s=${encodeURIComponent(item)}`);
              }}
            >
              {item}
            </DropdownItem>
          )) as any
        }
        <DropdownItem onClick={() => clearHistories()}>
          <Button
            className="w-full"
            color="danger"
            size="sm"
            startContent={<Trash2 size={14} strokeWidth={3} />}
          >
            {t("clearAll")}
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <Container className={clsx("mt-10 sm:mt-16", className)}>
      <div className="max-w-[600px] mx-auto text-center relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveHistories(value);
            router.push(`/search?s=${encodeURIComponent(value)}`);
          }}
        >
          <Input
            classNames={{
              input:
                "text-center font-semibold placeholder:transition-all placeholder:text-primary-300 placeholder:font-semibold group-hover:placeholder:text-primary-400 group-data-[focus=true]:placeholder:text-primary-400",
              mainWrapper: "group",
              inputWrapper: "!border-primary-900",
            }}
            endContent={history}
            placeholder={t("searchPlaceholder")}
            radius="full"
            size="lg"
            startContent={
              <SearchIcon
                className="text-primary-900 group-hover:text-primary-400 group-data-[focus=true]:text-default-foreground transition-all"
                size={16}
                strokeWidth={3}
              />
            }
            value={value}
            variant="bordered"
            onValueChange={setValue}
          />
        </form>
      </div>
    </Container>
  );
}
