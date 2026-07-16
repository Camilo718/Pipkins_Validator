import { LoaderCircle } from "lucide-react";

export default function Loader({
  text = "Cargando...",
  size = 26,
  fullScreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LoaderCircle
        size={size}
        className="animate-spin text-indigo-600 shrink-0"
      />
      {text && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-8 w-full flex justify-center">{content}</div>;
}