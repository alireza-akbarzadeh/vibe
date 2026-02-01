import { Link } from "@tanstack/react-router";
import {
    ChevronRight,
    Home,
    Menu,
    X
} from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { navLinks } from "./root-header";

type RootHeaderProps = {
    onOpenChange: (open: boolean) => void;
    open: boolean;
    side?: "top" | "bottom" | "left" | "right";
    show?: boolean;
};

export function MobileHeader(props: RootHeaderProps) {
    const { open, side = "left", show = false, onOpenChange } = props;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "p-2.5 bg-white/5 rounded-full border border-white/10 text-slate-300 active:scale-95 transition-all outline-none",
                        show ? "opacity-100 pointer-events-auto" : "lg:hidden"
                    )}
                >
                    <Menu className="size-5" />
                </button>
            </SheetTrigger>

            {/* "side" can be top, bottom, left, right. Bottom feels most premium for mobile */}
            <SheetContent
                noCLose
                side={side}
                className="bg-[#0a0a0b] border-white/10 text-white rounded-t-[2.5rem] outline-none h-[90vh] p-0 overflow-hidden"
            >


                <SheetHeader className="flex flex-row items-center justify-between px-8 pt-6 text-left">
                    <Link to="/" className="flex flex-col gap-1">
                        <SheetTitle className="text-2xl font-black tracking-tighter text-white">
                            Explore
                        </SheetTitle>
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em]">
                            Navigation
                        </p>
                    </Link>

                    {/* Radix/Shadcn Sheet has a default close, but we use SheetClose for a custom look */}
                    <SheetClose asChild>
                        <button className="p-2.5 bg-white/5 rounded-full text-slate-400 hover:text-white outline-none active:scale-90 transition-transform">
                            <X className="size-5" />
                        </button>
                    </SheetClose>
                </SheetHeader>

                <div className="px-6 pb-12 pt-6 h-full overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        {
                            [
                                {
                                    label: "Home",
                                    href: "/",
                                    icon: Home
                                }
                            ].concat(navLinks).map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    onClick={() => onOpenChange(false)}
                                    className="flex items-center gap-4 py-4 px-3 rounded-2xl active:bg-white/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
                                        <link.icon className="size-5 text-slate-300 group-active:text-purple-400" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-200 flex-1">
                                        {link.label}
                                    </span>
                                    <ChevronRight className="size-5 text-slate-700 group-active:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 pb-20">
                        <Link
                            to="/login"
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-center py-4 text-slate-300 font-bold bg-white/5 rounded-2xl active:scale-95 transition-transform"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-center py-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}