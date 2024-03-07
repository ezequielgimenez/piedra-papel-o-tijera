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
         <div class="sala-error">
            <h2> Error no se encontro la sala, verifica el numero y que sea una sala creada</h2>
          </div>
    </form>
         <ppt-component></ppt-component>


         <style>
         .contenedor-input{
          display:flex;
          justify-content:center;
          align-items:center;
        }
        .sala-error{
          display:none;
          color:red;
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
        const salaNotFount = this.querySelector(".sala-error");
        eventButton?.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            const valorInput = formEvent.idSala.value;
            const currentState = state_1.state.getState();
            currentState.idSala = valorInput;
            state_1.state.setState(currentState);
            state_1.state.getRoom(() => {
                const currentState = state_1.state.getState();
                if (currentState.messageError === "" || undefined) {
                    state_1.state.pushJugada(); //Pushea en la base de datos, la data del jugador name,user y lo dirige a la sala de espera (instrucciones)
                    router_1.Router.go("/instrucciones");
                }
                else {
                    salaNotFount.style.display = "flex";
                    salaNotFount.style.justifyContent = "center";
                    salaNotFount.style.alignItems = "center";
                }
            });
        });
    }
}
exports.Codigo = Codigo;
customElements.define("init-codigo", Codigo);
