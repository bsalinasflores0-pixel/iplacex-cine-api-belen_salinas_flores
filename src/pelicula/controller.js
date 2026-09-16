import { ObjectId } from "mongodb";
import { cliente } from "../common/db.js";
import { Pelicula } from "./pelicula.js";

const peliculaCollection = cliente
    .db("cine-db")
    .collection("peliculas");

async function handleInsertPeliculaRequest(req, res) {
    const pelicula = {
        ...Pelicula,
        _id: new ObjectId(),
        nombre: req.body.nombre,
        generos: req.body.generos,
        anioEstreno: req.body.anioEstreno
    };

    await peliculaCollection.insertOne(pelicula)
        .then((data) => {
            if (!data.acknowledged) {
                return res.status(400).json({
                    mensaje: "No fue posible agregar la película"
                });
            }

            return res.status(201).json({
                mensaje: "Película agregada correctamente",
                resultado: data
            });
        })
        .catch((error) => {
            return res.status(400).json({
                mensaje: "Error al agregar la película",
                error: error.message
            });
        });
}

async function handleGetPeliculasRequest(req, res) {
    await peliculaCollection.find().toArray()
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(400).json({
                mensaje: "Error al obtener las peliculas",
                error: error.message
            });
        });
}

async function handleGetPeliculaByIdRequest(req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);

        await peliculaCollection.findOne({ _id: id })
            .then((data) => {
                if (data === null) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json(data);
            })
            .catch((error) => {
                return res.status(400).json({
                    mensaje: "Error al buscar la película",
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(400).json({
            mensaje: "El ID ingresado no tiene un formato válido",
            error: error.message
        });
    }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);

        const peliculaActualizada = {
            nombre: req.body.nombre,
            generos: req.body.generos,
            anioEstreno: req.body.anioEstreno
        };

        await peliculaCollection.updateOne(
            { _id: id },
            { $set: peliculaActualizada }
        )
            .then((data) => {
                if (data.matchedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json({
                    mensaje: "Película actualizada correctamente",
                    resultado: data
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    mensaje: "Error al actualizar la película",
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(400).json({
            mensaje: "El ID ingresado no tiene un formato válido",
            error: error.message
        });
    }
}

async function handleDeletePeliculaByIdRequest(req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);

        await peliculaCollection.deleteOne({ _id: id })
            .then((data) => {
                if (data.deletedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                return res.status(200).json({
                    mensaje: "Película eliminada correctamente",
                    resultado: data
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    mensaje: "Error al eliminar la película",
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(400).json({
            mensaje: "El ID ingresado no tiene un formato válido",
            error: error.message
        });
    }
}

export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
};