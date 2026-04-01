import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface TaskFiltersProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function TaskFilters({ 
  availableTags, 
  selectedTags, 
  onToggleTag,
  onClearFilters 
}: TaskFiltersProps) {
  if (availableTags.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-600">Filtrar por tags</p>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
          >
            <X className="size-3" />
            Limpar
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
