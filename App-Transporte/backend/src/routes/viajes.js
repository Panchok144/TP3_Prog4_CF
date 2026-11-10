import { Router } from "express";
import { body, param, query } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../middlewares/auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/",
  query("vehiculo_id").optional().isInt(),
  query("conductor_id").optional().isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { vehiculo_id, conductor_id } = req.query;
      let sql = `SELECT v.*, 
                        ve.marca, ve.modelo, ve.patente,
                        c.nombre AS conductor_nombre, c.apellido AS conductor_apellido
                 FROM viajes v
                 JOIN vehiculos ve ON ve.id = v.vehiculo_id
                 JOIN conductores c ON c.id = v.conductor_id`;
      const params = [];
      const filtros = [];
      if (vehiculo_id) { filtros.push("v.vehiculo_id=?"); params.push(vehiculo_id); }
      if (conductor_id) { filtros.push("v.conductor_id=?"); params.push(conductor_id); }
      if (filtros.length) sql += " WHERE " + filtros.join(" AND ");
      sql += " ORDER BY v.fecha_salida DESC";
      const [rows] = await db.execute(sql, params);
      res.json(rows);
    } catch (e) { next(e); }
  }
);

r.get("/stats/vehiculo/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [rows] = await db.execute(
        "SELECT COALESCE(SUM(kilometros), 0) AS total_km, COUNT(*) AS total_viajes FROM viajes WHERE vehiculo_id=?",
        [req.params.id]
      );
      res.json(rows[0]);
    } catch (e) { next(e); }
  }
);

r.get("/stats/conductor/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [rows] = await db.execute(
        "SELECT COALESCE(SUM(kilometros), 0) AS total_km, COUNT(*) AS total_viajes FROM viajes WHERE conductor_id=?",
        [req.params.id]
      );
      res.json(rows[0]);
    } catch (e) { next(e); }
  }
);

r.get("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [rows] = await db.execute(`
        SELECT v.*, 
               ve.marca, ve.modelo, ve.patente,
               c.nombre AS conductor_nombre, c.apellido AS conductor_apellido
        FROM viajes v
        JOIN vehiculos ve ON ve.id = v.vehiculo_id
        JOIN conductores c ON c.id = v.conductor_id
        WHERE v.id=?
      `, [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, mensaje: "Viaje no encontrado" });
      res.json(rows[0]);
    } catch (e) { next(e); }
  }
);

r.post("/",
  body("vehiculo_id").isInt().withMessage("Debe seleccionar un vehículo válido"),
  body("conductor_id").isInt().withMessage("Debe seleccionar un conductor válido"),
  body("fecha_salida").isISO8601().withMessage("Fecha de salida inválida"),
  body("fecha_llegada").optional({ values: "falsy" }).isISO8601().withMessage("Fecha de llegada inválida"),
  body("origen").isString().trim().notEmpty().withMessage("El origen es obligatorio"),
  body("destino").isString().trim().notEmpty().withMessage("El destino es obligatorio"),
  body("kilometros").isFloat({ min: 0 }).withMessage("Los kilómetros deben ser un número mayor o igual a 0"),
  body("observaciones").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;
      await db.execute(
        "INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [vehiculo_id, conductor_id, fecha_salida, fecha_llegada || null, origen, destino, kilometros, observaciones || null]
      );
      res.status(201).json({ success: true });
    } catch (e) { next(e); }
  }
);

r.put("/:id",
  param("id").isInt(),
  body("vehiculo_id").optional().isInt(),
  body("conductor_id").optional().isInt(),
  body("fecha_salida").optional().isISO8601(),
  body("fecha_llegada").optional({ values: "falsy" }).isISO8601(),
  body("origen").optional().isString().trim().notEmpty(),
  body("destino").optional().isString().trim().notEmpty(),
  body("kilometros").optional().isFloat({ min: 0 }),
  body("observaciones").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;
      const [result] = await db.execute(
        `UPDATE viajes SET
           vehiculo_id = COALESCE(?, vehiculo_id),
           conductor_id = COALESCE(?, conductor_id),
           fecha_salida = COALESCE(?, fecha_salida),
           fecha_llegada = COALESCE(?, fecha_llegada),
           origen = COALESCE(?, origen),
           destino = COALESCE(?, destino),
           kilometros = COALESCE(?, kilometros),
           observaciones = COALESCE(?, observaciones)
         WHERE id=?`,
        [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones, id]
      );
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Viaje no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

r.delete("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const [result] = await db.execute("DELETE FROM viajes WHERE id=?", [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, mensaje: "Viaje no encontrado" });
      res.json({ success: true });
    } catch (e) { next(e); }
  }
);

export default r;
