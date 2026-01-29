import type { ComponentProps } from "react";
import { env } from "@/env";
import { cn } from "@/lib/utils";

interface ImageProps extends ComponentProps<"img"> {
	isLocal?: boolean;
}

export function Image(props: ImageProps) {
	const { alt, src, isLocal = true, className, ...rest } = props;
	const imagSrc = isLocal ? src : `${env.VITE_CDN_ADDRESS}/${src}`;
	return (
		<img alt={alt} src={imagSrc} className={cn("", className)} {...rest} />
	);
}
