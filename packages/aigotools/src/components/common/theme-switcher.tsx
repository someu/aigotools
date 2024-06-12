"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function ThemeSwitcher({ asButton }: { asButton?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClick = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [setTheme, theme]);

  if (!mounted) return null;

  const switchIcon =
    theme === "dark" ? (
      <Sun
        className="text-primary cursor-pointer"
        size={16}
        onClick={asButton ? undefined : onClick}
      />
    ) : (
      <Moon
        className="text-primary cursor-pointer"
        size={16}
        onClick={asButton ? undefined : onClick}
      />
    );

  if (asButton) {
    return (
      <div
        className="p-1 rounded-md bg-primary-200 cursor-pointer"
        onClick={onClick}
      >
        {switchIcon}
      </div>
    );
  }

  return switchIcon;
}
