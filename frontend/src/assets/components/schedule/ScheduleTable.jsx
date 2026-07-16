import ScheduleHeader from './ScheduleHeader';
import ScheduleRow from './ScheduleRow';

export default function ScheduleTable({ agents = [], onEdit }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-lg">
      <ScheduleHeader />

      <div className="mt-4 space-y-2">
        {agents.map((agent) => (
          <ScheduleRow
            key={agent.id}
            agent={agent}
            onEdit={() => onEdit?.(agent)}
          />
        ))}
      </div>
    </section>
  );
}
