export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  value: number;
  tagId: string;
  energyLevel: number; // 1-5
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Transaction {
  id: string;
  taskId: string;
  taskTitle: string;
  amount: number;
  type: 'earn' | 'pending';
  date: string;
}