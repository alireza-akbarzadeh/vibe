import { Button } from '@/components/ui/button';
import AudienceRetention from '../components/audience-retention';
import { StatCards } from '../components/status-card';
import { RecentActivityTable } from '../components/user-table/recent-activity-table';


export default function DashboardMainPage() {
    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground">Monitor your media performance and user growth.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-dashed">Download Report</Button>
                    <Button className="rounded-xl shadow-lg shadow-primary/20">Analyze Data</Button>
                </div>
            </div>
            <StatCards />
            <div className="grid gap-6 grid-cols-12">
                <AudienceRetention />
                <div className="col-span-12 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold tracking-tight">Recent Sales</h3>
                        <Button variant="link" size="sm" className="text-primary">View all</Button>
                    </div>
                    <RecentActivityTable />
                </div>
            </div>
        </div>
    );
}

