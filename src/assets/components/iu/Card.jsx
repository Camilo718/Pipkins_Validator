export default function Card({

    children,

    className = ""

}) {

    return (

        <div

            className={`
                rounded-[28px]
                border
                border-white/60
                bg-white/80
                backdrop-blur-xl
                shadow-[0_20px_60px_rgba(15,23,42,.08)]
                ${className}
            `}

        >

            {children}

        </div>

    );

}