import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/use-tasks';
import { useDataIntegrity } from '../hooks/use-data-integrity';
import { Header } from '../components/header';
import { StatsBar } from '../components/stats-bar';
import { EnergyLevelSelector } from '../components/energy-level-selector';
import { TaskItem } from '../components/task-item';
import { AddTaskDialog } from '../components/add-task-dialog';
import { ManageTagsDialog } from '../components/manage-tags-dialog';
import { Button } from '../components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../types/task';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

const ENERGY_LEVEL_KEY = 'mylist_energy_level';

export function TasksPage() {
  // Inicializa verificação de integridade dos dados
  useDataIntegrity();
  
  const {
    tasks,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    balance,
    pendingBalance,
    completedCount,
    pendingCount,
    totalCount,
  } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [completedOpen, setCompletedOpen] = useState(false);
  
  const [energyLevel, setEnergyLevel] = useState<number>(() => {
    const stored = localStorage.getItem(ENERGY_LEVEL_KEY);
    return stored ? parseInt(stored) : 3;
  });

  const handleEnergyChange = (level: number) => {
    setEnergyLevel(level);
    localStorage.setItem(ENERGY_LEVEL_KEY, level.toString());
  };

  // Separa tarefas pendentes e concluídas
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Filtra tarefas pendentes pelo nível de energia do usuário
  const filteredPendingTasks = useMemo(() => {
    return pendingTasks.filter(task => task.energyLevel <= energyLevel);
  }, [pendingTasks, energyLevel]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTask(null);
    }
    setDialogOpen(open);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        balance={balance} 
        pendingBalance={pendingBalance}
        onManageTags={() => setTagsDialogOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <StatsBar
          completedCount={completedCount}
          pendingCount={pendingCount}
          totalCount={totalCount}
        />

        <EnergyLevelSelector
          level={energyLevel}
          onChange={handleEnergyChange}
        />

        {/* Tarefas Pendentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-neutral-700">
              Tarefas disponíveis {filteredPendingTasks.length > 0 && `(${filteredPendingTasks.length})`}
            </h2>
            <Button onClick={() => setDialogOpen(true)} size="sm">
              <Plus className="size-4" />
              Nova tarefa
            </Button>
          </div>

          {filteredPendingTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p>
                {pendingTasks.length === 0
                  ? 'Nenhuma tarefa pendente'
                  : 'Nenhuma tarefa disponível para seu nível de energia atual'
                }
              </p>
              {pendingTasks.length > filteredPendingTasks.length && (
                <p className="text-sm mt-2">
                  Aumente seu nível de energia para ver mais tarefas
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPendingTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tarefas Concluídas - Seção Colapsável */}
        {completedTasks.length > 0 && (
          <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
            <div className="bg-neutral-100 rounded-lg border border-neutral-200">
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-200/50 transition-colors">
                  <h2 className="text-base text-neutral-600">
                    Concluídas ({completedTasks.length})
                  </h2>
                  {completedOpen ? (
                    <ChevronUp className="size-5 text-neutral-500" />
                  ) : (
                    <ChevronDown className="size-5 text-neutral-500" />
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-2">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleComplete}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </main>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSave={addTask}
        onUpdate={updateTask}
        editingTask={editingTask}
        onOpenManageTags={() => setTagsDialogOpen(true)}
      />

      <ManageTagsDialog
        open={tagsDialogOpen}
        onOpenChange={setTagsDialogOpen}
        tasks={tasks}
      />
    </div>
  );
}