import { Spinner } from "@nextui-org/react";

export default function Loading({
  isLoading,
  size,
}: {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 bg-primary-100/70 z-[10] pointer-events-none">
      <Spinner
        className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
        color="default"
        size={size}
      />
    </div>
  );
}
