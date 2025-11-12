import { Router } from "express";
import { db } from "../db.js";
import { verificarAutenticacion } from "../auth.js";
import { body, param } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT id_especialidad, nombre, descripcion FROM especialidad ORDER BY nombre");
  res.json(rows);
});

r.post("/",
  body("nombre").isString().trim().notEmpty(),
  body("descripcion").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, descripcion=null } = req.body;
    await db.execute("INSERT INTO especialidad (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion]);
    res.status(201).json({ success: true });
  }
);

r.put("/:id",
  param("id").isInt(),
  body("nombre").isString().trim().notEmpty(),
  body("descripcion").optional({ values: "falsy" }).isString(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion=null } = req.body;
    const [result] = await db.execute(
      "UPDATE especialidad SET nombre=?, descripcion=? WHERE id_especialidad=?",
      [nombre, descripcion, id]
    );
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success:true });
  }
);

r.delete("/:id",
  param("id").isInt(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM especialidad WHERE id_especialidad=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success:true });
  }
);

export default r;
