import { randomUUID } from 'node:crypto';

const todos = new Map();

export function create(title) {
  const id = randomUUID();
  const todo = {
    id,
    title,
    completed: false,
  };
  todos.set(id, todo);
  return { ...todo };
}

export function getAll() {
  return Array.from(todos.values()).map((todo) => ({ ...todo }));
}

export function getById(id) {
  const todo = todos.get(id);
  return todo ? { ...todo } : undefined;
}

export function update(id, updates) {
  const existing = todos.get(id);
  if (!existing) {
    return undefined;
  }
  const updated = { ...existing, ...updates };
  todos.set(id, updated);
  return { ...updated };
}

export function remove(id) {
  return todos.delete(id);
}

export function clearAll() {
  todos.clear();
}
