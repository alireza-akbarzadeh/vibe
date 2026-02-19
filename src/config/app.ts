import {
	type LucideIcon,
	LucideLaptop,
	LucideMoon,
	LucideSun,
} from "lucide-react";
import type { Theme } from "@/components/theme-provider";

export interface LanguageOption {
	locale: string;
	countryCode: string;
	label: string;
}

export const languageOptions: readonly LanguageOption[] = [
	{ locale: "en", countryCode: "US", label: "English" },
	{ locale: "zh-tw", countryCode: "TW", label: "繁體中文" },
];

export interface ThemeOption {
	value: Theme;
	Icon: LucideIcon;
}

export const themeOptions: readonly ThemeOption[] = [
	{ value: "system", Icon: LucideLaptop },
	{ value: "light", Icon: LucideSun },
	{ value: "dark", Icon: LucideMoon },
];
