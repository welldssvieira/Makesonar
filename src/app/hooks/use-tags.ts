import { useState, useEffect } from 'react';
import { Tag } from '../types/task';

const TAGS_KEY = 'mylist_tags';

const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Trabalho', color: '#3b82f6' },
  { id: '2', name: 'Pessoal', color: '#10b981' },
  { id: '3', name: 'Estudos', color: '#f59e0b' },
  { id: '4', name: 'Casa', color: '#8b5cf6' },
];

export function useTags() {
  const [tags, setTags] = useState<Tag[]>(() => {
    try {
      const stored = localStorage.getItem(TAGS_KEY);
      if (!stored) return DEFAULT_TAGS;
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TAGS;
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      return DEFAULT_TAGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Erro ao salvar tags:', error);
    }
  }, [tags]);

  const addTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setTags([...tags, newTag]);
    return newTag;
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, ...updates } : tag
    ));
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const getTagById = (id: string) => {
    return tags.find(tag => tag.id === id);
  };

  const canDeleteTag = (id: string, tasks: any[]) => {
    return !tasks.some(task => task.tagId === id);
  };

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    canDeleteTag,
  };
}