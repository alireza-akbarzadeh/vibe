import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
	src: string;
	className?: string;
};

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
	({ src, className, ...props }, ref) => {
		return (
			<video
				ref={ref}
				src={src}
				className={cn("w-full h-full object-cover", className)}
				{...props}
			>
				<track kind="captions" srcLang="en" label="English" />
				Your browser does not support the video tag.
			</video>
		);
	},
);

Video.displayName = "Video";
