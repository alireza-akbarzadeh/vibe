import {
    Circle,
    CircleDot,
    Crown,
    Shield,
    ShieldCheck,
    User,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";


export const SubscriptionBadge = ({ status }: { status: string }) => {
    const badges = {
        FREE: {
            icon: CircleDot,
            label: "Free",
            color: "text-slate-400",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20",
        },
        PRO: {
            icon: Zap,
            label: "Pro",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
        },
        PREMIUM: {
            icon: Crown,
            label: "Premium",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
        },
        CANCELLED: {
            icon: Circle,
            label: "Cancelled",
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
        },
    };

    const badge = badges[status as keyof typeof badges] || badges.FREE;
    const Icon = badge.icon;
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
            badge.bg,
            badge.border,
            badge.color
        )}>
            <Icon className="size-3.5" />
            <span>{badge.label}</span>
        </div>
    );
};

// Role badge component
export const RoleBadge = ({ role }: { role: string }) => {
    const badges = {
        ADMIN: {
            icon: ShieldCheck,
            label: "Admin",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
        },
        MODERATOR: {
            icon: Shield,
            label: "Moderator",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
        },
        USER: {
            icon: User,
            label: "Member",
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
        },
    };

    const badge = badges[role as keyof typeof badges] || badges.USER;
    const Icon = badge.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
            badge.bg,
            badge.border,
            badge.color
        )}>
            <Icon className="size-3.5" />
            <span>{badge.label}</span>
        </div>
    );
};
