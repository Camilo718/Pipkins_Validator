import { CalendarDays, Upload, Plus, BarChart3, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/iu/Button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agent Scheduler</h1>
          <p className="text-sm text-slate-500">Weekly agent management</p>
        </div>
        <div className="flex items-center gap-4">
          
          <Link to="/">
            <Button variant="secondary" icon={<Home size={18} />}>
              Home
            </Button>
          </Link>
          
          <Link to="/comparison">
            <Button variant="secondary" icon={<BarChart3 size={18} />}>
              Comparison
            </Button>
          </Link>

          <Button icon={<Plus size={18} />}>Add Agent</Button>
        </div>
      </div>
    </header>
  );
}