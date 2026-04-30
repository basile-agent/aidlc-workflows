import express from 'express';
import { create, getAll, getById, update, remove } from '../models/todo-store.js';

const router = express.Router();

router.post('/todos', (req, res) => {
  const { title } = req.body;
  const todo = create(title);
  res.status(201).json(todo);
});

router.get('/todos', (_req, res) => {
  const todos = getAll();
  res.status(200).json(todos);
});

router.get('/todos/:id', (req, res) => {
  const todo = getById(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

router.put('/todos/:id', (req, res) => {
  const { title, completed } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (completed !== undefined) updates.completed = completed;
  const todo = update(req.params.id, updates);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

router.delete('/todos/:id', (req, res) => {
  const deleted = remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
});

export default router;
