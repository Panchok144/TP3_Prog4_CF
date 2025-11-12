import express from "express";
import { db } from "../db.js";
import { verificarValidaciones } from "../validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function configurarPassport() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };
  passport.use(
    new Strategy(jwtOptions, async (payload, done) => {
      return done(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", { session: false });

export const verificarAutorizacion = (rol) => {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    if (!roles.includes(rol)) {
      return res.status(403).json({ success: false, message: "Usuario no autorizado" });
    }
    next();
  };
};

router.post(
  "/registro",
  body("username").isAlphanumeric("es-ES").isLength({ min: 3, max: 20 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 }),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const [existe] = await db.execute("SELECT id FROM usuarios WHERE nombre=? OR email=?", [username, email]);
      if (existe.length) return res.status(400).json({ success: false, error: "Usuario o email ya existe" });

      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const hash = await bcrypt.hash(password, saltRounds);

      const [resultado] = await db.execute(
        "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hash]
      );

      res.status(201).json({ success: true, mensaje: "Usuario registrado", id: resultado.insertId });
    } catch (e) { next(e); }
  }
);

router.post(
  "/login",
  body("username").isAlphanumeric("es-ES").isLength({ min: 3, max: 20 }),
  body("password").isString().isLength({ min: 8 }),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const [rows] = await db.execute("SELECT * FROM usuarios WHERE nombre=?", [username]);
      if (!rows.length) return res.status(400).json({ success: false, error: "Usuario invalido" });

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(400).json({ success: false, error: "Contraseña invalida" });

      const payload = { userId: user.id, roles: ["usuario"] };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "4h" });
      res.json({ success: true, token, username });
    } catch (e) { next(e); }
  }
);

export default router;
