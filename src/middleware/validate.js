/**
 * Validate todo input middleware
 * Validates title is present, non-empty string, max 500 chars
 */
export function validateTodo(req, res, next) {
  const { title } = req.body;

  if (title === undefined || title === null) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }

  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Title must not be empty' });
  }

  if (trimmed.length > 500) {
    return res.status(400).json({ error: 'Title must not exceed 500 characters' });
  }

  req.body.title = trimmed;
  next();
}
