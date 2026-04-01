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
    const stored = localStorage.getItem(TAGS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TAGS;
  });

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
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

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
  };
}
