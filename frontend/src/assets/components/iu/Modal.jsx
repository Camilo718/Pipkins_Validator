import { createPortal } from 'react-dom';

export default function Modal({ 
  open, 
  title, 
  children, 
  onClose,
  size = "md" // Nueva prop para controlar el tamaño dinámicamente
}) {
  if (!open) return null;

  // Mapa de tamaños para manejar anchos máximos consistentes
  const sizeClasses = {
    sm: "max-w-md",     // ~448px (Ideal para alertas o formularios muy cortos)
    md: "max-w-lg",     // ~512px (Excelente para el Paso 1: Datos básicos)
    lg: "max-w-4xl",     // ~896px (Perfecto para el Paso 2: Tabla de horarios)
    xl: "max-w-6xl",     // ~1152px
    full: "max-w-[95vw]" // Casi pantalla completa
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className={`w-full ${selectedSize} flex flex-col rounded-[28px] bg-white p-6 shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Encabezado del Modal */}
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}