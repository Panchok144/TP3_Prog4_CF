export function manejarErrores(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    mensaje: err.mensaje || err.message || "Error interno del servidor"
  });
}
