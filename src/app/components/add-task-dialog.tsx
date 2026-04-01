import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Task } from '../types/task';
import { useTags } from '../hooks/use-tags';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, value: number, tagId: string, energyLevel: number) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  editingTask?: Task | null;
  onOpenManageTags: () => void;
}

export function AddTaskDialog({ 
  open, 
  onOpenChange, 
  onSave,
  onUpdate,
  editingTask,
  onOpenManageTags
}: AddTaskDialogProps) {
  const { tags } = useTags();
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [tagId, setTagId] = useState('');
  const [energyLevel, setEnergyLevel] = useState('3');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setValue(editingTask.value.toString());
      setTagId(editingTask.tagId);
      setEnergyLevel(editingTask.energyLevel.toString());
    } else {
      setTitle('');
      setValue('');
      setTagId(tags[0]?.id || '');
      setEnergyLevel('3');
    }
  }, [editingTask, open, tags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tags.length === 0) {
      alert('Você precisa criar pelo menos uma tag antes de adicionar tarefas.');
      return;
    }
    
    const numValue = parseFloat(value) || 0;
    const numEnergy = parseInt(energyLevel) || 3;
    
    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title,
        value: numValue,
        tagId,
        energyLevel: numEnergy,
      });
    } else {
      onSave(title, numValue, tagId, numEnergy);
    }
    
    onOpenChange(false);
  };

  const handleManageTags = () => {
    onOpenChange(false);
    onOpenManageTags();
  };

  const getEnergyLabel = (level: string) => {
    const labels: Record<string, string> = {
      '1': '⚡ Muito Baixa',
      '2': '⚡⚡ Baixa',
      '3': '⚡⚡⚡ Média',
      '4': '⚡⚡⚡⚡ Alta',
      '5': '⚡⚡⚡⚡⚡ Muito Alta',
    };
    return labels[level] || level;
  };

  if (tags.length === 0 && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nenhuma tag encontrada</DialogTitle>
            <DialogDescription>
              Você precisa criar pelo menos uma tag antes de adicionar tarefas.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Tags ajudam a organizar suas tarefas em categorias como Trabalho, Pessoal, Estudos, etc.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleManageTags}>
              Gerenciar Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Editar tarefa' : 'Nova tarefa'}
          </DialogTitle>
          <DialogDescription>
            {editingTask 
              ? 'Atualize os detalhes da sua tarefa.'
              : 'Adicione uma nova tarefa à sua lista.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor ($HC)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tag">Tag</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleManageTags}
                  className="text-xs h-auto py-1"
                >
                  Gerenciar tags
                </Button>
              </div>
              <Select value={tagId} onValueChange={setTagId} required>
                <SelectTrigger id="tag">
                  <SelectValue placeholder="Selecione uma tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="size-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy">Estimativa de Energia</Label>
              <Select value={energyLevel} onValueChange={setEnergyLevel} required>
                <SelectTrigger id="energy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['1', '2', '3', '4', '5'].map(level => (
                    <SelectItem key={level} value={level}>
                      {getEnergyLabel(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTask ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}