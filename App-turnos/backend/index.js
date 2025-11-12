import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { configurarPassport } from "./src/middlewares/auth.js";
import rutasAuth from "./src/middlewares/auth.js";
import rutasUsuarios from "./src/routes/usuarios.js";
import rutasPacientes from "./src/routes/pacientes.js";
import rutasMedicos from "./src/routes/medicos.js";
import rutasTurnos from "./src/routes/turnos.js";
import rutasEspecialidades from "./src/routes/especialidades.js";
import { manejarErrores } from "./src/middlewares/errores.js";

dotenv.config();

const app = express();

// Middlewares base
app.use(cors({ origin: "*" }));
app.use(express.json());

// Passport JWT
configurarPassport();
app.use(passport.initialize());

// Rutas
app.use("/api/auth", rutasAuth);
app.use("/api/usuarios", rutasUsuarios);
app.use("/api/pacientes", rutasPacientes);
app.use("/api/medicos", rutasMedicos);
app.use("/api/turnos", rutasTurnos);
app.use("/api/especialidades", rutasEspecialidades);

// Manejo de errores (al final)
app.use(manejarErrores);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
