export default function StatCard({
    title,
    value,
    icon,
    color
}){

    return(
        <div
            className="
                rounded-[28px]
                bg-white
                p-6
                shadow-lg
                border
                border-slate-100
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>
                    <h2 className="mt-4 text-4xl font-bold">
                        {value}
                    </h2>
                </div>

                <div
                    className={`rounded-2xl p-4 ${color}`}
                >

                    {icon}
                </div>
            </div>
        </div>
    )
}