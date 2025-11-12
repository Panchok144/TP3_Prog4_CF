import { Router } from "express";
import { body, param, query } from "express-validator";
import { verificarValidaciones } from "../validaciones.js";
import { db } from "../db.js";
import { verificarAutenticacion } from "../auth.js";

const r = Router();
r.use(verificarAutenticacion);

r.get("/",
  query("paciente_id").optional().isInt(),
  query("medico_id").optional().isInt(),
  verificarValidaciones,
  async (req, res) => {
    const { paciente_id, medico_id } = req.query;
    let sql = `SELECT t.*, 
                      p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                      m.nombre AS medico_nombre, m.apellido AS medico_apellido, e.nombre AS especialidad
                 FROM turnos t
                 JOIN pacientes p ON p.id=t.paciente_id
                 JOIN medicos m   ON m.id=t.medico_id
                 JOIN especialidad e ON e.id_especialidad = m.id_especialidad`;
    const params = [];
    const filtros = [];
    if (paciente_id) { filtros.push("t.paciente_id=?"); params.push(paciente_id); }
    if (medico_id)   { filtros.push("t.medico_id=?");   params.push(medico_id); }
    if (filtros.length) sql += " WHERE " + filtros.join(" AND ");
    sql += " ORDER BY t.fecha, t.hora";
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  }
);

r.post("/",
  body("paciente_id").isInt(),
  body("medico_id").isInt(),
  body("fecha").isISO8601(),
  body("hora").matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  body("estado").optional().isIn(["pendiente","atendido","cancelado"]),
  body("observaciones").optional().isString(),
  verificarValidaciones,
  async (req, res) => {
    const { paciente_id, medico_id, fecha, hora, estado="pendiente", observaciones=null } = req.body;
    const [existe] = await db.execute(
      "SELECT id FROM turnos WHERE medico_id=? AND fecha=? AND hora=?",
      [medico_id, fecha, hora]
    );
    if (existe.length) return res.status(400).json({ success:false, error:"Turno ocupado" });

    await db.execute(
      "INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)",
      [paciente_id, medico_id, fecha, hora, estado, observaciones]
    );
    res.status(201).json({ success:true });
  }
);

r.patch("/:id/estado",
  param("id").isInt(),
  body("estado").isIn(["pendiente","atendido","cancelado"]),
  body("observaciones").optional().isString(),
  verificarValidaciones,
  async (req, res) => {
    const { id } = req.params;
    const { estado, observaciones=null } = req.body;
    const [result] = await db.execute(
      "UPDATE turnos SET estado=?, observaciones=? WHERE id=?",
      [estado, observaciones, id]
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
    const [result] = await db.execute("DELETE FROM turnos WHERE id=?", [id]);
    if (!result.affectedRows) return res.status(404).json({ success:false, mensaje:"No encontrado" });
    res.json({ success:true });
  }
);

export default r;
