import { LucideCheck, LucidePalette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeOptions } from "@/config/app";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ModeToggle() {
	const theme = useTheme();
	const media = useMediaQuery();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="text">
					<LucidePalette />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side={media.isMobile ? "bottom" : "right"}
				align={media.isMobile ? "end" : "start"}
				className="min-w-56 rounded-lg"
			>
				{themeOptions.map(({ value, Icon }) => (
					<DropdownMenuItem key={value} onClick={() => theme.set(value)}>
						<Icon />
						{value}
						{theme.value === value && <LucideCheck className="ml-auto" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
