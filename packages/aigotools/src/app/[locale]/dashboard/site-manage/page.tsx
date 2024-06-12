import { useTranslations } from "next-intl";

import DashboardTitle from "@/components/common/dashboard-title";
import SitesTable from "@/components/site-manage/sites-table";

export default function SiteManage() {
  const t = useTranslations("siteManage");

  return (
    <div className="p-6 w-full">
      <DashboardTitle title={t("title")} />
      <SitesTable />
    </div>
  );
}
