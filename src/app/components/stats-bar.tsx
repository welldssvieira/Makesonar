import { Progress } from './ui/progress';

interface StatsBarProps {
  completedCount: number;
  pendingCount: number;
  totalCount: number;
}

export function StatsBar({ completedCount, pendingCount, totalCount }: StatsBarProps) {
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl">{completedCount}</p>
            <p className="text-xs text-neutral-500">Concluídas</p>
          </div>
          <div>
            <p className="text-2xl">{pendingCount}</p>
            <p className="text-xs text-neutral-500">Pendentes</p>
          </div>
          <div>
            <p className="text-2xl">{totalCount}</p>
            <p className="text-xs text-neutral-500">Total</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl">{completionPercentage.toFixed(0)}%</p>
          <p className="text-xs text-neutral-500">Completado</p>
        </div>
      </div>
      <Progress value={completionPercentage} className="h-2" />
    </div>
  );
}
