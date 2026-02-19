import { cn } from "@/lib/utils";

export function MediaCarousel({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex space-x-4 overflow-x-auto pb-4", className)}>
            {children}
        </div>
    );
}
