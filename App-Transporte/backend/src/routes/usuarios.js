import { Router } from "express";
import { db } from "../db.js";
import { verificarAutenticacion } from "../middlewares/auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT id, nombre, email, creado_en FROM usuarios ORDER BY id DESC");
    res.json(rows);
  } catch (e) { next(e); }
});

export default r;
