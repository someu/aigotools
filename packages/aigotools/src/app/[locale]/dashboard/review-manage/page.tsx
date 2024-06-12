import { useTranslations } from "next-intl";

import DashboardTitle from "@/components/common/dashboard-title";
import ReviewTable from "@/components/review-manage/review-table";

export default function ReviewManage() {
  const t = useTranslations("reviewManage");

  return (
    <div className="p-6 w-full">
      <DashboardTitle title={t("title")} />
      <ReviewTable />
    </div>
  );
}
