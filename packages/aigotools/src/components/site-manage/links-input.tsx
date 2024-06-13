import { Input } from "@nextui-org/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function LinksInput({
  value = {},
  onChange,
}: {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) {
  const t = useTranslations("siteEdit");

  const values = [
    {
      key: "login",
      label: t("loginPage"),
    },
    {
      key: "register",
      label: t("registerPage"),
    },
    {
      key: "documentation",
      label: t("docPage"),
    },
    {
      key: "pricing",
      label: t("pricingPage"),
    },
  ];

  return (
    <div className="bg-primary-100 px-3 py-2 rounded-lg ">
      <div className="h-8 flex items-center justify-between gap-1">
        <span className="text-sm flex-1">{t("links")}</span>
      </div>
      <div className={clsx("pt-2 pb-2 space-y-2 max-h-[128px] overflow-auto")}>
        {values.map((item, index) => {
          return (
            <Input
              key={index}
              classNames={{ inputWrapper: "!bg-primary-200" }}
              label={item.label}
              radius="sm"
              size="sm"
              value={value[item.key]}
              onValueChange={(itemValue) => {
                const newValue = {
                  ...value,
                  [item.key]: itemValue,
                };

                onChange(newValue);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
