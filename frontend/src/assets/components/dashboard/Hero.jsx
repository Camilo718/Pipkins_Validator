import { Sparkles } from "lucide-react";

export default function Hero() {

    return (

        <section
            className="
                rounded-[32px]
                bg-gradient-to-r
                from-indigo-600
                via-indigo-500
                to-blue-500
                p-10
                text-white
                shadow-2xl
            "
        >

            <div className="flex items-center gap-3">

                <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white/20
                    "
                >
                    <Sparkles size={28}/>
                </div>

                <div>

                    <h1 className="text-4xl font-bold">
                        Bienvenido 👋
                    </h1>

                    <p className="mt-2 text-indigo-100 text-lg">

                        Administra fácilmente los horarios semanales,
                        compara con Excel y mantén toda tu operación organizada.

                    </p>

                </div>

            </div>

        </section>

    );

}