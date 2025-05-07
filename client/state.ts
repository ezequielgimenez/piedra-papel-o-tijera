import { rtdb } from "./rtdb";

const API_BASE_URL = "https://piedra-papel-o-tijera-7ks0.onrender.com";

const state = {
  data: {
    rtdbData: {},
    email: "",
    name: "",
    userId: "",
    messageError: "",
    idSala: "",
    rtdbID: "",
    resultado: "",
    score: "",
    player1: 0,
    player2: 0,
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

  setEmailAndFullName(email: string, nombre: string) {
    const currentState = this.getState();
    currentState.email = email;
    currentState.name = nombre;
    this.setState(currentState);
  },

  signUp(callback) {
    const currenState = this.getState();
    if (currenState.email) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currenState.email,
          nombre: currenState.name,
        }),
      })
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          if (callback) {
            if (data.success) {
              currenState.userId = data.id;
              this.setState(currenState);
              callback();
            }
          }
        });
    } else {
      alert("No estas logueado o registrado");
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
            if (data.success) {
              currentState.userId = data.id;
              this.setState(currentState);
            } else {
              currentState.messageError = data.message;
              this.setState(currentState);
            }
            callback();
          }
        });
    } else {
      alert("No estas logueado o registrado");
    }
  },

  generateNewRoom(callback?) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(API_BASE_URL + "/rooms", {
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
          if (data.success) {
            if (callback) {
              currentState.idSala = data.id;
              currentState.nombreOwner = data.nombreOwner;
              this.setState(currentState);
              callback();
            }
          }
        });
    } else {
      alert("No estas logueado o registrado");
    }
  },

  getRoom(callback?) {
    const currenState = this.getState();
    const idRoom = currenState.idSala;
    fetch(API_BASE_URL + "/rooms/" + idRoom + "?userId=" + currenState.userId)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        if (data.success) {
          if (callback) {
            currenState.rtdbID = data.id;

            //Mi state toma el valor que le sumamos al player ganador(valor actualizado)
            //o toma el valor inicial  que le dimos en "index playing" si no tiene aun datos y gano por primera vez osea "1"
            currenState.nombreOwner = data.salaData.nombreOwner;
            currenState.player1 = data.salaData.resultados.player1;
            currenState.player2 = data.salaData.resultados.player2;
            this.setState(currenState);
            callback();
          }
        } else {
          currenState.messageError = data.message;
          this.setState(currenState);
        }
      });
  },

  pushJugada() {
    const currentState = this.getState();
    const nameDelState = currentState.name;
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
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("todo ok");
        }
      });
  },

  updateRoom() {
    const currenState = state.getState();
    const idRoom = currenState.idSala;
    fetch(
      API_BASE_URL +
        "/pushResultados/" +
        idRoom +
        "?userId=" +
        currenState.userId,
      {
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
      }
    );
  },

  traerDataArrays(callback?: () => void) {
    const currenState = this.getState();
    const salaRef = rtdb.ref("salas/" + currenState.rtdbID + "/currentGame");
    salaRef.on("value", (snapshot) => {
      const value = snapshot.val();
      this.setState({ ...currenState, rtdbData: value });
      if (callback) callback();
    });
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
    // te avisa cuando algun componente cambia el estado
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
  },
};

export { state };
