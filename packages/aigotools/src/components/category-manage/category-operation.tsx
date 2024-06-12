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
import { Edit, Trash2 } from "lucide-react";

import OperationIcon from "@/components/common/operation-icon";
import { deleteCategory } from "@/lib/actions";
import { Category } from "@/models/category";

export default function CategoryOperation({
  category,
  handleSearch,
  onEdit,
}: {
  category: Category;
  handleSearch: () => void;
  onEdit: () => void;
}) {
  const t = useTranslations("categoryManage");

  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (deleting) {
      return;
    }
    try {
      setDeleting(true);
      await deleteCategory(category._id);

      await handleSearch();
    } catch (error) {
      console.log(error);
      toast.error(t("deleteSearch"));
    } finally {
      setDeleting(false);
    }
  }, [category._id, deleting, handleSearch, t]);

  return (
    <Dropdown
      classNames={{ content: "!min-w-24 bg-primary-100 shadow" }}
      isDisabled={deleting}
    >
      <DropdownTrigger>
        <Button isIconOnly isLoading={deleting} size="sm">
          <OperationIcon className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          className="text-yellow-500"
          startContent={<Edit size={14} />}
          onClick={onEdit}
        >
          {t("edit")}
        </DropdownItem>
        <DropdownItem
          className="text-danger-500/50"
          startContent={<Trash2 size={14} />}
          onClick={handleDelete}
        >
          {t("delete")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
