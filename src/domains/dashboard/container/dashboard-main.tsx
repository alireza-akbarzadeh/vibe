import { cn } from '@/lib/utils';
import { ActivityFeed } from '../components/activity-feed';
import AudienceRetention from '../components/audience-retention';
import { DeviceInsights } from '../components/deviceI-nsights';
import { GeoDistribution } from '../components/geo-distribution';
import { HeaderSection } from '../components/header-section';
import { PlanDistribution } from '../components/plan-distribution';
import { RetentionMetrics } from '../components/retention-metrics';
import { StatCards } from '../components/status-card';
import { SystemHealthCard } from '../components/system-health-card';
import { TopMarkets } from '../components/top-markets';
import { RecentActivityTable } from '../components/user-table/recent-activity-table';

export default function DashboardMainPage() {
    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
            <HeaderSection />
            <StatCards />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DeviceInsights />
                <TopMarkets />
                <PlanDistribution />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActivityFeed />
                <RetentionMetrics />
                <GeoDistribution />

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
                <div className="min-w-0 col-span-2">
                    <AudienceRetention />
                </div>
                <div className="min-w-0 col-span-1">
                    <SystemHealthCard />
                </div>

            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        Recent Transactions
                    </h3>
                </div>
                <div className="w-full min-w-0">
                    <RecentActivityTable />
                </div>
            </div>
        </div>
    );
}




