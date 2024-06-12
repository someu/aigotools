"use client";
import clsx from "clsx";

import ImageUpload from "./image-upload";

export default function MultiImageUpload({
  label,
  value = [],
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="bg-primary-100 px-3 py-2 rounded-lg ">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
      </div>
      <div className={clsx("mt-3 mb-3 flex flex-wrap gap-2 items-center")}>
        {value?.map((src, index) => {
          return (
            <ImageUpload
              key={index}
              value={src}
              onChange={(src) => {
                const newValue = [...value];

                if (src) {
                  newValue[index] = src;
                } else {
                  value.splice(index, 1);
                }
                onChange(newValue);
              }}
            />
          );
        })}
        <ImageUpload
          onChange={(src) => {
            if (src) {
              onChange([...value, src]);
            }
          }}
        />
      </div>
    </div>
  );
}
