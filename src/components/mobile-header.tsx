import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChevronRight,
    Home,
    Menu,
    Sparkles,
    X,
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
import { navLinks } from "./nav-links";
import { UserMenu } from "./user-menu/user-menu";

type RootHeaderProps = {
    onOpenChange: (open: boolean) => void;
    open: boolean;
    side?: "top" | "bottom" | "left" | "right";
    show?: boolean;
};

const allLinks = [{ label: "Home", href: "/", icon: Home }, ...navLinks];

// Gradient colors per nav item
const linkGradients: Record<string, string> = {
    Home: "from-slate-500 to-slate-600",
    Music: "from-cyan-500 to-blue-600",
    Movies: "from-purple-500 to-pink-600",
    Shorts: "from-rose-500 to-orange-500",
    Weblog: "from-emerald-500 to-teal-600",
    Pricing: "from-amber-500 to-yellow-500",
};

export function MobileHeader(props: RootHeaderProps) {
    const { open, side = "bottom", show = false, onOpenChange } = props;
    const location = useLocation();

    return (
        <div className="space-x-2 flex items-center">
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "relative p-2.5 rounded-full border border-white/10 text-slate-300 active:scale-95 transition-all outline-none overflow-hidden",
                            "bg-white/5 hover:bg-white/8",
                            show
                                ? "opacity-100 pointer-events-auto"
                                : "lg:hidden",
                        )}
                    >
                        <Menu className="size-5 relative z-10" />
                    </button>
                </SheetTrigger>

                <SheetContent
                    noCLose
                    side={side}
                    className="bg-[#060608] border-white/8 text-white rounded-t-[2rem] outline-none h-[90vh] p-0 overflow-hidden"
                >
                    {/* Ambient glow */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-80 h-40 bg-purple-600/8 rounded-full blur-[80px]" />
                        <div className="absolute top-0 right-1/4 w-80 h-40 bg-cyan-600/6 rounded-full blur-[80px]" />
                    </div>

                    {/* Pull indicator */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 rounded-full bg-white/15" />
                    </div>

                    <SheetHeader className="flex flex-row items-center justify-between px-6 pt-3 pb-2 text-left">
                        <Link
                            to="/"
                            onClick={() => onOpenChange(false)}
                            className="flex flex-col gap-0.5"
                        >
                            <SheetTitle className="text-xl font-black tracking-tight text-white">
                                Explore
                            </SheetTitle>
                            <p className="text-[9px] text-purple-400 font-bold uppercase tracking-[0.2em]">
                                Navigation
                            </p>
                        </Link>

                        <SheetClose asChild>
                            <button
                                type="button"
                                className="p-2.5 bg-white/5 rounded-full text-slate-400 hover:text-white outline-none active:scale-90 transition-transform border border-white/8"
                            >
                                <X className="size-5" />
                            </button>
                        </SheetClose>
                    </SheetHeader>

                    <div className="px-5 pb-12 pt-4 h-full overflow-y-auto custom-scrollbar">
                        {/* Nav links */}
                        <div className="space-y-1">
                            {allLinks.map((link, index) => {
                                const isActive = location.pathname === link.href;
                                const gradient =
                                    linkGradients[link.label] ??
                                    "from-slate-500 to-slate-600";
                                return (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.05 + index * 0.04,
                                            duration: 0.3,
                                        }}
                                    >
                                        <Link
                                            to={link.href}
                                            onClick={() => onOpenChange(false)}
                                            className={cn(
                                                "flex items-center gap-4 py-3.5 px-3 rounded-2xl transition-all group active:scale-[0.98]",
                                                isActive
                                                    ? "bg-white/6 border border-white/8"
                                                    : "active:bg-white/5",
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-active:scale-90",
                                                    isActive
                                                        ? `bg-linear-to-br ${gradient} shadow-lg`
                                                        : "bg-white/8",
                                                )}
                                            >
                                                <link.icon
                                                    className={cn(
                                                        "size-5",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-slate-400 group-active:text-white",
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span
                                                    className={cn(
                                                        "text-base font-bold",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-slate-300",
                                                    )}
                                                >
                                                    {link.label}
                                                </span>
                                                {link.label === "Pricing" && (
                                                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                                        <Sparkles className="size-2.5" />
                                                        Sale
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronRight
                                                className={cn(
                                                    "size-4 transition-transform group-active:translate-x-1",
                                                    isActive
                                                        ? "text-white/60"
                                                        : "text-slate-700",
                                                )}
                                            />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="mt-8 pt-6 border-t border-white/6 grid grid-cols-2 gap-3 pb-20"
                        >
                            <Link
                                to="/login"
                                onClick={() => onOpenChange(false)}
                                className="flex items-center justify-center gap-2 py-4 text-slate-300 font-bold bg-white/5 rounded-2xl active:scale-95 transition-transform border border-white/6 hover:bg-white/8"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => onOpenChange(false)}
                                className="relative flex items-center justify-center gap-2 py-4 bg-linear-to-br from-purple-500 via-indigo-600 to-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-transform overflow-hidden"
                            >
                                {/* Shimmer */}
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatDelay: 2,
                                    }}
                                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent skew-x-12"
                                />
                                <span className="relative z-10">Join Now</span>
                                <ArrowRight className="size-3.5 relative z-10" />
                            </Link>
                        </motion.div>
                    </div>
                </SheetContent>
            </Sheet>
            <UserMenu />
        </div>
    );
}