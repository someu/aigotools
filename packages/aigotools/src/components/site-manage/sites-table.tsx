"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Pagination,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import dayjs from "dayjs";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Atom, Axe, Plus, SearchIcon, StopCircle } from "lucide-react";

import SiteEdit from "./site-edit";
import SiteOperation from "./site-operation";

import { ProcessStage, SiteState } from "@/lib/constants";
import { Site } from "@/models/site";
import {
  SearchParams,
  dispatchAllSitesCrawl,
  managerSearchSites,
  stopAllSitesCrawl,
} from "@/lib/actions";
import Loading from "@/components/common/loading";
import EmptyImage from "@/components/search/empty-image";
import { Link } from "@/navigation";
import { createTemplateSite } from "@/lib/create-template-site";

export default function SitesTable() {
  const t = useTranslations("siteManage");

  const [site, setSite] = useState<Site | undefined>(undefined);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    size: 15,
  });

  const defaultData = {
    count: 0,
    totalPage: 0,
    sites: [] as Site[],
  };

  const {
    isLoading: loading,
    data: searchResult = defaultData,
    refetch: handleSearch,
  } = useQuery({
    queryKey: [searchParams],
    queryFn: async () => {
      return await managerSearchSites(searchParams);
    },
    initialData: defaultData,
    refetchOnMount: true,
    throwOnError(error) {
      console.log(error);
      toast.error(t("failSearch"));

      return false;
    },
    refetchInterval: 5000,
  });

  const stopAllSite = useCallback(
    async (e: any) => {
      try {
        const params = { ...searchParams } as Omit<
          SearchParams,
          "page" | "size"
        >;

        delete (params as any).page;
        delete (params as any).size;
        await stopAllSitesCrawl(params);
        await handleSearch();
      } catch (error) {
        console.log(error);
        toast(t("stopFailed"));
      }
    },
    [handleSearch, searchParams, t]
  );

  const dispatchAllSite = useCallback(
    async (e: any) => {
      try {
        const params = { ...searchParams } as Omit<
          SearchParams,
          "page" | "size"
        >;

        delete (params as any).page;
        delete (params as any).size;
        await dispatchAllSitesCrawl(params);
        await handleSearch();
      } catch (error) {
        console.log(error);
        toast(t("dispatchFailed"));
      }
    },
    [handleSearch, searchParams, t]
  );

  return (
    <div className="mt-4 relative py-4">
      <div className="flex items-center justify-end gap-4">
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <Button color="primary" size="sm" startContent={<Axe size={14} />}>
              {t("operation")}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              startContent={<Atom size={14} />}
              onClick={dispatchAllSite}
            >
              {t("dispatchAll")}
            </DropdownItem>
            <DropdownItem
              startContent={<StopCircle size={14} />}
              onClick={stopAllSite}
            >
              {t("stopAll")}
            </DropdownItem>
            <DropdownItem
              startContent={<Plus size={14} />}
              onClick={() => setSite(createTemplateSite())}
            >
              {t("new")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="flex-1" />
        <Select
          className="w-48"
          placeholder={t("processStage")}
          size="sm"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              processStage: e.target.value as any,
              page: 1,
            })
          }
        >
          {Object.values(ProcessStage).map((stage) => (
            <SelectItem key={stage}>{t(stage)}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-48"
          placeholder={t("selectState")}
          size="sm"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              state: e.target.value as any,
              page: 1,
            })
          }
        >
          {Object.values(SiteState).map((state) => (
            <SelectItem key={state}>{t(state)}</SelectItem>
          ))}
        </Select>
        <Input
          className="w-96"
          endContent={
            <SearchIcon
              className="cursor-pointer"
              size={14}
              strokeWidth={3}
              onClick={() => handleSearch()}
            />
          }
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
            <TableColumn>{t("index")}</TableColumn>
            <TableColumn>{t("siteName")}</TableColumn>
            <TableColumn>{t("url")}</TableColumn>
            <TableColumn>{t("weight")}</TableColumn>
            <TableColumn maxWidth={100}>{t("state")}</TableColumn>
            <TableColumn maxWidth={100}>{t("processStage")}</TableColumn>
            <TableColumn maxWidth={160}>{t("updatedAt")}</TableColumn>
            <TableColumn align="end">{t("operation")}</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="w-full flex py-60 items-center justify-center">
                <EmptyImage className="dark:invert" />
              </div>
            }
          >
            {searchResult.sites.map((site, index) => (
              <TableRow key={site._id}>
                <TableCell width={50}>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/s/${site.siteKey}`}
                    target="_blank"
                  >
                    {site.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    className="text-blue-500 hover:underline"
                    href={site.url}
                    target="_blank"
                  >
                    {site.url}
                  </Link>
                </TableCell>
                <TableCell>{site.weight}</TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      "inline-block rounded w-[90px] h-6 leading-6 text-center text-tiny capitalize bg-green-600 text-white",
                      {
                        "bg-primary-500 opacity-80":
                          site.state !== SiteState.published,
                      }
                    )}
                  >
                    {t(site.state)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center gap-1 rounded w-[96px] h-6 leading-6 text-center text-tiny capitalize bg-green-600 text-white",
                      {
                        "bg-red-500 opacity-90":
                          site.processStage === ProcessStage.fail,
                        "bg-yellow-500 opacity-90":
                          site.processStage === ProcessStage.processing,
                        "bg-primary-500 opacity-80":
                          site.processStage === ProcessStage.pending,
                      }
                    )}
                  >
                    {site.processStage === ProcessStage.processing && (
                      <Spinner
                        classNames={{
                          base: "w-3 h-3",
                          wrapper: "w-3 h-3",
                        }}
                        size="sm"
                      />
                    )}
                    {t(site.processStage)}
                  </span>
                </TableCell>
                <TableCell>
                  {dayjs(site.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <SiteOperation
                    handleSearch={handleSearch}
                    site={site}
                    onEdit={() => setSite(site)}
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
      <SiteEdit
        site={site}
        onClose={() => {
          setSite(undefined);
          handleSearch();
        }}
      />
    </div>
  );
}
