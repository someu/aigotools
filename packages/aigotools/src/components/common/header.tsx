"use client";
import { useTranslations, useLocale } from "next-intl";
import { Github, LogOut } from "lucide-react";
import clsx from "clsx";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/nextjs";

import { Link } from "@/navigation";
import { AppConfig } from "@/lib/config";

import Container from "./container";
import Logo from "./logo";
import { ThemeSwitcher } from "./theme-switcher";
import LanguageSwitcher from "./language-switcher";

export default function Header({ className }: { className?: string }) {
  const t = useTranslations("header");

  const locale = useLocale();

  const user = useUser();
  const { signOut } = useAuth();

  const isManager =
    user.user?.id && AppConfig.manageUsers.includes(user.user.id);

  const forceRedirectUrl =
    typeof window === "undefined"
      ? null
      : `${window.location.origin}/${locale}/submit`;

  return (
    <Container
      className={clsx(
        "flex items-center justify-between h-20 sm:h-24",
        className,
      )}
    >
      <Logo />
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href={"https://github.com/someu/aigotools"} target="_blank">
          <Github className="text-primary cursor-pointer" size={16} />
        </Link>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <SignedOut>
          <SignInButton forceRedirectUrl={forceRedirectUrl} mode="modal">
            <Button className="font-semibold" color="primary" size="sm">
              {t("submit")}
            </Button>
          </SignInButton>
          <SignInButton mode="modal">
            <Button className="font-semibold" size="sm" variant="bordered">
              {t("login")}
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href={"/submit"}>
            <Button className="font-semibold" color="primary" size="sm">
              {t("submit")}
            </Button>
          </Link>
          {isManager && (
            <Link href={"/dashboard"}>
              <Button
                className="font-semibold"
                color="primary"
                size="sm"
                variant="bordered"
              >
                {t("dashboard")}
              </Button>
            </Link>
          )}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                alt={user.user?.fullName || ""}
                className="cursor-pointer"
                size="sm"
                src={user.user?.imageUrl}
              />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                className="text-danger-400 hover:!text-danger-500"
                startContent={<LogOut size={14} strokeWidth={3} />}
                onClick={() => signOut()}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </SignedIn>
      </div>
    </Container>
  );
}
