import { useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Edit, Key, Loader2, Shield, User } from "lucide-react";
import { useState } from "react";
import { Table } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { orpc } from "@/lib/orpc";
import { UserAccessPanel } from "./user-access-panel";

type UserAccess = {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
	roles: Array<{
		id: string;
		name: string;
		description: string | null;
		assignedAt: string;
		assignedBy: string | null;
	}>;
	permissions: Array<{
		id: string;
		name: string;
		description: string | null;
		resource: string;
		action: string;
		isDirect: boolean;
		expiresAt: string | null;
		grantedBy: string | null;
	}>;
	createdAt: string;
};

const roleOptions = [
	{ label: "Admin", icon: Shield, color: "text-red-500" },
	{ label: "Moderator", icon: Key, color: "text-blue-500" },
	{ label: "User", icon: User, color: "text-gray-500" },
];

export function AccessControlPage() {
	const [selectedUser, setSelectedUser] = useState<UserAccess | null>(null);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const { data, isLoading } = useQuery(
		orpc.users.listUsersWithAccess.queryOptions({
			input: {
				page: 1,
				limit: 10,
			},
			queryKey: ["users-access"],
		}),
	);

	const getRoleBadgeColor = (roleName: string) => {
		const colors: Record<string, string> = {
			ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
			MODERATOR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
			USER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
		};
		return (
			colors[roleName] ||
			"bg-purple-500/10 text-purple-500 border-purple-500/20"
		);
	};

	const handleEditAccess = (user: UserAccess) => {
		setSelectedUser(user);
		setIsSheetOpen(true);
	};

	const columns: ColumnDef<UserAccess>[] = [
		{
			accessorKey: "email",
			header: "User",
			cell: ({ row }) => (
				<div className="flex items-center gap-3">
					{row.original.image ? (
						<img
							src={row.original.image}
							alt={row.original.name || "User"}
							className="h-8 w-8 rounded-full"
						/>
					) : (
						<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
							<User className="h-4 w-4 text-muted-foreground" />
						</div>
					)}
					<div>
						<p className="font-medium">{row.original.name || "Anonymous"}</p>
						<p className="text-xs text-muted-foreground">
							{row.original.email}
						</p>
					</div>
				</div>
			),
		},
		{
			accessorKey: "roles",
			header: "Roles",
			cell: ({ row }) => (
				<div className="flex flex-wrap gap-1.5">
					{row.original.roles.length > 0 ? (
						row.original.roles.map((role) => (
							<Badge key={role.id} className={getRoleBadgeColor(role.name)}>
								{role.name}
							</Badge>
						))
					) : (
						<span className="text-sm text-muted-foreground">No roles</span>
					)}
				</div>
			),
		},
		{
			accessorKey: "permissions",
			header: "Permissions",
			cell: ({ row }) => {
				const directPermissions = row.original.permissions.filter(
					(p) => p.isDirect,
				);
				const totalPermissions = row.original.permissions.length;

				return (
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">
							{totalPermissions} total
						</span>
						{directPermissions.length > 0 && (
							<Badge variant="outline" className="text-xs">
								{directPermissions.length} direct
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Joined",
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{new Date(row.original.createdAt).toLocaleDateString()}
				</span>
			),
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleEditAccess(row.original)}
					className="h-8 px-3"
				>
					<Edit className="h-4 w-4 mr-2" />
					Manage Access
				</Button>
			),
		},
	];

	const table = useReactTable<UserAccess>({
		data: data?.users || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.totalPages || 0,
	});

	return (
		<>
			<div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
					<p className="text-muted-foreground">
						Manage user roles and permissions across your platform
					</p>
				</div>

				{isLoading ? (
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				) : (
					<Table.Root table={table}>
						<div className="space-y-4">
							<div className="flex flex-col md:flex-row items-center gap-3 px-6 py-5 bg-muted/5 border-b border-border/40 rounded-t-[2rem]">
								<div className="flex-1 w-full md:w-auto">
									<Table.Search
										columnId="email"
										placeholder="Search by name or email..."
									/>
								</div>
								<Table.StatusFilters
									columnId="roles"
									title="Role"
									options={roleOptions}
								/>
							</div>

							<Table.Body columnsCount={columns.length} />

							<Table.Pagination />
						</div>
					</Table.Root>
				)}
			</div>

			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetContent className="sm:max-w-2xl overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Manage User Access</SheetTitle>
						<SheetDescription>
							Assign roles and permissions to{" "}
							{selectedUser?.name || selectedUser?.email}
						</SheetDescription>
					</SheetHeader>
					{selectedUser && (
						<UserAccessPanel
							user={selectedUser}
							onClose={() => setIsSheetOpen(false)}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
