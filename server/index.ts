import * as express from "express";
import * as cors from "cors";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
//Base datos firestore
import { rtdb, firestore } from "./db";
//

const port = process.env.PORT || 4000;

//Inicializacion de Express
const app = express();
app.use(express.json());
//

//Cors
app.use(cors());
//

const userCollection = firestore.collection("/usuarios");
const salaCollection = firestore.collection("/salas");

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
              success: true,
              id: reference.id,
            });
          });
      } else {
        res.json({
          success: false,
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
        res.json({
          success: false,
          message: "No se encontro el user",
        });
      } else {
        res.json({
          success: true,
          id: resp.docs[0].id,
        });
      }
    });
});

// OnlyGenerateSala
app.post("/rooms", (req, res) => {
  //Nos pedira el userId que en teoria estara registrado en la base de datos para ingresar a la salaChat
  const userId = req.body.userId;
  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const idLargo = uuidv4();
        const salaRef = rtdb.ref("salas/" + idLargo + "/currentGame");
        salaRef
          .set({
            owner: userId,
          })
          .then(() => {
            //creo un doc con un id corto en firestore y guardo ahi el id largo
            const idCorto = 1000 + Math.floor(Math.random() * 999);
            const salaDoc = salaCollection.doc(idCorto.toString());

            salaDoc
              .set({
                rtdbID: idLargo,
                nombreOwner: userData.nombre,
                resultados: {
                  player1: 0,
                  player2: 0,
                },
              })
              .then(() => {
                return salaDoc.get();
              })
              .then((doc) => {
                const salaData = doc.data();
                res.json({
                  success: true,
                  id: idCorto,
                  salaData,
                });
              });
          });
      } else {
        res.json({
          success: false,
          message: "User not found",
        });
      }
    });
});

// getToRoom()
app.get("/rooms/:idRoom", (req, res) => {
  const userId = req.query.userId;
  const idRoom = req.params.idRoom;

  if (userId) {
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          salaCollection
            .doc(idRoom)
            .get()
            .then((snap) => {
              if (snap.exists) {
                const salaData = snap.data();
                res.json({
                  success: true,
                  id: salaData.rtdbID,
                  message: "todo ok, sala encontrada",
                });
              } else {
                res.json({
                  success: false,
                  message: "No existe la sala",
                });
              }
            });
        } else {
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
  const { userId, idRealTime, resultado, choice, name, online, start } =
    req.body;
  const salaRef = rtdb.ref("salas/" + idRealTime + "/currentGame");
  if (userId) {
    salaRef.once("value").then((snapshot) => {
      salaRef
        .child(userId)
        .transaction((data) => {
          if (snapshot.numChildren() >= 3) {
            // Si hay más de 2 objetos o son 3 entonces..
            //si "data" tiene datos y es el mismo idUser lo actualiza con el req.body,
            //de lo contrario si data es falsy simplemente devuelve data (no se hace ninguna modificacion en la base de datos)
            return data ? { ...data, ...req.body } : data;
          } else {
            //[siempre y cuando sean menos de 3 objetos]
            //si data es verdadero (osea que ya existe ese UserId con datos), retorna data actualizandolo
            //data es falso (no existe ese userId en la referencia con datos), retorna el nuevo objeto agregandolo
            return data || req.body;
          }
        })
        .then(() => {
          res.json({
            success: true,
            message: "Operación realizada con exito",
          });
        })
        .catch((error) => {
          console.error("Error en /playing:", error);
          res.status(500).json({
            success: false,
            message: "Error en la operación",
          });
        });
    });
  } else {
    res.json({
      success: false,
      message: "No hay userId",
    });
  }
});

// En este endpoint vamos a actualizar la data de firestore con la data que le pasamos por el front,
// para ir pusheando los resultados, ejemplo:{player1: 0+1, player2:0}
app.post("/pushResultados/:idSala", (req, res) => {
  const userId = req.query.userId;
  const idSala = req.params.idSala;
  if (userId) {
    userCollection
      .doc(userId.toString())
      .get()
      .then((doc) => {
        if (doc.exists) {
          salaCollection.doc(idSala.toString()).update(req.body);
          res.json("todo ok");
        } else {
          res.json("No existe el userId");
        }
      });
  }
});

//static server
//
app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});
