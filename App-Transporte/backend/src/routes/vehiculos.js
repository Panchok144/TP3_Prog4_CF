import { Router } from "express";
import { body, param } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../middlewares/auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT * FROM vehiculos ORDER BY id DESC");
    res.json(rows);
  } catch (e) { next(e); }
});

r.get("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [rows] = await db.execute("SELECT * FROM vehiculos WHERE id=?", [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, mensaje: "Vehículo no encontrado" });
      res.json(rows[0]);
    } catch (e) { next(e); }
  }
);

r.post("/",
  body("marca").isString().trim().notEmpty().withMessage("La marca es requerida"),
  body("modelo").isString().trim().notEmpty().withMessage("El modelo es requerido"),
  body("patente").isString().trim().notEmpty().isLength({ min: 6, max: 10 }).withMessage("La patente debe tener entre 6 y 10 caracteres"),
  body("anio").isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("El año debe ser válido"),
  body("capacidad_carga").isFloat({ min: 0 }).withMessage("La capacidad de carga debe ser mayor o igual a 0"),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { marca, modelo, patente, anio, capacidad_carga } = req.body;
      const [existe] = await db.execute("SELECT id FROM vehiculos WHERE patente=?", [patente]);
      if (existe.length) return res.status(400).json({ success: false, error: "Patente ya registrada" });
      await db.execute(
        "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
        [marca, modelo, patente, anio, capacidad_carga]
      );
      res.status(201).json({ success: true });
    } catch (e) { next(e); }
  }
);

r.put("/:id",
  param("id").isInt(),
  body("marca").isString().trim().notEmpty(),
  body("modelo").isString().trim().notEmpty(),
  body("patente").isString().trim().notEmpty().isLength({ min: 6, max: 10 }),
  body("anio").isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body("capacidad_carga").isFloat({ min: 0 }),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { marca, modelo, patente, anio, capacidad_carga } = req.body;
      const [result] = await db.execute(
        "UPDATE vehiculos SET marca=?, modelo=?, patente=?, anio=?, capacidad_carga=? WHERE id=?",
        [marca, modelo, patente, anio, capacidad_carga, id]
      );
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Vehículo no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

r.delete("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [result] = await db.execute("DELETE FROM vehiculos WHERE id=?", [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Vehículo no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

export default r;
