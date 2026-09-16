import { ObjectId } from "mongodb";
import { cliente } from "../common/db.js";
import { Actor } from "./actor.js";

const actorCollection = cliente
    .db("cine-db")
    .collection("actores");

const peliculaCollection = cliente
    .db("cine-db")
    .collection("peliculas");

async function handleInsertActorRequest(req, res) {
    await peliculaCollection.findOne({
        nombre: req.body.nombrePelicula
    })
        .then(async (peliculaEncontrada) => {
            if (peliculaEncontrada === null) {
                return res.status(404).json({
                    mensaje: "La película ingresada no existe"
                });
            }

            const actor = {
                ...Actor,
                _id: new ObjectId(),
                idPelicula: peliculaEncontrada._id.toString(),
                nombre: req.body.nombre,
                edad: req.body.edad,
                estaRetirado: req.body.estaRetirado,
                premios: req.body.premios
            };

            return await actorCollection.insertOne(actor)
                .then((data) => {
                    if (!data.acknowledged) {
                        return res.status(400).json({
                            mensaje: "No fue posible agregar el actor"
                        });
                    }

                    return res.status(201).json({
                        mensaje: "Actor agregado correctamente",
                        resultado: data
                    });
                })
                .catch((error) => {
                    return res.status(400).json({
                        mensaje: "Error al agregar el actor",
                        error: error.message
                    });
                });
        })
        .catch((error) => {
            return res.status(400).json({
                mensaje: "Error al buscar la película",
                error: error.message
            });
        });
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find().toArray()
        .then((data) => {
            return res.status(200).json(data);
        })
        .catch((error) => {
            return res.status(400).json({
                mensaje: "Error al obtener los actores",
                error: error.message
            });
        });
}

async function handleGetActorByIdRequest(req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);

        await actorCollection.findOne({ _id: id })
            .then((data) => {
                if (data === null) {
                    return res.status(404).json({
                        mensaje: "Actor no encontrado"
                    });
                }

                return res.status(200).json(data);
            })
            .catch((error) => {
                return res.status(400).json({
                    mensaje: "Error al buscar el actor",
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

async function handleGetActoresByPeliculaIdRequest(req, res) {
    try {
        const peliculaId = ObjectId
            .createFromHexString(req.params.pelicula)
            .toString();

        await actorCollection.find({
            idPelicula: peliculaId
        }).toArray()
            .then((data) => {
                if (data.length === 0) {
                    return res.status(404).json({
                        mensaje: "No se encontraron actores para esta película"
                    });
                }

                return res.status(200).json(data);
            })
            .catch((error) => {
                return res.status(400).json({
                    mensaje: "Error al obtener los actores de la película",
                    error: error.message
                });
            });
    } catch (error) {
        return res.status(400).json({
            mensaje: "El ID de la película no tiene un formato válido",
            error: error.message
        });
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
};