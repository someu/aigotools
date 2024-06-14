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
  Switch,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { saveCategory } from "@/lib/actions";
import { Category } from "@/models/category";

export default function CategoryEdit({
  category,
  onClose,
}: {
  category?: Category;
  onClose: () => void;
}) {
  const { register, getValues, setValue, watch, reset, trigger, formState } =
    useForm<Category>({
      defaultValues: category,
    });

  const t = useTranslations("categoryEdit");

  const formValues = watch();

  const [isOpen, setIsOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    reset(category);
    setIsOpen(!!category);
  }, [reset, category]);

  const onSubmit = useCallback(async () => {
    if (saving) {
      return;
    }
    try {
      if (!(await trigger())) {
        return;
      }
      setSaving(true);
      const values = getValues();

      await saveCategory(values);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [saving, trigger, getValues, t, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalContent>
        <ModalHeader>
          {category?._id ? t("updateTitle") : t("newTitle")}
        </ModalHeader>
        <ModalBody>
          <form className="overflow-auto space-y-4">
            <Input
              isRequired
              label={t("categoryName")}
              size="sm"
              value={formValues.name}
              {...register("name", {
                required: true,
              })}
              color={formState.errors.name ? "danger" : "default"}
            />
            <Input
              label={t("categoryIcon")}
              size="sm"
              value={formValues.icon}
              {...register("icon")}
            />
            <div className="flex items-center justify-between py-3 rounded-lg px-3 bg-primary-100">
              <label className="text-sm"> {t("featured")}</label>
              <Switch
                checked={formValues.featured}
                size="sm"
                {...register("featured")}
              />
            </div>
            <Input
              label={t("weight")}
              size="sm"
              value={formValues.weight as unknown as any}
              onValueChange={(value) => {
                setValue("weight", parseInt(value, 10));
              }}
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
