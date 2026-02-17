import { AnimatePresence, motion } from "framer-motion";
import { Camera, Palette, Settings2, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouteContext } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function ProfileSettingsModal() {
    const { auth: session } = useRouteContext({ from: "__root__" });
    const user = session?.user;
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Identity", icon: User },
        { id: "appearance", label: "Interface", icon: Palette },
        { id: "privacy", label: "Security", icon: ShieldCheck },
    ];

    return (
        <AppDialog
            component="drawer"
            title="System Preferences"
            description="Configure your digital environment"
            // CHANGE: Removed w-20. Let the drawer handle its own width or use max-w-2xl
            className="max-w-3xl w-full mx-auto"
            trigger={
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                    <Settings2 className="w-5 h-5 text-muted-foreground" />
                </Button>
            }
        >
            {/* Added overflow-y-auto and max-h to ensure it's scrollable on mobile */}
            <div className="p-4 md:p-6 max-h-[85vh] overflow-y-auto custom-scrollbar max-w-full w-full flex-1">
                <div className=" flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-48 shrink-0 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap flex-1 md:flex-none",
                                        isActive ? "text-black" : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    <Icon className="w-4 h-4 z-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest z-10">
                                        {tab.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-glow"
                                            className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className=" bg-zinc-900/60 rounded-3xl border border-white/5 p-6 md:p-8 relative overflow-hidden min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full relative z-10"
                            >
                                {activeTab === "profile" && (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="relative group shrink-0">
                                                <Image
                                                    src={user?.image}
                                                    className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-primary/50 transition-all"
                                                />
                                                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <Camera className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-center sm:text-left">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Identity Token</h4>
                                                <p className="text-sm font-bold text-white">{user?.name}</p>
                                                <Button size="sm" variant="link" className="text-[10px] p-0 h-auto uppercase tracking-widest text-muted-foreground hover:text-primary">
                                                    Update Avatar
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Profile Alias</Label>
                                                <Input defaultValue={user?.name} className="bg-black/40 border-white/10 rounded-xl h-12 focus:ring-1 focus:ring-primary/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">System Mailbox</Label>
                                                <Input defaultValue={user?.email} className="bg-black/40 border-white/10 rounded-xl h-12 focus:ring-1 focus:ring-primary/50" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Uplink Verified
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="ghost" className="flex-1 sm:flex-none text-[10px] font-black uppercase">Discard</Button>
                        <Button className="flex-1 sm:flex-none bg-primary text-black text-[10px] font-black uppercase tracking-widest px-8 rounded-xl">
                            Commit
                        </Button>
                    </div>
                </div>
            </div>
        </AppDialog>
    );
}
