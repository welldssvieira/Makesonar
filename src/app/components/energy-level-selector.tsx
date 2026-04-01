import { Slider } from './ui/slider';
import { Zap } from 'lucide-react';

interface EnergyLevelSelectorProps {
  level: number;
  onChange: (level: number) => void;
}

export function EnergyLevelSelector({ level, onChange }: EnergyLevelSelectorProps) {
  const getEnergyLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: 'Muito Baixa',
      2: 'Baixa',
      3: 'Média',
      4: 'Alta',
      5: 'Muito Alta',
    };
    return labels[level] || 'Média';
  };

  const getEnergyColor = (level: number) => {
    const colors: Record<number, string> = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-lime-500',
      5: 'text-green-500',
    };
    return colors[level] || 'text-yellow-500';
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className={`size-5 ${getEnergyColor(level)}`} />
          <div>
            <p className="text-sm text-neutral-600">Seu nível de energia atual</p>
            <p className="text-lg font-medium">{getEnergyLabel(level)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Zap
              key={i}
              className={`size-4 ${
                i <= level ? getEnergyColor(level) : 'text-neutral-200'
              }`}
              fill={i <= level ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>
      
      <Slider
        value={[level]}
        onValueChange={(values) => onChange(values[0])}
        min={1}
        max={5}
        step={1}
        className="w-full"
      />
      
      <p className="text-xs text-neutral-500 mt-3">
        Mostrando tarefas que requerem até <span className="font-medium">{getEnergyLabel(level)}</span> energia
      </p>
    </div>
  );
}
