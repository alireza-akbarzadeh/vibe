import type { ColumnDef } from "@tanstack/react-table";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    FileVideo,
    Music,
    Play,
    Star,
    TrendingUp,
    Video,
    XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { MediaItem } from "../media.store";
import { MediaActions } from "../components/media-actions";

export const mediaColumns: ColumnDef<MediaItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                className="translate-y-0.5 rounded-md border-muted-foreground/30"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                className="translate-y-0.5 rounded-md border-muted-foreground/30"
            />
        ),
    },
    // 1. MEDIA TITLE & THUMBNAIL
    {
        accessorKey: "title",
        id: "title",
        header: "Media",
        cell: ({ row }) => {
            const { title, thumbnail, type, description } = row.original;
            const typeIcon = {
                MOVIE: <Video className="h-3 w-3 text-primary" />,
                EPISODE: <Play className="h-3 w-3 text-blue-500" />,
                TRACK: <Music className="h-3 w-3 text-purple-500" />,
            }[type];

            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="relative shrink-0">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="h-16 w-24 rounded-lg bg-muted border border-border/50 object-cover"
                        />
                        <div className="absolute -top-1 -right-1 rounded-full p-1 shadow-sm border border-background bg-background">
                            {typeIcon}
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[250px]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold truncate">{title}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate line-clamp-2">
                            {description}
                        </span>
                    </div>
                </div>
            );
        },
    },
    // 2. TYPE & COLLECTION
    {
        accessorKey: "type",
        id: "type",
        header: "Type",
        filterFn: "multiSelect" as never,
        cell: ({ row }) => {
            const { type } = row.original;
            const config = {
                MOVIE: { color: "bg-primary", icon: Video, label: "Movie" },
                EPISODE: { color: "bg-blue-500", icon: FileVideo, label: "Episode" },
                TRACK: { color: "bg-purple-500", icon: Music, label: "Track" },
            }[type];

            const Icon = config.icon;

            return (
                <div className="flex flex-col gap-1">
                    <Badge
                        className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 w-fit",
                            config.color,
                        )}
                    >
                        <Icon className="h-2.5 w-2.5 mr-1" />
                        {config.label}
                    </Badge>
                </div>
            );
        },
    },
    // 3. GENRES
    {
        accessorKey: "genres",
        header: "Genres",
        cell: ({ row }) => {
            const genres = row.original.genres || [];
            return (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {genres.slice(0, 3).map((mediaGenre) => (
                        <span
                            key={mediaGenre.genre.id}
                            className="text-[9px] px-2 py-0.5 bg-muted/50 rounded-full font-bold text-muted-foreground border border-border/50"
                        >
                            {mediaGenre.genre.name}
                        </span>
                    ))}
                    {genres.length > 3 && (
                        <span className="text-[9px] px-2 py-0.5 text-muted-foreground">
                            +{genres.length - 3}
                        </span>
                    )}
                </div>
            );
        },
    },
    // 4. CREATORS
    {
        accessorKey: "creators",
        header: "Creators",
        cell: ({ row }) => {
            const creators = row.original.creators || [];
            return (
                <div className="flex flex-col gap-0.5 max-w-[150px]">
                    {creators.slice(0, 2).map((mediaCreator) => (
                        <div
                            key={mediaCreator.creator.id}
                            className="text-[10px] font-medium truncate"
                        >
                            <span className="font-bold">{mediaCreator.creator.name}</span>
                            <span className="text-muted-foreground ml-1">
                                ({mediaCreator.role.toLowerCase()})
                            </span>
                        </div>
                    ))}
                    {creators.length > 2 && (
                        <span className="text-[9px] text-muted-foreground">
                            +{creators.length - 2} more
                        </span>
                    )}
                </div>
            );
        },
    },
    // 5. DURATION & RELEASE YEAR
    {
        accessorKey: "releaseYear",
        header: "Release",
        cell: ({ row }) => {
            const { duration, releaseYear } = row.original;
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{releaseYear}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                        <Clock className="h-2.5 w-2.5" />
                        {durationText}
                    </div>
                </div>
            );
        },
    },
    // 6. RATINGS & STATS
    {
        accessorKey: "rating",
        header: "Stats",
        cell: ({ row }) => {
            const { rating, reviewCount, viewCount, criticalScore } = row.original;
            return (
                <div className="flex flex-col gap-1 min-w-[120px]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold">
                                {rating?.toFixed(1) || "N/A"}
                            </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                            ({reviewCount || 0} reviews)
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                            <Eye className="h-2.5 w-2.5" />{" "}
                            {viewCount?.toLocaleString() || 0}
                        </span>
                        {criticalScore && (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-2.5 w-2.5" />
                                {criticalScore}%
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    // 7. STATUS
    {
        accessorKey: "status",
        id: "status",
        header: "Status",
        filterFn: "multiSelect" as never,
        cell: ({ row }) => {
            const status = row.original.status || "PUBLISHED";
            const config = {
                DRAFT: {
                    color: "bg-muted text-muted-foreground",
                    icon: Clock,
                    label: "Draft",
                },
                REVIEW: {
                    color: "bg-amber-500 text-white",
                    icon: Clock,
                    label: "Review",
                },
                PUBLISHED: {
                    color: "bg-emerald-500 text-white",
                    icon: CheckCircle2,
                    label: "Published",
                },
                REJECTED: {
                    color: "bg-destructive text-white",
                    icon: XCircle,
                    label: "Rejected",
                },
            }[status];

            const Icon = config.icon;

            return (
                <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", config.color)} />
                    <span className="text-xs font-bold uppercase tracking-tighter">
                        {config.label}
                    </span>
                    <Icon className="h-3 w-3 opacity-50" />
                </div>
            );
        },
    },
    // 8. CREATED DATE
    {
        accessorKey: "createdAt",
        id: "createdAt",
        header: "Created",
        filterFn: "dateRange" as never,
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return (
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold">
                        {date ? new Date(date).toLocaleDateString() : "N/A"}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">
                        {date ? new Date(date).toLocaleTimeString() : ""}
                    </span>
                </div>
            );
        },
    },
    // 9. ACTIONS
    {
        id: "actions",
        cell: ({ row }) => <MediaActions media={row.original} />,
    },
];
