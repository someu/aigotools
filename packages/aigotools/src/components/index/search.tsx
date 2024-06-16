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
import { useQuery } from "@tanstack/react-query";

import CategoryTag from "./cateogry-tag";

import { getFeaturedCategories } from "@/lib/actions";
import { Link, useRouter } from "@/navigation";
import Container from "@/components/common/container";

export default function Search({
  defaultSearch,
  category,
  className,
}: {
  defaultSearch?: string;
  category?: string;
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
        JSON.stringify([newRecord, ...histories].slice(10))
      );
      loadHistories();
    },
    [histories, loadHistories]
  );

  const clearHistories = useCallback(() => {
    window.localStorage.setItem("histories", JSON.stringify([]));
    loadHistories();
  }, [loadHistories]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const { data: featuredCategories = [] } = useQuery({
    queryKey: ["all-featured-categories"],
    async queryFn() {
      return await getFeaturedCategories();
    },
  });

  const history = histories.length ? (
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
  ) : null;

  return (
    <Container className={clsx("mt-10 sm:mt-16", className)}>
      <div className="max-w-[600px] mx-auto text-center relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveHistories(value);
            let url = `/search?s=${encodeURIComponent(value)}`;

            if (category) {
              url += `&c=${encodeURIComponent(category)}`;
            }
            router.push(url);
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
      {featuredCategories.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {featuredCategories.map((item) => {
            return (
              <CategoryTag
                key={item._id}
                active={item.name === category}
                onClick={() => {
                  const url = `/search?s=${encodeURIComponent(
                    value
                  )}&c=${encodeURIComponent(item.name)}`;

                  router.push(url);
                }}
              >
                {[item.icon, item.name].filter(Boolean).join(" ")}
              </CategoryTag>
            );
          })}
          <Link href={"/categories"}>
            <CategoryTag>{t("more")}</CategoryTag>
          </Link>
        </div>
      )}
    </Container>
  );
}
