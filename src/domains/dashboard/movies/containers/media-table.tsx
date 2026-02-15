import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
    type ColumnFiltersState,
    getCoreRowModel,
    type Row,
    useReactTable,
} from "@tanstack/react-table";
import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock,
    Filter,
    Plus,
    SlidersHorizontal,
    Video,
    X,
    XCircle,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { AppDialog } from "@/components/app-dialog";
import { Table } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCSV } from "@/lib/utils";
import { MediaAdvancedFilterContent } from "../components/media-advanced-filter";
import { mediaColumns } from "../components/media-columns";
import { bulkDeleteMediaAction, fetchMediaAction, type MediaItem, mediaUIStore } from "../media.store";

interface MediaManagementTableProps {
    initialData?: {
        items: MediaItem[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export function MediaManagementTable({ initialData }: MediaManagementTableProps) {
    const { media, isLoading, error, currentPage, totalPages, total } = useStore(mediaUIStore);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [searchQuery, setSearchQuery] = React.useState("");
    const navigate = useNavigate();

    // Sync pagination state with store
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 50,
    });

    // Update pageIndex when store's currentPage changes
    React.useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: (currentPage || 1) - 1,
        }));
    }, [currentPage]);

    // Initialize store with server-loaded data for instant display
    React.useEffect(() => {
        if (initialData && media.length === 0) {
            mediaUIStore.setState((s) => ({
                ...s,
                media: initialData.items,
                total: initialData.pagination.total,
                currentPage: initialData.pagination.page,
                totalPages: initialData.pagination.totalPages,
                isLoading: false,
            }));
        } else if (!initialData) {
            // Fallback to client-side fetch if no initial data
            fetchMediaAction();
        }
    }, [initialData, media.length]);

    // Debounced search effect
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== undefined) {
                // Reset to page 1 when searching
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                fetchMediaAction(1, pagination.pageSize, searchQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    // Fetch new data when pagination changes (user action)
    React.useEffect(() => {
        const page = pagination.pageIndex + 1;
        const limit = initialData?.pagination?.limit || 50;
        // Only fetch if the page or pageSize actually changed from user interaction
        if (page > 0 && (page !== currentPage || pagination.pageSize !== limit)) {
            fetchMediaAction(page, pagination.pageSize, searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize, currentPage]);
    const applySegment = (segment: "all" | "movies" | "episodes" | "draft" | "published") => {
        switch (segment) {
            case "movies":
                setColumnFilters([{ id: "type", value: ["MOVIE"] }]);
                break;
            case "episodes":
                setColumnFilters([{ id: "type", value: ["EPISODE"] }]);
                break;
            case "draft":
                setColumnFilters([{ id: "status", value: ["DRAFT", "REVIEW"] }]);
                break;
            case "published":
                setColumnFilters([{ id: "status", value: ["PUBLISHED"] }]);
                break;
            default:
                setColumnFilters([]);
        }
        toast.success(`Switched to ${segment} segment`);
    };

    const table = useReactTable({
        data: media,
        columns: mediaColumns,
        state: { columnFilters, rowSelection, pagination },
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        pageCount: totalPages || 1,
        rowCount: total || 0,
        filterFns: {
            multiSelect: (row, columnId, filterValue) => {
                if (
                    !filterValue ||
                    filterValue === "" ||
                    (Array.isArray(filterValue) && filterValue.length === 0)
                )
                    return true;
                const rowValue = String(row.getValue(columnId)).toLowerCase();
                if (Array.isArray(filterValue)) {
                    return filterValue.some(
                        (val) => String(val).toLowerCase() === rowValue,
                    );
                }
                return String(filterValue).toLowerCase() === rowValue;
            },
            fuzzy: (row, columnId, value) => {
                const itemValue = String(row.getValue(columnId)).toLowerCase();
                const filterValue = String(value).toLowerCase();
                return filterValue === "" || itemValue.includes(filterValue);
            },
            dateRange: (row, columnId, value) => {
                const rowValue = row.getValue(columnId);
                if (!rowValue || !value) return true;

                const date = new Date(rowValue as string | number | Date);
                const { from, to } = value as DateRange;

                if (from && to) {
                    return date >= from && date <= to;
                }
                if (from) {
                    return date >= from;
                }
                return true;
            },
        },
    });

    const mediaStatusOptions = [
        { label: "Published", icon: CheckCircle2, color: "text-emerald-500" },
        { label: "Draft", icon: Clock, color: "text-amber-500" },
        { label: "Review", icon: Clock, color: "text-blue-500" },
        { label: "Rejected", icon: XCircle, color: "text-destructive" },
    ];

    const handleDelete = async (rows: Row<MediaItem>[]) => {
        const ids = rows.map((row) => row.original.id);
        const success = await bulkDeleteMediaAction(ids);
        if (success) {
            toast.success(`Deleted ${rows.length} media items`);
            table.toggleAllRowsSelected(false);
        } else {
            toast.error("Failed to delete media");
        }
    };

    const handleDownload = (rows: Row<MediaItem>[]) => {
        downloadCSV(rows, "media-export");
        toast.success("Download Started");
    };

    const handleCreateNew = () => {
        navigate({ to: "/dashboard/movies/create" });
    };

    if (error)
        return (
            <div className="p-16 text-center border-2 border-dashed rounded-[2rem]">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h3 className="font-bold text-lg italic uppercase tracking-tight">
                    Sync Error
                </h3>
                <p className="text-muted-foreground text-sm font-medium">{error}</p>
            </div>
        );

    return (
        <Table.Root table={table}>
            <div className="space-y-0">
                {/* 1. COMMAND BAR */}
                <div className="flex flex-col md:flex-row items-center gap-3 px-6 py-5 bg-muted/5 border-b border-border/40">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative w-full max-w-md">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                            <input
                                type="text"
                                placeholder="Search media by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 h-11 bg-card/40 border border-border/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 rounded-xl gap-2 text-[10px] font-bold uppercase border-dashed border-border/60 hover:bg-background"
                                >
                                    <Filter className="h-3.5 w-3.5 text-primary" />
                                    Segment:{" "}
                                    {columnFilters.length > 0 ? "Custom" : "All"}
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-xl p-1 shadow-2xl border-border/40"
                            >
                                <DropdownMenuItem
                                    onClick={() => applySegment("all")}
                                    className="text-[10px] font-bold uppercase py-2"
                                >
                                    All Media
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => applySegment("movies")}
                                    className="text-[10px] font-bold uppercase py-2 text-primary"
                                >
                                    Movies Only
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => applySegment("episodes")}
                                    className="text-[10px] font-bold uppercase py-2 text-blue-600"
                                >
                                    Episodes Only
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => applySegment("draft")}
                                    className="text-[10px] font-bold uppercase py-2 text-amber-600"
                                >
                                    Drafts & Review
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => applySegment("published")}
                                    className="text-[10px] font-bold uppercase py-2 text-emerald-600"
                                >
                                    Published
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <AppDialog
                            component="drawer"
                            title="Advanced Filters"
                            description="Filter by genre, release year, ratings, and more."
                            trigger={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 rounded-xl gap-2 text-[10px] font-bold uppercase hover:bg-background"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Advanced
                                    {columnFilters.length > 0 && (
                                        <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
                                            {columnFilters.length}
                                        </span>
                                    )}
                                </Button>
                            }
                        >
                            <MediaAdvancedFilterContent
                                onApply={setColumnFilters}
                                currentFilters={columnFilters}
                            />
                        </AppDialog>

                        <div className="h-4 w-px bg-border mx-2 hidden md:block" />
                        {columnFilters.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => setColumnFilters([])}
                                className="h-10 rounded-xl px-3 text-[10px] font-black uppercase text-destructive hover:bg-destructive/5"
                            >
                                <X className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* 2. SUB-BAR */}
                <div className="flex items-center justify-between px-6 py-4 bg-background/50 border-b border-border/40">
                    <Table.StatusFilters
                        columnId="status"
                        title="Media Status"
                        options={mediaStatusOptions}
                    />

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleCreateNew}
                            size="sm"
                            className="h-9 rounded-xl gap-2 text-[10px] font-bold uppercase shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Media
                        </Button>

                        <Table.BulkActions
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                            deleteTitle="Confirm Deletion"
                            deleteDescription="This will permanently delete all selected media items."
                        />
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                            <Video className="inline h-3 w-3 mr-1" />
                            {table.getFilteredRowModel().rows.length} Results
                        </div>
                    </div>
                </div>

                {/* 3. TABLE BODY */}
                <div className="p-2">
                    {isLoading ? (
                        <Table.Loading columnsCount={9} rowsCount={pagination.pageSize} />
                    ) : (
                        <Table.Body<MediaItem>
                            onRowDoubleClick={(row) =>
                                navigate({
                                    to: "/dashboard/movies/edit",
                                    search: { mediaId: row.original.id },
                                })
                            }
                            columnsCount={9}
                        />
                    )}
                </div>

                {/* 4. PAGINATION */}
                <div className="px-6 py-4 border-t border-border/40">
                    <Table.Pagination />
                </div>
            </div>
        </Table.Root>
    );
}
