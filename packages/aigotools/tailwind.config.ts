import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const LightColors = [
  "#FAFAFA",
  "#F4F4F5",
  "#E4E4E7",
  "#D4D4D8",
  "#A1A1AA",
  "#71717A",
  "#52525B",
  "#3F3F46",
  "#27272A",
  "#18181B",
];

const DarkColors = [...LightColors].reverse();

function stepColor(colors: string[]) {
  return {
    50: colors[0],
    100: colors[1],
    200: colors[2],
    300: colors[3],
    400: colors[4],
    500: colors[5],
    600: colors[6],
    700: colors[7],
    800: colors[8],
    900: colors[9],
  };
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    // dev
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          extend: "dark",
          colors: {
            background: DarkColors[0],
            foreground: DarkColors[7],
            primary: {
              ...stepColor(DarkColors),
              foreground: DarkColors[0],
              DEFAULT: DarkColors[7],
            },
            divider: {
              DEFAULT: DarkColors[4],
            },
          },
        },
        light: {
          extend: "light",
          colors: {
            background: LightColors[0],
            foreground: LightColors[7],
            primary: {
              ...stepColor(LightColors),
              foreground: LightColors[0],
              DEFAULT: LightColors[7],
            },
            divider: {
              DEFAULT: LightColors[4],
            },
          },
        },
      },
    }),
  ],
};

export default config;
