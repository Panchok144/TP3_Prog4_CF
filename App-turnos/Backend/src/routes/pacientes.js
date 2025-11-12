import { Router } from "express";
import { body, param } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM pacientes ORDER BY id DESC");
  res.json(rows);
});

r.post("/",
  body("nombre").isString().trim().notEmpty(),
  body("apellido").isString().trim().notEmpty(),
  body("dni").isString().isLength({ min: 7, max: 12 }),
  body("fecha_nacimiento").isISO8601(),
  body("obra_social").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;
    await db.execute(
      "INSERT INTO pacientes (nombre, apellido, dni, fecha_nacimiento, obra_social) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, dni, fecha_nacimiento, obra_social || null]
    );
    res.status(201).json({ success: true });
  }
);

r.put("/:id",
  param("id").isInt(),
  body("nombre").isString().trim().notEmpty(),
  body("apellido").isString().trim().notEmpty(),
  body("dni").isString().isLength({ min: 7, max: 12 }),
  body("fecha_nacimiento").isISO8601(),
  body("obra_social").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, dni, fecha_nacimiento, obra_social } = req.body;
    const [result] = await db.execute(
      "UPDATE pacientes SET nombre=?, apellido=?, dni=?, fecha_nacimiento=?, obra_social=? WHERE id=?",
      [nombre, apellido, dni, fecha_nacimiento, obra_social || null, id]
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
    const [result] = await db.execute("DELETE FROM pacientes WHERE id=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success: true });
  }
);

export default r;
