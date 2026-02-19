import { motion } from "framer-motion";
import { Link2, MessageCircle, Send, Share2, Twitter } from "lucide-react";
import type * as React from "react";
import { toast } from "sonner";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { layoutSize } from "../reels.domain";

interface ShareDrawerProps {
	videoUrl: string;
}

export function ShareDrawer({ videoUrl }: ShareDrawerProps) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(videoUrl);
		toast.success("Link copied!", {
			className:
				"rounded-2xl bg-[#121212] border-white/10 text-white font-bold",
		});
	};

	return (
		<Drawer>
			{/* 1. TRIGGER: This is the button that stays in the sidebar */}
			<DrawerTrigger asChild>
				<motion.button
					whileTap={{ scale: 0.8 }}
					className="flex flex-col items-center gap-1 outline-none"
				>
					<div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-colors active:bg-white/20">
						<Share2 className="size-7 text-white" />
					</div>
					<span className="text-[10px] font-black uppercase tracking-tighter text-white drop-shadow-md">
						Share
					</span>
				</motion.button>
			</DrawerTrigger>

			{/* 2. CONTENT: This is the slide-up menu */}
			<DrawerContent
				className={`bg-[#0a0a0a] border-t border-white/10 text-white pb-10 outline-none ${layoutSize}`}
			>
				{/* iPhone Style Drag Handle */}
				<div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />

				<DrawerHeader className="px-6">
					<DrawerTitle className="text-left text-base font-bold">
						Share to
					</DrawerTitle>
				</DrawerHeader>

				<div className="flex gap-6 overflow-x-auto px-6 py-4 scrollbar-hide">
					<ShareOption
						icon={<MessageCircle className="text-green-500" />}
						label="WhatsApp"
					/>
					<ShareOption
						icon={<Twitter className="text-blue-400" />}
						label="Twitter"
					/>
					<ShareOption
						icon={<Send className="text-sky-500" />}
						label="Telegram"
					/>

					{/* Copy Link closes the drawer automatically via DrawerClose */}
					<DrawerClose asChild>
						<ShareOption
							icon={
								<div className="bg-white/10 p-3 rounded-full">
									<Link2 />
								</div>
							}
							label="Copy Link"
							onClick={copyToClipboard}
						/>
					</DrawerClose>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

// Internal component for the drawer icons
function ShareOption({
	icon,
	label,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center gap-2 min-w-17.5 outline-none"
		>
			<div className="size-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5">
				{icon}
			</div>
			<span className="text-[10px] text-white/60 font-medium">{label}</span>
		</button>
	);
}
