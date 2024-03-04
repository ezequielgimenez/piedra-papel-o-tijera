"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codigo = void 0;
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
class Codigo extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
    <form class="form">
         <el-texto tipoTexto="title">Piedra Papel ó Tijera</el-texto>
         <el-texto tipoTexto="body">Código</el-texto>
            <div class="contenedor-input">
               <input class="my-input" type="text" name="idSala">
            </div>
         <mi-button class="button" atributoBoton="Ingresar a la sala"></mi-button>
    </form>
         <ppt-component></ppt-component>


         <style>
         .contenedor-input{
          display:flex;
          justify-content:center;
          align-items:center;
        }

         .my-input{
          width:319px;
          height:84px;
          border: 8px solid #001997;
          font-size:30px;
          text-align:center;
       }
         </style>
        `;
        const eventButton = this.querySelector(".button");
        const formEvent = this.querySelector(".form");
        eventButton?.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            const valorInput = formEvent.idSala.value;
            const currentState = state_1.state.getState();
            currentState.idSala = valorInput;
            state_1.state.setState(currentState);
            state_1.state.getRoom(() => {
                state_1.state.pushJugada();
                router_1.Router.go("/instrucciones");
            });
            const nuevoState = state_1.state.getState();
            console.log("rtdbRoomId", nuevoState.rtdbID);
        });
    }
}
exports.Codigo = Codigo;
customElements.define("init-codigo", Codigo);
