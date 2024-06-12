"use client";
import { Button, Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { submitReview } from "@/lib/actions";
import { AppConfig } from "@/lib/config";

export default function Form() {
  const t = useTranslations("submit");

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [submiting, setSubmiting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      toast.error(t("requireName"));

      return;
    } else if (!url) {
      toast.error(t("requireUrl"));

      return;
    }
    try {
      if (submiting) {
        return;
      }
      setSubmiting(true);
      const submited = await submitReview(name, url);

      if (submited) {
        toast.success(t("successSubmit"));
      } else {
        toast.error(t("failSubmit"));
      }
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <form
      className="max-w-[300px] sm:max-w-[450px] mx-auto my-16 flex flex-col gap-6 items-stretch"
      onSubmit={onSubmit}
    >
      <Input
        isRequired
        label={t("websiteName")}
        placeholder={t("websiteNamePlaceholder")}
        value={name}
        onValueChange={setName}
      />
      <Input
        isRequired
        label={t("websiteUrl")}
        placeholder={t("websiteUrlPlaceholder")}
        value={url}
        onValueChange={setUrl}
      />
      <Button
        className="font-semibold"
        color="primary"
        isLoading={submiting}
        size="sm"
        type="submit"
      >
        {t("submit")}
      </Button>
      <div className="text-sm text-primary-400 break-all">
        {t("request", {
          code: `<a href="${AppConfig.siteUrl}" title="${AppConfig.siteName}">${AppConfig.siteName}</a>`,
        })}
      </div>
    </form>
  );
}
