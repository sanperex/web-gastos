export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Error interno del servidor',
  });
}
