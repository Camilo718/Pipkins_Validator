import Hero from "../components/dashboard/Hero";
import StatsGrid from "../components/dashboard/StatsGrid";
import Toolbar from "../components/dashboard/Toolbar";
import ScheduleTable from "../components/schedule/ScheduleTable";

export default function Dashboard() {

    return (
        <div className="space-y-8">
            <Hero />
            <StatsGrid />
            <Toolbar />
            <ScheduleTable />
        </div>
    );
}