import WeekSelector from './WeekSelector';
import SearchInput from './SearchInput';
import Button from '../iu/Button';
import { Upload, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Toolbar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[28px] bg-white p-6 shadow-lg"
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <WeekSelector />

        <div className="flex flex-1 items-center justify-end gap-4">
          <SearchInput />

          <Button variant="secondary" icon={<Upload size={18} />}>
            Excel
          </Button>

          <Button icon={<Plus size={18} />}>Agregar</Button>
        </div>
      </div>
    </motion.section>
  );
}
