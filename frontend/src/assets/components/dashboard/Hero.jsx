import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem('hero-welcome');

    if (!alreadySeen) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        localStorage.setItem('hero-welcome', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0, y: -40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.98 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 p-10 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Sparkles size={28} />
              </div>

              <h1 className="text-5xl font-bold">Bienvenido 👋</h1>

              <p className="mt-4 max-w-xl text-lg text-indigo-100">
                Gestiona fácilmente los horarios de todos tus agentes, compara
                archivos Excel y detecta diferencias en segundos.
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
