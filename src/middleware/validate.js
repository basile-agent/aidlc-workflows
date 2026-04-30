/**
 * Input validation middleware for todo endpoints.
 * Validates that the request body contains a valid title:
 *   - Must be present
 *   - Must be a string
 *   - Must be non-empty (not just whitespace)
 *   - Must not exceed 500 characters
 * Returns 400 with a JSON error message on failure.
 */
export function validateTodoInput(req, res, next) {
  const { title } = req.body;

  if (title === undefined || title === null) {
    return res.status(400).json({
      error: 'Title is required',
    });
  }

  if (typeof title !== 'string') {
    return res.status(400).json({
      error: 'Title must be a string',
    });
  }

  if (title.trim().length === 0) {
    return res.status(400).json({
      error: 'Title must not be empty',
    });
  }

  if (title.length > 500) {
    return res.status(400).json({
      error: 'Title must not exceed 500 characters',
    });
  }

  next();
}
