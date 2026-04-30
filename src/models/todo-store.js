import { randomUUID } from 'node:crypto';

const todos = new Map();

/**
 * Create a new todo item
 * @param {string} title - The title of the todo
 * @returns {{ id: string, title: string, completed: boolean }} The created todo
 */
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

/**
 * Get all todo items
 * @returns {Array<{ id: string, title: string, completed: boolean }>} Array of all todos
 */
export function getAll() {
  return Array.from(todos.values()).map((todo) => ({ ...todo }));
}

/**
 * Get a single todo item by ID
 * @param {string} id - The todo ID
 * @returns {{ id: string, title: string, completed: boolean } | undefined} The todo or undefined
 */
export function getById(id) {
  const todo = todos.get(id);
  return todo ? { ...todo } : undefined;
}

/**
 * Update a todo item by ID
 * @param {string} id - The todo ID
 * @param {{ title?: string, completed?: boolean }} updates - Fields to update
 * @returns {{ id: string, title: string, completed: boolean } | undefined} The updated todo or undefined
 */
export function update(id, updates) {
  const existing = todos.get(id);
  if (!existing) {
    return undefined;
  }
  const updated = { ...existing, ...updates };
  todos.set(id, updated);
  return { ...updated };
}

/**
 * Delete a todo item by ID
 * @param {string} id - The todo ID
 * @returns {boolean} True if deleted, false if not found
 */
export function remove(id) {
  return todos.delete(id);
}

/**
 * Clear all todos (useful for testing)
 */
export function clearAll() {
  todos.clear();
}
