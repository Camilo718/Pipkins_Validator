import { motion } from 'framer-motion';
import { Upload, Plus } from 'lucide-react';
import WeekSelector from './WeekSelector';
import SearchInput from './SearchInput';
import Button from '../iu/Button';

export default function Toolbar({ onAddAgent, onImportExcel }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-[28px] border border-slate-100/50 bg-white p-6 shadow-lg"
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:w-auto">
          <WeekSelector />
        </div>

        <div className="flex flex-1 flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1 max-w-full sm:max-w-xs">
            <SearchInput />
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
            <Button
              variant="secondary"
              icon={<Upload size={18} />}
              onClick={onImportExcel}
              className="flex-1 justify-center sm:flex-initial"
            >
              Importar Excel
            </Button>

            <Button
              icon={<Plus size={18} />}
              onClick={onAddAgent}
              className="flex-1 justify-center sm:flex-initial"
            >
              Agregar Agente
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
