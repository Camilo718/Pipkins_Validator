import { Pencil, Trash2 } from "lucide-react";
import MatchBadge from "./MatchBadge";
import ScheduleCell from "./ScheduleCell";

export default function ScheduleRow({ agent }) {

    return (

        <div
            className="
                group
                grid
                grid-cols-[260px_repeat(7,1fr)_80px]
                gap-4
                items-center
                rounded-2xl
                p-4
                transition
                hover:bg-slate-50
            "
        >

            <div className="flex items-center gap-4">

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-100
                        font-bold
                        text-indigo-700
                    "
                >
                    {agent.avatar}
                </div>

                <div>

                    <h3 className="font-semibold">

                        {agent.name}

                    </h3>

                    <p className="text-sm text-slate-500">

                        {agent.role}

                    </p>

                </div>

            </div>

            <ScheduleCell value={agent.schedule.monday} />
            <ScheduleCell value={agent.schedule.tuesday} />
            <ScheduleCell value={agent.schedule.wednesday} />
            <ScheduleCell value={agent.schedule.thursday} />
            <ScheduleCell value={agent.schedule.friday} />
            <ScheduleCell value={agent.schedule.saturday} />
            <ScheduleCell value={agent.schedule.sunday} />

            <div className="flex items-center justify-between">

                <MatchBadge status={agent.match} />

                <div
                    className="
                        flex
                        gap-2
                        opacity-0
                        transition
                        group-hover:opacity-100
                    "
                >
                    <Pencil
                        size={16}
                        className="cursor-pointer text-slate-500 hover:text-indigo-600"
                    />

                    <Trash2
                        size={16}
                        className="cursor-pointer text-slate-500 hover:text-red-500"
                    />
                </div>

            </div>

        </div>

    );

}