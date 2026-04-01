import { useState, useEffect } from 'react';
import { Task, Transaction } from '../types/task';

const STORAGE_KEY = 'mylist_tasks';
const TRANSACTIONS_KEY = 'mylist_transactions';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTask = (title: string, value: number, tagId: string, energyLevel: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      value,
      tagId,
      energyLevel,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    
    // Adiciona transação pendente
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      taskId: newTask.id,
      taskTitle: title,
      amount: value,
      type: 'pending',
      date: new Date().toISOString(),
    };
    setTransactions([...transactions, transaction]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const isCompleting = !task.completed;
    const completedAt = isCompleting ? new Date().toISOString() : undefined;
    
    updateTask(id, { completed: isCompleting, completedAt });

    if (isCompleting) {
      // Atualiza transação de pending para earn
      setTransactions(transactions.map(t => 
        t.taskId === id && t.type === 'pending'
          ? { ...t, type: 'earn', date: completedAt! }
          : t
      ));
    } else {
      // Reverte para pending
      setTransactions(transactions.map(t => 
        t.taskId === id && t.type === 'earn'
          ? { ...t, type: 'pending', date: task.createdAt }
          : t
      ));
    }
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Remove a tarefa
    setTasks(tasks.filter(task => task.id !== id));
    
    // Se a tarefa estava pendente, remove a transação pendente
    // Se estava concluída, mantém o registro de saldo conquistado no histórico
    if (!task.completed) {
      setTransactions(transactions.filter(t => 
        !(t.taskId === id && t.type === 'pending')
      ));
    }
  };

  const balance = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingBalance = transactions
    .filter(t => t.type === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const totalCount = tasks.length;

  return {
    tasks,
    transactions,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    balance,
    pendingBalance,
    completedCount,
    pendingCount,
    totalCount,
  };
}