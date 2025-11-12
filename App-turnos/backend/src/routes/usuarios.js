import { Router } from "express";
import { verificarAutenticacion } from "../middlewares/auth.js";
const r = Router();

r.get("/perfil", verificarAutenticacion, (req, res) => {
  res.json({ success: true, userId: req.user.userId, roles: req.user.roles });
});

export default r;
