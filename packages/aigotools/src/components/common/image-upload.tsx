import { Image } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import { uploadFormDataToMinio } from "../../lib/minio";
import { uploadFormDataToCos } from "../../lib/cos";

import Loading from "./loading";

import { uploadFormDataToS3 } from "@/lib/s3";
import { AppConfig } from "@/lib/config";

export default function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("upload");
  const [uploading, setUploading] = useState(false);
  const handleUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (uploading) {
        return;
      }
      try {
        setUploading(true);
        const file = e.target.files?.[0];

        if (!file) {
          return;
        }
        const formData = new FormData();

        formData.append("files", file);
        if (AppConfig.imageStorage === "minio") {
          const res = await uploadFormDataToMinio(formData);

          onChange(res[0]);
        } else if (AppConfig.imageStorage === "s3") {
          const res = await uploadFormDataToS3(formData);

          onChange(res[0]);
        } else if (AppConfig.imageStorage === "cos") {
          const res = await uploadFormDataToCos(formData);

          onChange(res[0]);
        } else {
          throw new Error(
            `Unsuppored image storage: ${AppConfig.imageStorage}`
          );
        }
      } catch (error) {
        toast.error(t("uploadFailed"));
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
    [onChange, t, uploading]
  );

  return value ? (
    <div className="group w-16 aspect-square relative">
      <Image
        alt="image-upload"
        className="w-full h-full"
        classNames={{
          wrapper: "w-full h-full",
          img: "w-full h-full object-fill",
        }}
        src={value}
      />
      <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-50">
        <div
          className="group-hover:opacity-100 transition-all opacity-0 p-1 rounded-md cursor-pointer text-primary-800 bg-primary-100/50"
          onClick={() => onChange("")}
        >
          <Trash2 size={14} />
        </div>
      </div>
      <Loading isLoading={uploading} size="sm" />
    </div>
  ) : (
    <div className="group w-16 aspect-square relative bg-primary-200 hover:bg-primary-300 transition-all rounded-md">
      <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div className="text-primary-400 group-hover:text-primary-500 transition-all">
          <Plus size={18} />
        </div>
      </div>
      {!uploading && (
        <input
          accept="image/*"
          className="w-full h-full opacity-0 cursor-pointer"
          type="file"
          onChange={handleUpload}
        />
      )}
      <Loading isLoading={uploading} size="sm" />
    </div>
  );
}
