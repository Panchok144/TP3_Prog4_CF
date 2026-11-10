import { Router } from "express";
import { body, param } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../middlewares/auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT * FROM conductores ORDER BY id DESC");
    res.json(rows);
  } catch (e) { next(e); }
});

r.get("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [rows] = await db.execute("SELECT * FROM conductores WHERE id=?", [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, mensaje: "Conductor no encontrado" });
      res.json(rows[0]);
    } catch (e) { next(e); }
  }
);

r.post("/",
  body("nombre").isString().trim().notEmpty().withMessage("El nombre es requerido"),
  body("apellido").isString().trim().notEmpty().withMessage("El apellido es requerido"),
  body("nro_documento").isString().trim().notEmpty().withMessage("El número de documento es requerido"),
  body("nro_licencia").isString().trim().notEmpty().withMessage("El número de licencia es requerido"),
  body("fecha_alta_licencia").isISO8601().withMessage("Fecha de alta de licencia inválida"),
  body("fecha_vencimiento_licencia").isISO8601().withMessage("Fecha de vencimiento de licencia inválida"),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { nombre, apellido, nro_documento, nro_licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;
      const [existe] = await db.execute("SELECT id FROM conductores WHERE nro_documento=?", [nro_documento]);
      if (existe.length) return res.status(400).json({ success: false, error: "Documento ya registrado" });
      await db.execute(
        "INSERT INTO conductores (nombre, apellido, nro_documento, nro_licencia, fecha_alta_licencia, fecha_vencimiento_licencia) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, apellido, nro_documento, nro_licencia, fecha_alta_licencia, fecha_vencimiento_licencia]
      );
      res.status(201).json({ success: true });
    } catch (e) { next(e); }
  }
);

r.put("/:id",
  param("id").isInt(),
  body("nombre").isString().trim().notEmpty(),
  body("apellido").isString().trim().notEmpty(),
  body("nro_documento").isString().trim().notEmpty(),
  body("nro_licencia").isString().trim().notEmpty(),
  body("fecha_alta_licencia").isISO8601(),
  body("fecha_vencimiento_licencia").isISO8601(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, nro_documento, nro_licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;
      const [result] = await db.execute(
        "UPDATE conductores SET nombre=?, apellido=?, nro_documento=?, nro_licencia=?, fecha_alta_licencia=?, fecha_vencimiento_licencia=? WHERE id=?",
        [nombre, apellido, nro_documento, nro_licencia, fecha_alta_licencia, fecha_vencimiento_licencia, id]
      );
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Conductor no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

r.delete("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [result] = await db.execute("DELETE FROM conductores WHERE id=?", [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Conductor no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

export default r;
