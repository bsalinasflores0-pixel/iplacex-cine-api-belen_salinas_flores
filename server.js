import express from "express";
import cors from "cors";
import { cliente } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const app = express();
const PORT = 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ruta de bienvenida
app.get("/", (req, res) => {
    res.status(200).send("Bienvenido al cine Iplacex");
});

//Rutas personalizadas
app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

//Conexión con MongoDB Atlas y ejecución del servidor
cliente.connect()
    .then(() => {
        console.log("Conexión exitosa a MongoDB Atlas");

        app.listen(PORT, () => {
            console.log(`Servidor Express ejecutándose en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar con MongoDB Atlas:", error);
    });
