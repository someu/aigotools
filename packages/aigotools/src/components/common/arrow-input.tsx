import { Input } from "@nextui-org/react";
import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";

export default function ArrowInput({
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
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm flex-1">{label}</span>
        <span
          className="cursor-pointer inline-block p-2 text-primary-500 hover:text-primary-700 transition-all"
          onClick={() => {
            onChange([...value, ""]);
          }}
        >
          <Plus size={16} strokeWidth={3} />
        </span>
      </div>
      <div
        className={clsx("pt-2 pb-2 space-y-2 max-h-[128px] overflow-auto", {
          hidden: !value?.length,
        })}
      >
        {value.map((item, index) => {
          return (
            <Input
              key={index}
              classNames={{ inputWrapper: "!bg-primary-200" }}
              endContent={
                <div
                  className="text-primary-400 hover:text-primary-600 transition-all cursor-pointer p-2"
                  onClick={() => {
                    const newValue = [...value];

                    newValue.splice(index, 1);
                    onChange(newValue);
                  }}
                >
                  <Trash2 size={12} />
                </div>
              }
              radius="sm"
              size="sm"
              value={item}
              onValueChange={(itemValue) => {
                const newValue = [...value];

                newValue[index] = itemValue;
                onChange(newValue);
              }}
            />
          );
        })}
      </div>
      <div
        className={clsx("text-right mr-1 text-primary-300 text-tiny", {
          hidden: !value?.length,
        })}
      >
        {value.length}
      </div>
    </div>
  );
}
