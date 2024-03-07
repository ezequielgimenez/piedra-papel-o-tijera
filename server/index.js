"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const uuid_1 = require("uuid");
//Base datos firestore
const db_1 = require("./db");
//
const port = process.env.PORT || 4000;
//Inicializacion de Express
const app = express();
app.use(express.json());
//
//Cors
app.use(cors());
//
const userCollection = db_1.firestore.collection("/usuarios");
const salaCollection = db_1.firestore.collection("/salas");
app.listen(port, () => {
    console.log("Escuchando en el port:", port);
});
//En este endpoint registramos personas en el cual nos pasaran un email y un nombre
// y el endpoint devuelve el id generado de la db ese user
//signup
app.post("/signup", (req, res) => {
    const email = req.body.email;
    const nombre = req.body.nombre;
    userCollection
        .where("email", "==", email)
        .get()
        .then((resp) => {
        if (resp.empty) {
            userCollection
                .add({
                email,
                nombre,
            })
                .then((reference) => {
                res.json({
                    //Este enpoint va a retornar el id de referencia que seria el del user para trabajar luego en el state
                    id: reference.id,
                });
            });
        }
        else {
            res.json({
                message: "Ya existe un email registrado",
            });
        }
    });
});
//En este endpoint vamos a verificar que el user existe a traves de su email para que se loguee
// en caso de que si exista retornamos su id referencia
//signin
app.post("/signin", (req, res) => {
    const email = req.body.email;
    userCollection
        .where("email", "==", email)
        .get()
        .then((resp) => {
        if (resp.empty) {
            res.status(404).json({
                message: "No se encontro el user",
            });
        }
        else {
            res.json({
                idDelUser: resp.docs[0].id,
            });
        }
    });
});
// OnlyGenerateSala
//En este enpoint vamos a generar una sala con un codigo corto para ingresar a la misma (Nuevo juego)
// vamos a generar un id largo y uno corto, nos retornara el id corto para que los usuarios ingresen a la sala correspondiente
//con el proximo endpoint que pedira el id corto
app.post("/generarSala", (req, res) => {
    //Nos pedira el userId que en teoria estara registrado en la base de datos para ingresar a la sala
    const userId = req.body.userId;
    const roomName = "currentGame";
    userCollection
        .doc(userId)
        .get()
        .then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const idLargo = (0, uuid_1.v4)();
            const salaRef = db_1.rtdb.ref("salas/" + idLargo + "/" + roomName);
            salaRef
                .set({
                owner: userId,
            })
                .then(() => {
                ////creamos una salaCollection en firestore y le seteamos el id largo y el id corto
                //el id corto lo usaremos para crear un doc con ese id corto, el cual los usuarios se pasaran para ingresar a la sala
                //el id largo que nos genero uuidv4() lo usamos para comunicarnos con la sala salaRef(idlargo)
                const idCorto = 1000 + Math.floor(Math.random() * 999);
                salaCollection
                    .doc(idCorto.toString())
                    .set({
                    rtdbID: idLargo,
                    nombreOwner: userData.nombre,
                    resultados: {
                        player1: 0,
                        player2: 0,
                    },
                })
                    .then(() => {
                    res.json({
                        idSala: idCorto,
                        nombreOwner: userData.nombre,
                    });
                });
            });
        }
    });
});
// getToRoom()
app.get("/salas/:idSala", (req, res) => {
    //como este endpoint es un get no le podemos pasar un body, por lo cual el userId lo pasamos como una query para tener la referencia
    //usuario en el doc, si existe el user vamos a entrar en la colection de las salas con el idSala y retornaremos su data (id largo) junto con
    // los resultados
    const userId = req.query.userId;
    const idSala = req.params.idSala;
    if (userId !== undefined) {
        userCollection
            .doc(userId.toString())
            .get()
            .then((doc) => {
            if (doc.exists) {
                salaCollection
                    .doc(idSala)
                    .get()
                    .then((snap) => {
                    if (snap.exists) {
                        const salaData = snap.data();
                        const userData = doc.data();
                        salaData.nombre = userData.nombre;
                        res.json(salaData);
                    }
                    else {
                        res.status(401).json({
                            message: "No existe la sala",
                        });
                    }
                });
            }
            else {
                res.status(401).json({
                    message: "No existe el doc del user",
                });
            }
        });
    }
});
// En este endpoint vamos a pasarle al state el idLargo actual que se esta manejando,
// Y en la referencia del idlargo+"currentgame" de la collectionSalas vamos a pushear lo que le manda el body en el front(jugador1{..})
//name, start, choice del jugador etc
app.post("/playing", (req, res) => {
    const userId = req.body.userId;
    const idRealTime = req.body.idRealTime;
    const roomName = "currentGame";
    const salaRef = db_1.rtdb.ref("salas/" + idRealTime + "/" + roomName);
    salaRef.once("value").then((snapshot) => {
        salaRef
            .child(userId)
            .transaction((data) => {
            if (snapshot.numChildren() >= 3) {
                // Si hay más de 2 objetos o son 3 entonces..
                //si "data" tiene datos y es el mismo idUser lo actualiza con el req.body,
                //de lo contrario si data es falsy simplemente devuelve data (no se hace ninguna modificacion en la base de datos)
                return data ? { ...data, ...req.body } : data;
            }
            else {
                //[siempre y cuando sean menos de 3 objetos]
                //si data es verdadero (osea que ya existe ese UserId con datos), retorna data actualizandolo
                //data es falso (no existe ese userId en la referencia con datos), retorna el nuevo objeto agregandolo
                return data || req.body;
            }
        })
            .then(() => {
            res.json("ok");
        });
    });
});
// En este endpoint vamos a actualizar la data de firestore con la data que le pasamos por el front,
// para ir pusheando los resultados, ejemplo:{player1: 0+1, player2:0}
app.post("/pushResultados/:idSala", (req, res) => {
    const userId = req.query.userId;
    const idSala = req.params.idSala;
    if (userId !== undefined) {
        userCollection
            .doc(userId.toString())
            .get()
            .then((doc) => {
            if (doc.exists) {
                salaCollection.doc(idSala.toString()).update(req.body);
                res.json("todo ok");
            }
            else {
                res.json("No existe el userId");
            }
        });
    }
});
//static server
//
app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});
