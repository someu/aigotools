import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Ban, Bone, Check } from "lucide-react";

import { ReviewState } from "@/lib/constants";
import { Review } from "@/models/review";
import OperationIcon from "@/components/common/operation-icon";
import { updateReviewState } from "@/lib/actions";

export default function ReviewOperation({
  review,
  handleSearch,
}: {
  review: Review;
  handleSearch: () => void;
}) {
  const t = useTranslations("reviewManage");

  const [updating, setUpdating] = useState(false);

  const handleUpdateReviewState = useCallback(
    async (review: Review, state: ReviewState) => {
      if (updating) {
        return false;
      }

      try {
        setUpdating(true);

        await updateReviewState(review._id, state);

        await handleSearch();
      } catch (error) {
        console.log(error);
        toast.error(t("failUpdate"));
      } finally {
        setUpdating(false);
      }
    },
    [handleSearch, updating, t],
  );

  const menuItems = [];

  if (review.state === ReviewState.pending) {
    menuItems.push(
      <DropdownItem
        className="text-danger-500"
        startContent={<Ban size={14} />}
        onClick={() => handleUpdateReviewState(review, ReviewState.rejected)}
      >
        {t("reject")}
      </DropdownItem>,
      <DropdownItem
        className="text-success-500"
        startContent={<Check size={14} />}
        onClick={() => handleUpdateReviewState(review, ReviewState.approved)}
      >
        {t("approve")}
      </DropdownItem>,
    );
  } else if (review.state === ReviewState.rejected) {
    menuItems.push(
      <DropdownItem
        className="text-secondary-500"
        startContent={<Bone size={14} />}
        onClick={() => handleUpdateReviewState(review, ReviewState.pending)}
      >
        {t("withdraw")}
      </DropdownItem>,
    );
  }

  return (
    <Dropdown
      classNames={{ content: "!min-w-24 bg-primary-100 shadow" }}
      isDisabled={updating}
    >
      <DropdownTrigger>
        <Button isIconOnly isLoading={updating} size="sm">
          <OperationIcon className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>{menuItems}</DropdownMenu>
    </Dropdown>
  );
}
