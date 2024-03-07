"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const rtdb_1 = require("./rtdb");
const API_BASE_URL = "https://piedra-papel-o-tijera-7ks0.onrender.com";
const state = {
    data: {
        rtdbData: {},
        email: "",
        userId: "",
        messageError: "",
        idSala: "",
        rtdbID: "",
        resultado: "",
        score: "",
        player1: 0,
        player2: 0,
        name: "",
        nombreOwner: "",
        nombre2: "",
        choice: "",
        online: "",
        start: "",
    },
    listeners: [], //array de funciones
    getState() {
        return this.data;
        ///Te devuelve la ultima version del estado
    },
    setEmailAndFullName(email, nombre) {
        const currentState = this.getState();
        currentState.email = email;
        currentState.name = nombre;
        this.setState(currentState);
    },
    signUp() {
        const currenState = this.getState();
        if (currenState.email) {
            fetch(API_BASE_URL + "/signup", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: currenState.email,
                    nombre: currenState.nombre,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                currenState.userId = data.id;
                this.setState(currenState);
            });
        }
        else {
            console.log("No hay un email en el state");
        }
    },
    signIn(callback) {
        const currentState = this.getState();
        if (currentState.email) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: currentState.email,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                if (callback) {
                    if (data.message === undefined || "") {
                        currentState.userId = data.idDelUser;
                        console.log("Data del signIn", data);
                        this.setState(currentState);
                    }
                    else {
                        console.log("Data message", data.message);
                        currentState.messageError = data.message;
                        this.setState(currentState);
                    }
                    callback();
                }
            });
        }
        else {
            console.log("No hay un email en el state");
        }
    },
    generateNewRoom(callback) {
        const currentState = this.getState();
        if (currentState.userId) {
            fetch(API_BASE_URL + "/generarSala", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentState.userId,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                if (callback) {
                    currentState.idSala = data.idSala;
                    currentState.nombreOwner = data.nombreOwner;
                    // currentState.score = data.resultados;
                    this.setState(currentState);
                    callback();
                }
            });
        }
        else {
            console.log("No hay userId");
        }
    },
    getRoom(callback) {
        const currenState = this.getState();
        const idRoom = currenState.idSala;
        fetch(API_BASE_URL + "/salas/" + idRoom + "?userId=" + currenState.userId)
            .then((resp) => {
            return resp.json();
        })
            .then((data) => {
            if (callback) {
                if (data.message === undefined || "") {
                    currenState.rtdbID = data.rtdbID; /// Res rtbdID
                    currenState.nombreOwner = data.nombreOwner; /// Res nombreOwner
                    currenState.nombre2 = data.nombre;
                    //Mi state toma el valor que le sumamos al player ganador(valor actualizado)
                    //o toma el valor inicial  que le dimos en "index playing" si no tiene aun datos y gano por primera vez osea "1"
                    currenState.player1 = data.resultados.player1;
                    currenState.player2 = data.resultados.player2;
                    console.log("Data sala", data);
                    this.setState(currenState);
                }
                else {
                    currenState.messageError = data.message;
                    console.log("Data error Sala message", data.message);
                    this.setState(currenState);
                }
                callback();
            }
        });
    },
    updateRoom() {
        const currenState = state.getState();
        const idRoom = currenState.idSala;
        fetch(API_BASE_URL +
            "/pushResultados/" +
            idRoom +
            "?userId=" +
            currenState.userId, {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            ///Si hay datos en mi array de resultados en firestore en el player le sumo +1, si esta vacio toma el valor de 1
            body: JSON.stringify({
                resultados: {
                    player1: currenState.player1,
                    player2: currenState.player2,
                },
            }),
        });
    },
    pushJugada() {
        const currentState = this.getState();
        const nameDelState = this.data.name;
        fetch(API_BASE_URL + "/playing", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                userId: currentState.userId,
                idRealTime: currentState.rtdbID,
                resultado: currentState.resultado,
                choice: currentState.choice,
                name: nameDelState,
                online: currentState.online,
                start: currentState.start,
            }),
        });
    },
    traerDataArrays(callback) {
        const currenState = this.getState();
        // Connection with RTDB
        const salaRef = rtdb_1.rtdb.ref("salas/" + currenState.rtdbID + "/currentGame");
        salaRef.on("value", (snapshot) => {
            if (callback) {
                const value = snapshot.val();
                currenState.rtdbData = value;
                this.setState(currenState);
                callback();
            }
        });
    },
    suscribe(callback) {
        this.listeners.push(callback);
        // te avisa cuando algun componente cambia el estado
    },
    setState(newState) {
        this.data = newState;
        for (const callback of this.listeners) {
            callback();
        }
        console.log("Soy el state y he cambiado", this.data);
    },
};
exports.state = state;
