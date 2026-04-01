import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useTags } from '../hooks/use-tags';
import { Alert, AlertDescription } from './ui/alert';

interface ManageTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: any[];
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#78716c', '#0f172a'
];

export function ManageTagsDialog({ open, onOpenChange, tasks }: ManageTagsDialogProps) {
  const { tags, addTag, updateTag, deleteTag, canDeleteTag } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor(PRESET_COLORS[0]);
    }
  };

  const handleUpdateColor = (id: string, color: string) => {
    updateTag(id, { color });
  };

  const handleDelete = (id: string) => {
    if (!canDeleteTag(id, tasks)) {
      alert('Não é possível excluir esta tag pois existem tarefas usando ela. Delete ou edite as tarefas primeiro.');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      deleteTag(id);
    }
  };

  const getTaskCount = (tagId: string) => {
    return tasks.filter(task => task.tagId === tagId).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
          <DialogDescription>
            Crie, edite cores e organize suas tags
          </DialogDescription>
        </DialogHeader>

        {/* Lista de Tags Existentes */}
        <div className="space-y-3 py-4">
          <h3 className="text-sm font-medium">Tags existentes</h3>
          
          {tags.length === 0 ? (
            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                Nenhuma tag criada ainda. Adicione sua primeira tag abaixo.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {tags.map(tag => {
                const taskCount = getTaskCount(tag.id);
                const isInUse = taskCount > 0;
                
                return (
                  <div key={tag.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div 
                      className="size-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div className="flex-1">
                      <span>{tag.name}</span>
                      {isInUse && (
                        <p className="text-xs text-neutral-500">
                          {taskCount} tarefa{taskCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    
                    {editingId === tag.id ? (
                      <div className="flex gap-1 flex-wrap max-w-md">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            className="size-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              handleUpdateColor(tag.id, color);
                              setEditingId(null);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingId(tag.id)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tag.id)}
                          disabled={isInUse}
                          title={isInUse ? 'Tag em uso - não pode ser deletada' : 'Deletar tag'}
                        >
                          <Trash2 className={`size-4 ${isInUse ? 'text-neutral-300' : 'text-red-500'}`} />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Adicionar Nova Tag */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-medium">Adicionar nova tag</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="tagName">Nome da tag</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Digite o nome da tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
            
            <div>
              <Label>Escolha uma cor</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    className={`size-8 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ${
                      newTagColor === color ? 'border-neutral-900 ring-2 ring-neutral-300' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleAddTag} className="w-full" disabled={!newTagName.trim()}>
              <Plus className="size-4" />
              Adicionar tag
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}