import { Router } from "@vaadin/router";
import { state } from "../../state";
import map from "lodash/map";

export class Loser extends HTMLElement {
  connectedCallback() {
    this.render();
    this.obtenerResultadosScore();
  }
  render() {
    const currentState = state.getState();
    currentState.online = false;
    currentState.start = false;
    currentState.choice = "";
    state.setState(currentState);
    state.pushJugada();
    const data = currentState.rtdbData;
    const datacompleta = map(data);
    this.innerHTML = `
    <div class = "contenedor-imgLose">
        <img src="https://imgur.com/1X3TDdF.png" alt="perdiste">
        <div class="contenedor-score">
           <el-texto tipoTexto="body">Score</el-texto>
           <el-texto tipoTexto="parrafo">${datacompleta[0].name}:${currentState.player1} </el-texto>
           <el-texto tipoTexto="parrafo">${datacompleta[1].name}:${currentState.player2} </el-texto>
        </div>
   
        <mi-button class="mi-button" atributoBoton="Volver a jugar"></mi-button>
        <p class="texto-p"> Sitio desarrollado por
         <a href="https://www.linkedin.com/in/ezequielgimenez/" class="texto-a">Ezequiel Gimenez</a>
        </p>
    </div>
        <style>

        .contenedor-imgLose{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background-color:rgba(137, 73, 73, 0.9);
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
      Router.go("/instrucciones");
    });
  }
  obtenerResultadosScore() {
    state.getRoom(() => {
      const currentState = state.getState();

      this.render();
    });
  }
}
customElements.define("el-loser", Loser);
