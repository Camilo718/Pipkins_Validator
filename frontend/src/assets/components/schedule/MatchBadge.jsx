import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MatchBadge({ status }) {
  if (status === 'success') {
    return (
      <div className="flex items-center justify-center">
        <CheckCircle2 className="text-green-500" size={22} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <AlertTriangle className="text-orange-500" size={22} />
    </div>
  );
}
