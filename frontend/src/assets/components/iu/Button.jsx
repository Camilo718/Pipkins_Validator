import clsx from 'clsx';

export default function Button({
  children,

  icon,

  variant = 'primary',

  className,

  ...props
}) {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200',

        'active:scale-95',

        {
          'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200':
            variant === 'primary',

          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50':
            variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
