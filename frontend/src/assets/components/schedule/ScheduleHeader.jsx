const days = [
    "Agente",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom",
    "Match"
];

export default function ScheduleHeader() {

    return (

        <div
            className="
                grid
                grid-cols-[260px_repeat(7,1fr)_80px]
                gap-4
                border-b
                pb-4
                text-sm
                font-semibold
                text-slate-500
            "
        >

            {days.map(day => (
                <div key={day}>
                    {day}
                </div>
            ))}

        </div>

    );

}