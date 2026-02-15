import type { ColumnFiltersState } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Film,
    RotateCcw,
    Star,
    TrendingUp,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function MediaAdvancedFilterContent({
    onApply,
    currentFilters,
}: {
    onApply: (f: ColumnFiltersState) => void;
    currentFilters: ColumnFiltersState;
}) {
    // State for various filters
    const [createdDate, setCreatedDate] = React.useState<DateRange | undefined>(
        () => {
            const f = currentFilters.find((f) => f.id === "createdAt");
            return f ? (f.value as DateRange) : undefined;
        },
    );

    const [minRating, setMinRating] = React.useState<string>(() => {
        const f = currentFilters.find((f) => f.id === "minRating");
        return f ? String(f.value) : "";
    });

    const [minViews, setMinViews] = React.useState<string>(() => {
        const f = currentFilters.find((f) => f.id === "minViews");
        return f ? String(f.value) : "";
    });

    const [releaseYearFrom, setReleaseYearFrom] = React.useState<string>(() => {
        const f = currentFilters.find((f) => f.id === "releaseYearFrom");
        return f ? String(f.value) : "";
    });

    const [releaseYearTo, setReleaseYearTo] = React.useState<string>(() => {
        const f = currentFilters.find((f) => f.id === "releaseYearTo");
        return f ? String(f.value) : "";
    });

    const handleApply = () => {
        const filters: ColumnFiltersState = [
            ...currentFilters.filter(
                (f) =>
                    f.id !== "createdAt" &&
                    f.id !== "minRating" &&
                    f.id !== "minViews" &&
                    f.id !== "releaseYearFrom" &&
                    f.id !== "releaseYearTo",
            ),
        ];

        if (createdDate?.from)
            filters.push({ id: "createdAt", value: createdDate });
        if (minRating) filters.push({ id: "minRating", value: Number(minRating) });
        if (minViews) filters.push({ id: "minViews", value: Number(minViews) });
        if (releaseYearFrom)
            filters.push({ id: "releaseYearFrom", value: Number(releaseYearFrom) });
        if (releaseYearTo)
            filters.push({ id: "releaseYearTo", value: Number(releaseYearTo) });

        onApply(filters);
    };

    const handleReset = () => {
        setCreatedDate(undefined);
        setMinRating("");
        setMinViews("");
        setReleaseYearFrom("");
        setReleaseYearTo("");
        onApply([]);
    };

    return (
        <div className="space-y-8 py-6">
            {/* CREATED DATE FILTER */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <Film className="h-3.5 w-3.5 text-primary" /> Created Date
                </Label>
                <DatePickerWithRange
                    date={createdDate}
                    setDate={setCreatedDate}
                    placeholder="Filter by creation date..."
                />
            </div>

            {/* RELEASE YEAR FILTER */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <CalendarIcon className="h-3.5 w-3.5 text-blue-500" /> Release Year
                    Range
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label className="text-[9px] text-muted-foreground uppercase">
                            From
                        </Label>
                        <Input
                            type="number"
                            placeholder="1990"
                            value={releaseYearFrom}
                            onChange={(e) => setReleaseYearFrom(e.target.value)}
                            className="h-10 rounded-xl bg-muted/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[9px] text-muted-foreground uppercase">
                            To
                        </Label>
                        <Input
                            type="number"
                            placeholder="2024"
                            value={releaseYearTo}
                            onChange={(e) => setReleaseYearTo(e.target.value)}
                            className="h-10 rounded-xl bg-muted/20"
                        />
                    </div>
                </div>
            </div>

            {/* MINIMUM RATING FILTER */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <Star className="h-3.5 w-3.5 text-amber-500" /> Minimum Rating
                </Label>
                <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="h-10 rounded-xl bg-muted/20">
                        <SelectValue placeholder="Select minimum rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">All Ratings</SelectItem>
                        <SelectItem value="5">5.0+</SelectItem>
                        <SelectItem value="6">6.0+</SelectItem>
                        <SelectItem value="7">7.0+</SelectItem>
                        <SelectItem value="8">8.0+</SelectItem>
                        <SelectItem value="9">9.0+</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* MINIMUM VIEWS FILTER */}
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Minimum
                    Views
                </Label>
                <Input
                    type="number"
                    placeholder="1000"
                    value={minViews}
                    onChange={(e) => setMinViews(e.target.value)}
                    className="h-10 rounded-xl bg-muted/20"
                />
            </div>

            <div className="pt-6 border-t border-border/40 flex flex-col gap-2">
                <Button
                    onClick={handleApply}
                    className="w-full h-12 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                >
                    Apply Filters
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="h-10 rounded-xl font-bold uppercase text-[10px] text-muted-foreground"
                >
                    <RotateCcw className="mr-2 h-3 w-3" /> Reset All
                </Button>
            </div>
        </div>
    );
}

// Helper component for date range picker
function DatePickerWithRange({
    date,
    setDate,
    placeholder,
}: {
    date: DateRange | undefined;
    setDate: (d: DateRange | undefined) => void;
    placeholder: string;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-12 w-full justify-start text-left font-bold rounded-xl border-border/40 bg-muted/20",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "LLL dd")} -{" "}
                                {format(date.to, "LLL dd")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 rounded-2xl border-border/40"
                align="start"
            >
                <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                />
            </PopoverContent>
        </Popover>
    );
}
