"use client";

import { useCallback, useEffect, useState } from "react";
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
  Select,
  SelectItem,
  Pagination,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { debounce } from "lodash";

import { ReviewState } from "@/lib/constants";
import { managerSearchReviews, updateReviewState } from "@/lib/actions";
import Loading from "@/components/common/loading";
import EmptyImage from "@/components/search/empty-image";
import { Review } from "@/models/review";
import { Link } from "@/navigation";

import ReviewOperation from "./review-operation";

interface ReviewForm {
  state?: ReviewState;
  search?: string;
  page: number;
  size: number;
}

export default function ReviewTable() {
  const t = useTranslations("reviewManage");
  const [searchResult, setSearchResult] = useState({
    reviews: [] as Review[],
    count: 0,
    totalPage: 0,
  });
  const [loading, setIsLoading] = useState(false);
  const [updating, setUpdating] = useState("");
  const [searchParams, setSearchParams] = useState<ReviewForm>({
    page: 1,
    size: 15,
  });

  const handleSearch = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setIsLoading(true);

      const result = await managerSearchReviews(searchParams);

      setSearchResult(result);
    } catch (error) {
      console.log(error);
      toast.error(t("failSearch"));
    } finally {
      setIsLoading(false);
    }
  }, [loading, searchParams, t]);

  const handleUpdateReviewState = useCallback(
    async (review: Review, state: ReviewState) => {
      if (updating) {
        return false;
      }

      try {
        setUpdating(review._id);

        await updateReviewState(review._id, state);

        await handleSearch();
      } catch (error) {
        console.log(error);
        toast.error(t("failUpdate"));
      } finally {
        setUpdating("");
      }
    },
    [handleSearch, updating, t],
  );

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="mt-4 relative py-4">
      <div
        className="flex items-center justify-end gap-4"
        onSubmit={handleSearch}
      >
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
          {Object.values(ReviewState).map((state) => (
            <SelectItem key={state}>{t(state)}</SelectItem>
          ))}
        </Select>
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
            },
          )}
        />
      </div>
      <div className="mt-6 relative">
        <Table className="mt-6" shadow="sm">
          <TableHeader>
            <TableColumn>{t("siteName")}</TableColumn>
            <TableColumn>{t("url")}</TableColumn>
            <TableColumn>{t("state")}</TableColumn>
            <TableColumn>{t("userEmail")}</TableColumn>
            <TableColumn maxWidth={160}>{t("createdAt")}</TableColumn>
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
            {searchResult.reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.name}</TableCell>
                <TableCell>
                  <Link
                    className="text-blue-500 hover:underline"
                    href={review.url}
                    target="_blank"
                  >
                    {review.url}
                  </Link>
                </TableCell>
                <TableCell>{t(review.state)}</TableCell>
                <TableCell>{review.userEmail}</TableCell>
                <TableCell>
                  {dayjs(review.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {dayjs(review.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <ReviewOperation
                    handleSearch={handleSearch}
                    review={review}
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
    </div>
  );
}
