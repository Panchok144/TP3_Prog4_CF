import { validationResult } from "express-validator";

export function verificarValidaciones(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ success: false, errores: errores.array() });
  }
  next();
}
