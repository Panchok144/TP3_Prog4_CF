import { Router } from "express";
import { body, param } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res) => {
  const [rows] = await db.execute(`
    SELECT m.id, m.nombre, m.apellido, m.id_especialidad, e.nombre AS especialidad, m.matricula_profesional, m.creado_en
      FROM medicos m
      JOIN especialidad e ON e.id_especialidad = m.id_especialidad
      ORDER BY m.id DESC`);
  res.json(rows);
});

r.post("/",
  body("nombre").isString().notEmpty(),
  body("apellido").isString().notEmpty(),
  body("id_especialidad").isInt(),
  body("matricula_profesional").isString().notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, id_especialidad, matricula_profesional } = req.body;
    await db.execute(
      "INSERT INTO medicos (nombre, apellido, id_especialidad, matricula_profesional) VALUES (?, ?, ?, ?)",
      [nombre, apellido, id_especialidad, matricula_profesional]
    );
    res.status(201).json({ success: true });
  }
);

r.put("/:id",
  param("id").isInt(),
  body("nombre").isString().notEmpty(),
  body("apellido").isString().notEmpty(),
  body("id_especialidad").isInt(),
  body("matricula_profesional").isString().notEmpty(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, id_especialidad, matricula_profesional } = req.body;
    const [result] = await db.execute(
      "UPDATE medicos SET nombre=?, apellido=?, id_especialidad=?, matricula_profesional=? WHERE id=?",
      [nombre, apellido, id_especialidad, matricula_profesional, id]
    );
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success: true });
  }
);

r.delete("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM medicos WHERE id=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success: true });
  }
);

export default r;
