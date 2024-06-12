import { useTranslations } from "next-intl";

import DashboardTitle from "@/components/common/dashboard-title";
import CategoryTable from "@/components/category-manage/category-table";

export default function CategoryManage() {
  const t = useTranslations("categoryManage");

  return (
    <div className="p-6 w-full">
      <DashboardTitle title={t("title")} />
      <CategoryTable />
    </div>
  );
}
