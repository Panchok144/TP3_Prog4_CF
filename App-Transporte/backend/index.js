import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { configurarPassport } from "./src/middlewares/auth.js";
import rutasAuth from "./src/middlewares/auth.js";
import rutasUsuarios from "./src/routes/usuarios.js";
import rutasVehiculos from "./src/routes/vehiculos.js";
import rutasConductores from "./src/routes/conductores.js";
import rutasViajes from "./src/routes/viajes.js";
import { manejarErrores } from "./src/middlewares/errores.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

configurarPassport();
app.use(passport.initialize());

app.use("/api/auth", rutasAuth);
app.use("/api/usuarios", rutasUsuarios);
app.use("/api/vehiculos", rutasVehiculos);
app.use("/api/conductores", rutasConductores);
app.use("/api/viajes", rutasViajes);

app.use(manejarErrores);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
