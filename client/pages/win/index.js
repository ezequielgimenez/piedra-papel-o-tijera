"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Win = void 0;
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
const map_1 = require("lodash/map");
class Win extends HTMLElement {
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
        console.log("Soy el state ahora", currentState);
        console.log(currentState.score);
        this.innerHTML = `
    <div class="contenedor-imgWin">
    <img src="https://imgur.com/YNxOFWQ.png" alt="ganaste">
    <div class="contenedor-score" >
        <el-texto tipoTexto="body">Score</el-texto>
        <el-texto tipoTexto="parrafo">${datacompleta[0].name}:${currentState.player1} </el-texto>
        <el-texto tipoTexto="parrafo">${datacompleta[1].name}:${currentState.player2} </el-texto>

    </div>

    <mi-button class="mi-button" atributoBoton="Volver a jugar"></mi-button>
    <p class="texto-p">
      Sitio desarrollado por <a href="https://www.linkedin.com/in/ezequielgimenez/" class="texto-a">Ezequiel Giménez</a>
    </p>
    </div>
        <style>

        .contenedor-imgWin{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background-color:rgba(136, 137, 73, 0.9);
            height: 100vh;
        }
      
        .contenedor-score{
            width:259px;
            height:217px;
            top:307px;
            left:58px;
            border: solid 10px black;
            background-color:white;
            text-aling:center;
        }
      
        .texto-p{
          font-size:15px;
        }
      
        .texto-a {
          text-decoration: none;
          color: #001997; 
        }
      
        .texto-a:hover {
          text-decoration: underline;
          color:red;
        }
        </style>
        `;
        const eventButton = this.querySelector(".mi-button");
        eventButton.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            router_1.Router.go("/instrucciones");
        });
    }
    obtenerResultadosScore() {
        state_1.state.getRoom(() => {
            const currentState = state_1.state.getState();
            this.render();
        });
    }
}
exports.Win = Win;
customElements.define("ppt-win", Win);
