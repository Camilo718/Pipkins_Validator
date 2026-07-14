import {
    CalendarDays,
    Upload,
    Plus
} from "lucide-react";

import Button from "../../components/iu/Button";

export default function Header() {

    return (
        <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Agent Scheduler
                    </h1>
                    <p className="text-sm text-slate-500">
                        Gestión semanal de agentes
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        icon={<CalendarDays size={18} />}
                    >
                        Semana Actual
                    </Button>

                    <Button
                        variant="secondary"
                        icon={<Upload size={18} />}
                    >
                        Importar Excel
                    </Button>

                    <Button
                        icon={<Plus size={18} />}
                    >
                        Agregar Agente
                    </Button>
                </div>
            </div>
        </header>
    );
}