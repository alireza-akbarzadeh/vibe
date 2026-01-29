import { ChevronUp, CreditCard, LogOut, Settings, User } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfile() {
	return (
		<div className="p-4 mt-auto border-t border-white/5 bg-black/20 text-white">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group outline-none">
						<div className="relative">
							<img
								alt="user"
								src="https://i.pravatar.cc/100?u=me"
								className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all"
							/>
							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold truncate">Alex Rivera</p>
							<p className="text-[10px] text-purple-400 font-black uppercase tracking-wider">
								Pro Member
							</p>
						</div>
						<ChevronUp
							size={16}
							className="text-neutral-600 group-hover:text-white transition-all group-data-[state=open]:rotate-180"
						/>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-64 mb-4 ml-4 bg-[#0c0c0c] border-white/10 text-white rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
					side="right"
					align="end"
				>
					<DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
						My Account
					</DropdownMenuLabel>
					<DropdownMenuSeparator className="bg-white/5" />
					<DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors">
						<User size={16} />{" "}
						<span className="text-sm font-semibold">Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors">
						<CreditCard size={16} />{" "}
						<span className="text-sm font-semibold">Billing</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-white/10 focus:text-white cursor-pointer transition-colors">
						<Settings size={16} />{" "}
						<span className="text-sm font-semibold">Settings</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-white/5" />
					<DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-red-500/20 text-red-500 cursor-pointer transition-colors">
						<LogOut size={16} />{" "}
						<span className="text-sm font-semibold">Sign out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
