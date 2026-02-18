import {
    Circle,
    CircleDot,
    Crown,
    Shield,
    ShieldCheck,
    Sparkles,
    User,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionBadgeProps {
    status: string;
    currentPlan?: string | null;
}

export const SubscriptionBadge = ({ status, currentPlan }: SubscriptionBadgeProps) => {
    // Plan-based badges (when we have currentPlan)
    const planBadges: Record<string, {
        icon: any;
        label: string;
        color: string;
        bg: string;
        border: string;
        glow: boolean;
    }> = {
        "Free": {
            icon: Sparkles,
            label: "Free",
            color: "text-slate-400",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20",
            glow: false,
        },
        "Premium-Monthly": {
            icon: Zap,
            label: "Premium",
            color: "text-purple-400",
            bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
            border: "border-purple-500/40",
            glow: true,
        },
        "Premium-Yearly": {
            icon: Zap,
            label: "Premium Annual",
            color: "text-purple-300",
            bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
            border: "border-purple-400/50",
            glow: true,
        },
        "Family-Monthly": {
            icon: Crown,
            label: "Family",
            color: "text-amber-400",
            bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
            border: "border-amber-500/40",
            glow: true,
        },
        "Family-Yearly": {
            icon: Crown,
            label: "Family Annual",
            color: "text-amber-300",
            bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
            border: "border-amber-400/50",
            glow: true,
        },
    };

    // Status-based badges (fallback when no currentPlan)
    const statusBadges: Record<string, {
        icon: any;
        label: string;
        color: string;
        bg: string;
        border: string;
        glow: boolean;
    }> = {
        FREE: {
            icon: CircleDot,
            label: "Free",
            color: "text-slate-400",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20",
            glow: false,
        },
        PREMIUM: {
            icon: Zap,
            label: "Premium",
            color: "text-purple-400",
            bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
            border: "border-purple-500/40",
            glow: true,
        },
        FAMILY: {
            icon: Crown,
            label: "Family",
            color: "text-amber-400",
            bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
            border: "border-amber-500/40",
            glow: true,
        },
        CANCELLED: {
            icon: Circle,
            label: "Cancelled",
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            glow: false,
        },
    };

    // Use currentPlan if available, otherwise fall back to status
    const badge = currentPlan && planBadges[currentPlan]
        ? planBadges[currentPlan]
        : statusBadges[status as keyof typeof statusBadges] || statusBadges.FREE;

    const Icon = badge.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium relative",
            badge.bg,
            badge.border,
            badge.color,
            badge.glow && "shadow-lg"
        )}>
            {badge.glow && (
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600/20 to-pink-600/20 blur-sm" />
            )}
            <Icon className="size-3.5 relative z-10" />
            <span className="relative z-10">{badge.label}</span>
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
