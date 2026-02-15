"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { client } from "@/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, X, Plus, Loader2, Check } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

type UserAccessPanelProps = {
    user: UserAccess;
    onClose: () => void;
};

export function UserAccessPanel({ user }: UserAccessPanelProps) {
    const queryClient = useQueryClient();
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [isAddingPermission, setIsAddingPermission] = useState(false);

    // Fetch all roles
    const { data: rolesData } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            return await client.roles.list({});
        },
    });

    // Fetch all permissions
    const { data: permissionsData } = useQuery({
        queryKey: ["permissions"],
        queryFn: async () => {
            return await client.permissions.list({});
        },
    });

    // Assign role mutation
    const assignRoleMutation = useMutation({
        mutationFn: async (roleId: string) => {
            return await client.roles.assignRole({
                userId: user.id,
                roleId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-access"] });
            queryClient.invalidateQueries({ queryKey: ["user-access", user.id] });
            toast.success("Role assigned successfully");
            setIsAddingRole(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to assign role");
        },
    });

    // Remove role mutation
    const removeRoleMutation = useMutation({
        mutationFn: async (roleId: string) => {
            return await client.roles.removeRoleFromUser({
                userId: user.id,
                roleId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-access"] });
            queryClient.invalidateQueries({ queryKey: ["user-access", user.id] });
            toast.success("Role removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to remove role");
        },
    });

    // Assign permission mutation
    const assignPermissionMutation = useMutation({
        mutationFn: async (permissionId: string) => {
            return await client.users.assignUserPermission({
                userId: user.id,
                permissionId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-access"] });
            queryClient.invalidateQueries({ queryKey: ["user-access", user.id] });
            toast.success("Permission assigned successfully");
            setIsAddingPermission(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to assign permission");
        },
    });

    // Remove permission mutation
    const removePermissionMutation = useMutation({
        mutationFn: async (permissionId: string) => {
            return await client.users.removeUserPermission({
                userId: user.id,
                permissionId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-access"] });
            queryClient.invalidateQueries({ queryKey: ["user-access", user.id] });
            toast.success("Permission removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to remove permission");
        },
    });

    const availableRoles =
        rolesData?.data?.filter((role: any) => !user.roles.some((ur) => ur.id === role.id)) || [];

    const availablePermissions =
        permissionsData?.data?.filter((perm: any) => !user.permissions.some((up) => up.id === perm.id)) ||
        [];

    const directPermissions = user.permissions.filter((p) => p.isDirect);
    const inheritedPermissions = user.permissions.filter((p) => !p.isDirect);

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
            MODERATOR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            USER: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        };
        return colors[roleName] || "bg-purple-500/10 text-purple-500 border-purple-500/20";
    };

    return (
        <div className="space-y-6 mt-6">
            {/* Roles Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Roles
                    </CardTitle>
                    <CardDescription>Manage user role assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {user.roles.map((role) => (
                            <div
                                key={role.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div>
                                    <Badge className={getRoleBadgeColor(role.name)}>{role.name}</Badge>
                                    {role.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {role.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Assigned: {new Date(role.assignedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRoleMutation.mutate(role.id)}
                                    disabled={removeRoleMutation.isPending}
                                >
                                    {removeRoleMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>

                    {isAddingRole ? (
                        <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                            <Label>Select Role</Label>
                            <Select
                                onValueChange={(value) => {
                                    assignRoleMutation.mutate(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRoles.map((role: any) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingRole(false)}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingRole(true)}
                            disabled={availableRoles.length === 0}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Role
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Direct Permissions Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Direct Permissions</CardTitle>
                    <CardDescription>Permissions assigned directly to this user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {directPermissions.map((permission) => (
                            <div
                                key={permission.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{permission.resource}</Badge>
                                        <Badge variant="secondary">{permission.action}</Badge>
                                    </div>
                                    <p className="text-sm font-medium mt-1">{permission.name}</p>
                                    {permission.description && (
                                        <p className="text-xs text-muted-foreground">
                                            {permission.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePermissionMutation.mutate(permission.id)}
                                    disabled={removePermissionMutation.isPending}
                                >
                                    {removePermissionMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        ))}

                        {directPermissions.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No direct permissions assigned
                            </p>
                        )}
                    </div>

                    {isAddingPermission ? (
                        <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                            <Label>Select Permission</Label>
                            <Select
                                onValueChange={(value) => {
                                    assignPermissionMutation.mutate(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a permission..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePermissions.map((perm: any) => (
                                        <SelectItem key={perm.id} value={perm.id}>
                                            {perm.name} ({perm.resource}:{perm.action})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingPermission(false)}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingPermission(true)}
                            disabled={availablePermissions.length === 0}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Permission
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Inherited Permissions Section */}
            {inheritedPermissions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Inherited Permissions</CardTitle>
                        <CardDescription>Permissions granted through role assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {inheritedPermissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50"
                                >
                                    <Check className="h-4 w-4 text-green-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{permission.resource}</Badge>
                                            <Badge variant="secondary">{permission.action}</Badge>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{permission.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
