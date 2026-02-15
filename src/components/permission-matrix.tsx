"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

type Permission = {
    id: string;
    name: string;
    description: string | null;
    resource: string;
    action: string;
};

type PermissionMatrixProps = {
    permissions: Permission[];
    userPermissionIds?: string[];
    onPermissionToggle?: (permissionId: string, enabled: boolean) => void;
    readOnly?: boolean;
    title?: string;
    description?: string;
};

export function PermissionMatrix({
    permissions,
    userPermissionIds = [],
    onPermissionToggle,
    readOnly = false,
    title = "Permission Matrix",
    description = "View and manage permissions organized by resource and action",
}: PermissionMatrixProps) {
    // Group permissions by resource
    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};

        for (const permission of permissions) {
            if (!groups[permission.resource]) {
                groups[permission.resource] = [];
            }
            groups[permission.resource].push(permission);
        }

        // Sort permissions within each group by action
        for (const resource in groups) {
            groups[resource].sort((a, b) => a.action.localeCompare(b.action));
        }

        return groups;
    }, [permissions]);

    // Get all unique actions across all resources
    const allActions = useMemo(() => {
        const actions = new Set<string>();
        for (const permission of permissions) {
            actions.add(permission.action);
        }
        return Array.from(actions).sort();
    }, [permissions]);

    const isPermissionEnabled = (permissionId: string) => {
        return userPermissionIds.includes(permissionId);
    };

    const getPermissionByResourceAction = (resource: string, action: string) => {
        return permissions.find((p) => p.resource === resource && p.action === action);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px] font-semibold">Resource</TableHead>
                                {allActions.map((action) => (
                                    <TableHead key={action} className="text-center">
                                        <Badge variant="secondary" className="capitalize">
                                            {action}
                                        </Badge>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(groupedPermissions).map(([resource, resourcePerms]) => (
                                <TableRow key={resource}>
                                    <TableCell className="font-medium">
                                        <Badge variant="outline" className="capitalize">
                                            {resource}
                                        </Badge>
                                    </TableCell>
                                    {allActions.map((action) => {
                                        const permission = getPermissionByResourceAction(resource, action);
                                        const isEnabled = permission
                                            ? isPermissionEnabled(permission.id)
                                            : false;

                                        return (
                                            <TableCell key={action} className="text-center">
                                                {permission ? (
                                                    <div className="flex items-center justify-center">
                                                        {readOnly ? (
                                                            <div
                                                                className={`h-6 w-6 rounded flex items-center justify-center ${isEnabled
                                                                    ? "bg-green-500/10 text-green-500"
                                                                    : "bg-gray-500/10 text-gray-500"
                                                                    }`}
                                                            >
                                                                {isEnabled ? (
                                                                    <Check className="h-4 w-4" />
                                                                ) : (
                                                                    <X className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Checkbox
                                                                checked={isEnabled}
                                                                onCheckedChange={(checked) => {
                                                                    onPermissionToggle?.(
                                                                        permission.id,
                                                                        checked === true
                                                                    );
                                                                }}
                                                                title={permission.name}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <div className="h-6 w-6 rounded bg-gray-500/5 flex items-center justify-center">
                                                            <span className="text-xs text-muted-foreground">
                                                                —
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Permission Legend */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Legend</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-green-500/10 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-500" />
                            </div>
                            <span>Permission enabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-500/10 flex items-center justify-center">
                                <X className="h-3 w-3 text-gray-500" />
                            </div>
                            <span>Permission disabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-500/5 flex items-center justify-center">
                                <span className="text-xs">—</span>
                            </div>
                            <span>Permission not available for this resource</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
