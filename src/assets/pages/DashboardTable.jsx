import Hero from "../components/dashboard/Hero";
import StatsGrid from "../components/dashboard/StatsGrid";

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <Hero />
            <StatsGrid />
        </div>
    );
}