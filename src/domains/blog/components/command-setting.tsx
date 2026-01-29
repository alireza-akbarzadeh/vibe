import { useNavigate } from "@tanstack/react-router";
import {
	CreditCard,
	Heart,
	LogOut,
	Sparkles,
	User,
	XCircle,
} from "lucide-react";
import { useEffect } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { generateSlug } from "@/lib/utils";
import { CATEGORIES } from "../blog-layout";
import { MOCK_ARTICLES } from "../blog-mock";
import { actions } from "../store/blog.store";

interface CommandSettingProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CommandSetting(props: CommandSettingProps) {
	const { open, setOpen } = props;
	const navigate = useNavigate();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [setOpen]);

	const handleSelectArticle = (title: string) => {
		setOpen(false);
		navigate({
			to: "/blog/$blogslug",
			params: { blogslug: generateSlug(title) },
		});
	};

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search stories..." />
			<CommandList className="custom-scrollbar">
				<CommandEmpty>No results found.</CommandEmpty>

				{/* --- 1. STORIES GROUP --- */}
				<CommandGroup heading="Stories">
					{MOCK_ARTICLES.map((article) => (
						<CommandItem
							key={article.id}
							onSelect={() => handleSelectArticle(article.title)}
							className="flex items-center gap-3 py-3 cursor-pointer"
						>
							<div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-800">
								<img
									src={article.image}
									alt={article.title}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-white">
									{article.title}
								</span>
								<span className="text-xs text-neutral-500">
									{article.category}
								</span>
							</div>
						</CommandItem>
					))}
				</CommandGroup>

				{/* --- 2. SEARCH MANAGEMENT --- */}
				<CommandGroup heading="Search Management">
					<CommandItem
						onSelect={() => {
							actions.clearSearch();
							setOpen(false);
						}}
						className="cursor-pointer"
					>
						<div className="flex items-center gap-2 text-red-400">
							<XCircle className="h-4 w-4" />
							<span>Clear Search & Reset</span>
						</div>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Browse Categories">
					{CATEGORIES.map((cat) => (
						<CommandItem
							key={cat.id}
							onSelect={() => {
								actions.setActiveCategory(cat.id);
								setOpen(false);
							}}
							className="flex items-center gap-2 cursor-pointer"
						>
							<cat.icon className="mr-2 h-4 w-4 text-purple-400" />
							<span>{cat.label}</span>
							<CommandShortcut className="text-[10px]">
								G + {cat.label[0]}
							</CommandShortcut>
						</CommandItem>
					))}
				</CommandGroup>
				{/* --- 3. QUICK ACTIONS --- */}
				<CommandGroup heading="Quick Actions">
					<CommandItem
						onSelect={() => {
							actions.setActiveCategory("bookmarks");
							setOpen(false);
						}}
						className="cursor-pointer"
					>
						<Sparkles className="mr-2 h-4 w-4 text-yellow-400" /> View Bookmarks
					</CommandItem>
					<CommandItem
						onSelect={() => {
							actions.setActiveCategory("likes");
							setOpen(false);
						}}
						className="cursor-pointer"
					>
						<Heart className="mr-2 h-4 w-4 text-pink-500" /> Liked Stories
					</CommandItem>
				</CommandGroup>

				{/* --- 4. ACCOUNT & SETTINGS --- */}
				<CommandGroup heading="Settings & Account">
					<CommandItem
						onSelect={() => {
							/* Navigate to profile */ setOpen(false);
						}}
						className="cursor-pointer"
					>
						<User className="mr-2 h-4 w-4" /> Profile Settings
					</CommandItem>
					<CommandItem
						onSelect={() => {
							/* Navigate to billing */ setOpen(false);
						}}
						className="cursor-pointer"
					>
						<CreditCard className="mr-2 h-4 w-4" /> Subscription & Billing
					</CommandItem>
					<CommandItem
						onSelect={() => {
							/* Log out logic */ setOpen(false);
						}}
						className="cursor-pointer text-red-500"
					>
						<LogOut className="mr-2 h-4 w-4" /> Sign Out
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
