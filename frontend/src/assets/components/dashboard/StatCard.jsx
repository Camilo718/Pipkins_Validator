import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-[28px] bg-white p-6 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-4 text-5xl font-bold">{value}</h2>
          <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-2xl p-4 ${color}`}>{icon}</div>
      </div>
    </motion.div>
  );
}
