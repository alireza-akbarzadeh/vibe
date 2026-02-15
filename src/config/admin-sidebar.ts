// config/admin-sidebar.ts
import {
	Activity,
	AlertTriangle,
	BarChart3,
	Bell,
	CreditCard,
	Database,
	FileText,
	Film,
	Flag,
	FolderArchive,
	Globe,
	Headphones,
	Layers,
	LayoutDashboard,
	Library,
	MonitorPlay,
	Music,
	PlugZap,
	Server,
	Settings,
	Shield,
	Sparkles,
	Users,
} from "lucide-react";

export type SidebarItem = {
	label: string;
	href?: string;
	icon?: string;
	children?: SidebarItem[];
	permission?: string;
};

export type SidebarGroup = {
	group: string;
	items: SidebarItem[];
};

export const dashboard_SIDEBAR: SidebarGroup[] = [
	{
		group: "Overview",
		items: [
			{
				label: "Dashboard",
				href: "/dashboard",
				icon: "LayoutDashboard",
			},
		],
	},
	{
		group: "Users & Access",
		items: [
			{
				label: "Users",
				icon: "Users",
				children: [
					{ label: "Staff Directory", href: "/dashboard/users" },
					{ label: "Access Control", href: "/dashboard/access-control" },
					{ label: "Roles & Permissions", href: "/dashboard/roles" },
					{ label: "Audit Logs", href: "/dashboard/audit-logs" },
				],
			},
		],
	},
	{
		group: "Content Library",
		items: [
			{
				label: "Movies & Series",
				href: "/dashboard/movies",
				icon: "Film",
			},
			{
				label: "Music",
				icon: "Music",
				children: [
					{ label: "Artists", href: "/dashboard/music/artists" },
					{ label: "Albums", href: "/dashboard/music/albums" },
					{ label: "Tracks", href: "/dashboard/music/tracks" },
				],
			},
			{
				label: "Media Assets",
				icon: "FolderArchive",
				children: [
					{ label: "Media Library", href: "/dashboard/media" },
					{ label: "Uploads", href: "/dashboard/media/uploads" },
				],
			},
		],
	},
	{
		group: "Operations",
		items: [
			{
				label: "Streaming",
				icon: "MonitorPlay",
				children: [
					{ label: "Active Streams", href: "/dashboard/streams" },
					{ label: "Playback Errors", href: "/dashboard/playback/errors" },
					{ label: "DRM & Licenses", href: "/dashboard/drm" },
				],
			},
			{
				label: "Moderation",
				icon: "AlertTriangle",
				children: [
					{ label: "User Reports", href: "/dashboard/moderation/reports" },
					{ label: "DMCA & Copyright", href: "/dashboard/moderation/dmca" },
					{
						label: "Region Restrictions",
						href: "/dashboard/moderation/region-blocks",
					},
				],
			},
		],
	},
	{
		group: "Business",
		items: [
			{
				label: "Monetization",
				icon: "CreditCard",
				children: [
					{
						label: "Subscription Plans",
						href: "/dashboard/subscriptions/plans",
					},
					{
						label: "User Subscriptions",
						href: "/dashboard/subscriptions/users",
					},
					{ label: "Payments", href: "/dashboard/payments" },
				],
			},
			{
				label: "Analytics",
				icon: "BarChart3",
				children: [
					{ label: "Overview", href: "/dashboard/analytics" },
					{
						label: "Content Performance",
						href: "/dashboard/analytics/content",
					},
					{ label: "User Behavior", href: "/dashboard/analytics/users" },
					{ label: "Reports", href: "/dashboard/reports" },
				],
			},
			{
				label: "Discovery",
				icon: "Sparkles",
				children: [
					{ label: "Recommendations", href: "/dashboard/recommendations" },
					{ label: "Featured Content", href: "/dashboard/featured" },
					{ label: "A/B Testing", href: "/dashboard/ab-tests" },
				],
			},
		],
	},
	{
		group: "Support & Comms",
		items: [
			{
				label: "Support",
				href: "/dashboard/support",
				icon: "Headphones",
			},
			{
				label: "Communication",
				icon: "Bell",
				children: [
					{ label: "Notifications", href: "/dashboard/notifications" },
					{ label: "Campaigns", href: "/dashboard/campaigns" },
				],
			},
		],
	},
	{
		group: "System",
		items: [
			{
				label: "Infrastructure",
				icon: "Server",
				children: [
					{ label: "System Logs", href: "/dashboard/logs" },
					{ label: "Monitoring", href: "/dashboard/monitoring" },
					{ label: "Backups", href: "/dashboard/backups" },
				],
			},
			{
				label: "Settings",
				icon: "Settings",
				children: [
					{ label: "General", href: "/dashboard/settings/general" },
					{ label: "Localization", href: "/dashboard/settings/localization" },
					{ label: "Feature Flags", href: "/dashboard/settings/features" },
					{ label: "Integrations", href: "/dashboard/settings/integrations" },
				],
			},
			{
				label: "Legal",
				icon: "FileText",
				children: [
					{ label: "Terms of Service", href: "/dashboard/legal/terms" },
					{ label: "Privacy Policy", href: "/dashboard/legal/privacy" },
					{ label: "Licenses", href: "/dashboard/legal/licenses" },
				],
			},
		],
	},
];

export const ICON_MAP = {
	Activity,
	AlertTriangle,
	BarChart3,
	Bell,
	CreditCard,
	Database,
	FileText,
	Film,
	Flag,
	FolderArchive,
	Globe,
	Headphones,
	Layers,
	LayoutDashboard,
	Library,
	MonitorPlay,
	Music,
	PlugZap,
	Server,
	Settings,
	Shield,
	Sparkles,
	Users,
} as const;
