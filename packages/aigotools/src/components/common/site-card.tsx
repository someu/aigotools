"use client";
import clsx from "clsx";
import { Image } from "@nextui-org/react";
import { ExternalLink, ThumbsUpIcon } from "lucide-react";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";

export default function SiteCard({ site }: { site: Site }) {
  const router = useRouter();

  return (
    <div
      key={site._id as string}
      className="group w-full shadow-medium hover:shadow-large transition-all bg-primary-100 rounded-md overflow-hidden cursor-pointer"
      onClick={() => {
        router.push(`/s/${site.siteKey}`);
      }}
    >
      <Image
        isZoomed
        alt={site.name}
        classNames={{
          wrapper: "w-full !max-w-full",
          img: "w-full aspect-video object-fill",
        }}
        radius="none"
        src={site.snapshot}
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div
            className={clsx(
              "flex items-center text-primary-800 font-semibold gap-2 relative",
              "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-primary-900 after:w-0 group-hover:after:w-full after:transition-width"
            )}
          >
            <h3 className="text-lg">{site.name}</h3>
            <ExternalLink size={16} />
          </div>
          {site.voteCount > 0 && (
            <div className="flex items-center text-primary-500 gap-1">
              <ThumbsUpIcon size={13} />
              <span className="text-sm">{site.voteCount}</span>
            </div>
          )}
        </div>
        <div className="mt-2 text-primary-400 text-sm overflow-hidden text-ellipsis line-clamp-2">
          {site.desceription}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {site.categories?.slice(0, 1)?.map((category, index) => (
              <span
                key={index}
                className="text-tiny font-medium py-[1px] px-2 rounded-[4px] bg-primary-700 text-primary-200 inline-block"
              >
                {category}
              </span>
            ))}
          </div>
          <span className="text-primary-600 text-nowrap text-tiny font-medium">
            {site.pricingType}
          </span>
        </div>
      </div>
    </div>
  );
}
