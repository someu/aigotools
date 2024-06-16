"use client";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Home } from "lucide-react";

import { Link } from "@/navigation";

export default function NavBar({ name }: { name: string | string[] }) {
  return (
    <Breadcrumbs itemClasses={{ item: "text-primary-400 text-base" }}>
      <BreadcrumbItem>
        <Link className="flex items-center gap-1" href={"/"}>
          <Home size={16} /> <span>Home</span>
        </Link>
      </BreadcrumbItem>
      {(Array.isArray(name) ? name : [name]).map((n, i) => (
        <BreadcrumbItem key={i}>{n}</BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
