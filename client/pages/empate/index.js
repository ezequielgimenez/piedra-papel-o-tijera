"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empate = void 0;
const state_1 = require("../../state");
const router_1 = require("@vaadin/router");
const map_1 = require("lodash/map");
class Empate extends HTMLElement {
    count = 10;
    connectedCallback() {
        this.render();
        this.obtenerResultadosScore();
    }
    render() {
        const currentState = state_1.state.getState();
        currentState.online = false;
        currentState.start = false;
        currentState.choice = "";
        state_1.state.setState(currentState);
        state_1.state.pushJugada();
        const data = currentState.rtdbData;
        const datacompleta = (0, map_1.default)(data);
        this.innerHTML = `
                 <div class="counter">${this.count} </div>
    
                   <div class="contenedor-img">
                        <div class="maquina">EMPATE </div>
                        <div class="player1">${datacompleta[0].name}:${currentState.player1} </div>
                        <div class="player2">${datacompleta[1].name}:${currentState.player2} </div>
                        <mi-button class="mi-button" atributoBoton="¡Volver a jugar!"></mi-button>
                   </div>

            <style>
                .contenedor-img{
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                }
                .maquina{
                     font-size: 70px;

                }
                .counter{
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size: 5rem; /* Ajusta el tamaño de fuente según lo necesario */
                  width: 200px;
                  height: 100px;
                  margin:50px auto;
                  padding:50px 0;
                  border: 10px solid black;
                  border-radius:200px;
  
                }

              }
             </style>
            `;
        ///Evento del countdown
        const myButtonEvent = this.querySelector(".mi-button");
        myButtonEvent.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            router_1.Router.go("/instrucciones");
        });
        const contadorElement = this.querySelector(".counter");
        const interval = setInterval(() => {
            if (contadorElement) {
                contadorElement.textContent = this.count.toString();
                this.count--;
                if (this.count < 0) {
                    clearInterval(interval);
                    router_1.Router.go("/instrucciones");
                    contadorElement.remove();
                }
            }
        }, 1000);
    }
    obtenerResultadosScore() {
        state_1.state.getRoom(() => {
            const currentState = state_1.state.getState();
            console.log("el score", currentState.score);
            console.log("el player 1", currentState.score.player1);
            console.log("el player 2", currentState.score.player2);
            this.render();
        });
    }
}
exports.Empate = Empate;
customElements.define("ppt-empate", Empate);
