import clsx from 'clsx';

export default function Input({ label, name, className, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input
        id={name}
        name={name}
        className={clsx(
          'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
          className
        )}
        {...props}
      />
    </label>
  );
}
