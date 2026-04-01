import { Task } from '../types/task';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pencil, Trash2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTags } from '../hooks/use-tags';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const { getTagById } = useTags();
  const tag = getTagById(task.tagId);
  
  const handleToggle = () => {
    if (!task.completed) {
      // Dispara confetti quando a tarefa é concluída
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#22c55e', '#86efac']
      });
    }
    onToggle(task.id);
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
    <div className="group bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          className="mt-1"
          id={`task-${task.id}`}
        />
        
        <div className="flex-1 min-w-0">
          <label
            htmlFor={`task-${task.id}`}
            className={`text-base cursor-pointer block ${
              task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
            }`}
          >
            {task.title}
          </label>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1 text-green-600">
              <span className="text-sm font-medium">$HC {task.value.toFixed(2)}</span>
            </div>
            
            {tag && (
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  borderColor: tag.color
                }}
              >
                {tag.name}
              </Badge>
            )}

            <div className={`flex items-center gap-1 ${getEnergyColor(task.energyLevel)}`}>
              <Zap className="size-3" fill="currentColor" />
              <span className="text-xs">{task.energyLevel}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Editar</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="size-4 text-red-500" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </div>
    </div>
  );
}