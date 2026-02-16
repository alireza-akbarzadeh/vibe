/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop Watch Time",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile Watch Time",
        color: "var(--muted-foreground)",
    },
} satisfies ChartConfig

export default function AudienceRetention() {
    return (
        <div className="col-span-12 rounded-3xl border bg-card/20 p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold tracking-tight">Audience Retention</h3>
                <p className="text-sm text-muted-foreground">Average watch time per episode (minutes)</p>
            </div>

            {/* Changed h-25 to h-[400px] and ensured aspect-auto */}
            <ChartContainer config={chartConfig} className="h-[400px] w-full aspect-auto">
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12, // Increased margin slightly for better Y-axis visibility
                        right: 12,
                        top: 10,
                        bottom: 0
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickCount={5} // Increased count for better scale in smaller height
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <defs>
                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey="mobile"
                        type="natural"
                        fill="url(#fillMobile)"
                        fillOpacity={0.4}
                        stroke="var(--color-mobile)"
                        stackId="a"
                        strokeWidth={2}
                    />
                    <Area
                        dataKey="desktop"
                        type="natural"
                        fill="url(#fillDesktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                        stackId="a"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}