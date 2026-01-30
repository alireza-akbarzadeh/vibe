import { useNavigate } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { ICON_MAP, type SidebarGroup } from "@/config/admin-sidebar";

type IconMapType = Record<string, React.ComponentType<{ className?: string }>>;

interface CommandSettingProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: SidebarGroup[];
}
export type FlatSearchItem = {
    label: string;
    href: string;
    icon?: string;
    groupName: string;
    parentLabel: string | null;
    permission?: string;
};

export function SearchSide({ open, setOpen, data }: CommandSettingProps) {
    const navigate = useNavigate();

    const flatItems = useMemo(() => {
        const items: FlatSearchItem[] = [];

        data.forEach((group) => {
            group.items.forEach((item) => {
                if (item.href) {
                    items.push({
                        label: item.label,
                        href: item.href,
                        icon: item.icon,
                        groupName: group.group,
                        parentLabel: null,
                        permission: item.permission,
                    });
                }

                if (item.children) {
                    item.children.forEach((child) => {
                        if (child.href) {
                            items.push({
                                label: child.label,
                                href: child.href,
                                icon: child.icon || item.icon,
                                groupName: group.group,
                                parentLabel: item.label,
                                permission: child.permission || item.permission,
                            });
                        }
                    });
                }
            });
        });

        return items;
    }, [data]);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [setOpen]);

    const onSelect = (href: string) => {
        setOpen(false);
        navigate({ to: href });
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search pages, tools, or staff settings..." />
            <CommandList className="custom-scrollbar">
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Navigation">
                    {flatItems.map((item, index) => {
                        const Icon = item.icon ? (ICON_MAP as IconMapType)[item.icon] : FileText;
                        return (
                            <CommandItem
                                key={`${item.href}-${index}`}
                                onSelect={() => item.href && onSelect(item.href)}
                                className="flex items-center gap-3 py-3 cursor-pointer"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/50 transition-colors group-hover:bg-background">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{item.label}</span>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        <span>{item.groupName}</span>
                                        {item.parentLabel && (
                                            <>
                                                <span className="opacity-40">/</span>
                                                <span className="text-primary/70">{item.parentLabel}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>

                <CommandSeparator />

                {/* Account Actions Stay Here */}
                <CommandGroup heading="System Actions">
                    <CommandItem onSelect={() => onSelect('/dashboard/settings/general')}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border mr-2">
                            <Search className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Quick Settings</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}