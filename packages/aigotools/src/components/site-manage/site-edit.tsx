"use client";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import LinksInput from "./links-input";

import { Site } from "@/models/site";
import ArrowInput from "@/components/common/arrow-input";
import SingleImageUpload from "@/components/common/single-image-upload";
import MultiImageUpload from "@/components/common/multi-image-upload";
import { getAllCategories, saveSite } from "@/lib/actions";

export default function SiteEdit({
  site,
  onClose,
}: {
  site?: Site;
  onClose: () => void;
}) {
  const { register, getValues, setValue, watch, reset, trigger, formState } =
    useForm<Site>({
      defaultValues: site,
    });

  const t = useTranslations("siteEdit");

  const formValues = watch();

  const [isOpen, setIsOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reset(site);
    setIsOpen(!!site);
  }, [reset, site]);

  const onSubmit = useCallback(async () => {
    if (saving) {
      return;
    }
    try {
      if (!(await trigger("url"))) {
        return;
      }
      setSaving(true);
      const values = getValues();

      const site = await saveSite(values);

      if (!site) {
        toast.error(t("saveFailed"));
      } else {
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [saving, trigger, getValues, t, onClose]);

  const { data: categories = [] } = useQuery({
    queryKey: ["all-categories"],
    async queryFn() {
      return await getAllCategories();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      size="5xl"
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>
          {site?._id ? t("updateTitle") : t("newTitle")}
        </ModalHeader>
        <ModalBody>
          <form className="grid grid-cols-2 gap-4 max-h-[65vh] pb-1 overflow-auto">
            <Input
              isRequired
              label={t("url")}
              size="sm"
              value={formValues.url}
              {...register("url", {
                required: true,
              })}
              color={formState.errors.url ? "danger" : "default"}
            />
            <Input
              label={t("name")}
              size="sm"
              value={formValues.name}
              {...register("name")}
            />
            <Input
              label={t("pricingType")}
              size="sm"
              value={formValues.pricingType}
              {...register("pricingType")}
            />
            <div className="flex items-center justify-between py-3 rounded-lg px-3 bg-primary-100">
              <label className="text-sm"> {t("featured")}</label>
              <Switch
                checked={formValues.featured}
                size="sm"
                {...register("featured")}
              />
            </div>

            <ArrowInput
              label={t("features")}
              value={formValues.features}
              onChange={(value) => {
                setValue("features", value);
              }}
            />
            <ArrowInput
              label={t("pricings")}
              value={formValues.pricings}
              onChange={(value) => {
                setValue("pricings", value);
              }}
            />
            <LinksInput
              value={formValues.links}
              onChange={(value) => {
                setValue("links", value);
              }}
            />
            <ArrowInput
              label={t("usecases")}
              value={formValues.usecases}
              onChange={(value) => {
                setValue("usecases", value);
              }}
            />
            <ArrowInput
              label={t("relatedSearchs")}
              value={formValues.relatedSearchs}
              onChange={(value) => {
                setValue("relatedSearchs", value);
              }}
            />
            <ArrowInput
              label={t("users")}
              value={formValues.users}
              onChange={(value) => {
                setValue("users", value);
              }}
            />
            <SingleImageUpload
              label={t("snapshot")}
              value={formValues.snapshot}
              onChange={(value) => {
                setValue("snapshot", value);
              }}
            />
            <MultiImageUpload
              label={t("images")}
              value={formValues.images}
              onChange={(value) => {
                setValue("images", value);
              }}
            />
            <Select
              className="col-span-2"
              label={t("categories")}
              selectedKeys={formValues.categories}
              selectionMode="multiple"
              size="sm"
              onSelectionChange={(value) => {
                setValue(
                  "categories",
                  Array.from(value).map((item) => item.toString())
                );
              }}
            >
              {categories.map((category) => {
                return (
                  <SelectItem key={category._id}>{category.name}</SelectItem>
                );
              })}
            </Select>
            <Textarea
              label={t("desceription")}
              size="sm"
              value={formValues.desceription}
              {...register("desceription")}
              className="col-span-2"
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            isLoading={saving}
            size="sm"
            onClick={onSubmit}
          >
            {t("save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
