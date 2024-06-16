"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import CategoryEdit from "./category-edit";
import CategoryOperation from "./category-operation";

import { CategorySearchForm, managerSearchCategories } from "@/lib/actions";
import Loading from "@/components/common/loading";
import EmptyImage from "@/components/search/empty-image";
import { Category } from "@/models/category";
import { createTemplateCategory } from "@/lib/create-template-category";

export default function CategoryTable() {
  const t = useTranslations("categoryManage");
  const [searchResult, setSearchResult] = useState({
    categories: [] as Category[],
    count: 0,
    totalPage: 0,
  });
  const [category, setCategory] = useState<Category | undefined>(undefined);

  const [loading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<CategorySearchForm>({
    page: 1,
    size: 15,
  });

  const handleSearch = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setIsLoading(true);

      const result = await managerSearchCategories(searchParams);

      setSearchResult(result);
    } catch (error) {
      console.log(error);
      toast.error(t("failSearch"));
    } finally {
      setIsLoading(false);
    }
  }, [loading, searchParams, t]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { data: allTopCategories } = useQuery({
    queryKey: ["get-top-categories"],
    queryFn: async () => {
      const res = await managerSearchCategories({
        page: 1,
        size: 999,
        type: "top",
      });

      return res.categories;
    },
    initialData: [],
  });

  const topCategoryNameMap = useMemo(() => {
    return allTopCategories.reduce((t, c) => {
      return {
        ...t,
        [c._id]: c.name,
      };
    }, {} as Record<string, string>);
  }, [allTopCategories]);

  console.log(topCategoryNameMap);

  return (
    <div className="mt-4 relative py-4">
      <div
        className="flex items-center justify-end gap-4"
        onSubmit={handleSearch}
      >
        <Button
          size="sm"
          startContent={<Plus size={14} />}
          onClick={() => setCategory(createTemplateCategory())}
        >
          {t("new")}
        </Button>
        <div className="flex-1" />
        <Select
          className="w-48"
          placeholder={t("categoryLevel")}
          size="sm"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              type: e.target.value as any,
              page: 1,
            })
          }
        >
          <SelectItem key="top">{t("topLevel")}</SelectItem>
          <SelectItem key="second">{t("secondaryLevel")}</SelectItem>
        </Select>
        {searchParams.type === "second" && (
          <Select
            className="w-48"
            placeholder={t("parentCategory")}
            size="sm"
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                parent: e.target.value as any,
                page: 1,
              })
            }
          >
            {allTopCategories.map((category) => {
              return (
                <SelectItem key={category._id}>{category.name}</SelectItem>
              );
            })}
          </Select>
        )}
        <Input
          className="w-96"
          placeholder={t("inputSearch")}
          size="sm"
          onChange={debounce(
            (e) =>
              setSearchParams({
                ...searchParams,
                search: e.target.value,
                page: 1,
              }),
            1000,
            {
              maxWait: 5000,
            }
          )}
        />
      </div>
      <div className="mt-6 relative">
        <Table className="mt-6" shadow="sm">
          <TableHeader>
            <TableColumn>{t("categoryName")}</TableColumn>
            <TableColumn>{t("weight")}</TableColumn>
            <TableColumn>{t("featured")}</TableColumn>
            <TableColumn>{t("parentCategory")}</TableColumn>
            <TableColumn maxWidth={160}>{t("updatedAt")}</TableColumn>
            <TableColumn maxWidth={160}>{t("operation")}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="w-full flex py-60 items-center justify-center">
                <EmptyImage className="dark:invert" />
              </div>
            }
          >
            {searchResult.categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  {category.icon}
                  {category.name}
                </TableCell>
                <TableCell>{category.weight}</TableCell>
                <TableCell>
                  {category.parent
                    ? category.featured
                      ? "True"
                      : "False"
                    : "-"}
                </TableCell>
                <TableCell>
                  {(category.parent && topCategoryNameMap[category.parent]) ||
                    category.parent}
                </TableCell>
                <TableCell>
                  {dayjs(category.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <CategoryOperation
                    category={category}
                    handleSearch={handleSearch}
                    onEdit={() => setCategory(category)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Loading isLoading={loading} />
      </div>

      <div className="flex items-center justify-between mt-4 px-4 gap-4">
        <div className="text-primary-400 text-sm flex-grow-0 flex-shrink-0 basis-48">
          Total {searchResult.count}
        </div>
        <div className="pr-48 flex-1 flex items-center justify-center">
          {searchResult.totalPage > 0 && (
            <Pagination
              showControls
              showShadow
              isDisabled={loading}
              page={searchParams.page}
              size="md"
              total={searchResult.totalPage}
              onChange={(page) => {
                setSearchParams({
                  ...searchParams,
                  page,
                });
              }}
            />
          )}
        </div>
      </div>
      <CategoryEdit
        category={category}
        onClose={() => {
          setCategory(undefined);
          handleSearch();
        }}
      />
    </div>
  );
}
