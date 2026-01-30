import { Store } from "@tanstack/store";

// Types for our State
export type NotificationType = "system" | "alert" | "message";

export interface NotificationItem {
	id: string;
	title: string;
	description: string;
	time: string;
	read: boolean;
	type: NotificationType;
}

export interface DashboardState {
	notifications: NotificationItem[];
	searchOpen: boolean;
	mobileSidebarOpen: boolean;
}

// store/dashboard-store.ts additions
export interface MessageItem {
	id: string;
	user: string;
	preview: string;
	time: string;
	unread: boolean;
}

export interface DashboardState {
	notifications: NotificationItem[];
	messages: MessageItem[]; // Add this
	searchOpen: boolean;
	notificationOpen: boolean; // Add this
	mobileSidebarOpen: boolean;
}

export const dashboardStore = new Store<DashboardState>({
	notifications: [
		{
			id: "1",
			title: "New System Update",
			description: "v2.4.0 is now live.",
			time: "2m ago",
			read: false,
			type: "system",
		},
		{
			id: "2",
			title: "Server Warning",
			description: "High CPU usage detected.",
			time: "15m ago",
			read: false,
			type: "alert",
		},
	],
	messages: [
		{
			id: "1",
			user: "John Doe",
			preview: "Hey, I can't access the library...",
			time: "1h ago",
			unread: true,
		},
	],
	searchOpen: false,
	notificationOpen: false,
	mobileSidebarOpen: false,
});

export const actions = {
	setSearchOpen: (open: boolean) =>
		dashboardStore.setState((state) => ({ ...state, searchOpen: open })),

	setMobileSidebarOpen: (open: boolean) =>
		dashboardStore.setState((state) => ({ ...state, mobileSidebarOpen: open })),

	markAsRead: (id: string) => {
		dashboardStore.setState((state) => ({
			...state,
			notifications: state.notifications.map((n) =>
				n.id === id ? { ...n, read: true } : n,
			),
		}));
	},

	markAllRead: () => {
		dashboardStore.setState((state) => ({
			...state,
			notifications: state.notifications.map((n) => ({ ...n, read: true })),
		}));
	},

	addNotification: (notif: Omit<NotificationItem, "id" | "read" | "time">) => {
		dashboardStore.setState((state) => ({
			...state,
			notifications: [
				{
					...notif,
					id: Math.random().toString(),
					read: false,
					time: "Just now",
				},
				...state.notifications,
			],
		}));
	},
	setNotificationOpen: (open: boolean) =>
		dashboardStore.setState((state) => ({ ...state, notificationOpen: open })),

	markMessageRead: (id: string) =>
		dashboardStore.setState((state) => ({
			...state,
			messages: state.messages.map((m) =>
				m.id === id ? { ...m, unread: false } : m,
			),
		})),
};
