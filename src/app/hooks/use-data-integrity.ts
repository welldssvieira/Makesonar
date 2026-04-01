import { useEffect } from 'react';
import { Task } from '../types/task';
import { Tag } from '../types/task';

const STORAGE_VERSION_KEY = 'mylist_storage_version';
const CURRENT_VERSION = '1.0';

export function useDataIntegrity() {
  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    if (!storedVersion || storedVersion !== CURRENT_VERSION) {
      // Primeira vez ou versão diferente - valida os dados
      cleanOrphanedData();
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    }
  }, []);

  const cleanOrphanedData = () => {
    try {
      // Carrega dados do localStorage
      const tasksData = localStorage.getItem('mylist_tasks');
      const tagsData = localStorage.getItem('mylist_tags');
      const transactionsData = localStorage.getItem('mylist_transactions');

      if (!tasksData || !tagsData) return;

      const tasks: Task[] = JSON.parse(tasksData);
      const tags: Tag[] = JSON.parse(tagsData);
      const transactions = transactionsData ? JSON.parse(transactionsData) : [];

      // Remove tarefas com tags inexistentes
      const validTagIds = new Set(tags.map(tag => tag.id));
      const cleanedTasks = tasks.filter(task => {
        if (!validTagIds.has(task.tagId)) {
          console.warn(`Tarefa "${task.title}" removida por ter tag inválida`);
          return false;
        }
        return true;
      });

      // Remove transações órfãs (sem tarefa correspondente)
      const validTaskIds = new Set(cleanedTasks.map(task => task.id));
      const cleanedTransactions = transactions.filter((t: any) => {
        if (!validTaskIds.has(t.taskId)) {
          console.warn(`Transação órfã removida`);
          return false;
        }
        return true;
      });

      // Salva dados limpos
      if (cleanedTasks.length !== tasks.length) {
        localStorage.setItem('mylist_tasks', JSON.stringify(cleanedTasks));
      }

      if (cleanedTransactions.length !== transactions.length) {
        localStorage.setItem('mylist_transactions', JSON.stringify(cleanedTransactions));
      }

      console.log('Integridade dos dados verificada e corrigida');
    } catch (error) {
      console.error('Erro ao limpar dados órfãos:', error);
    }
  };

  const exportData = () => {
    const data = {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      tasks: localStorage.getItem('mylist_tasks'),
      tags: localStorage.getItem('mylist_tags'),
      transactions: localStorage.getItem('mylist_transactions'),
      energyLevel: localStorage.getItem('mylist_energy_level'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mylist-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.tasks) localStorage.setItem('mylist_tasks', data.tasks);
          if (data.tags) localStorage.setItem('mylist_tags', data.tags);
          if (data.transactions) localStorage.setItem('mylist_transactions', data.transactions);
          if (data.energyLevel) localStorage.setItem('mylist_energy_level', data.energyLevel);
          
          cleanOrphanedData();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const clearAllData = () => {
    localStorage.removeItem('mylist_tasks');
    localStorage.removeItem('mylist_tags');
    localStorage.removeItem('mylist_transactions');
    localStorage.removeItem('mylist_energy_level');
    localStorage.removeItem(STORAGE_VERSION_KEY);
    window.location.reload();
  };

  return {
    exportData,
    importData,
    clearAllData,
  };
}
