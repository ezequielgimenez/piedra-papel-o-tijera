"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opciones = void 0;
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
class Opciones extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
      <el-texto tipoTexto="title">Piedra Papel ó Tijera</el-texto>
      <mi-button class="button-newgame" atributoBoton="Nuevo Juego"></mi-button>
      <mi-button class="button-sala" atributoBoton="Ingresar a una sala"></mi-button>

      <ppt-component></ppt-component>  
    `;
        const buttonEvent = this.querySelector(".button-newgame");
        buttonEvent?.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            state_1.state.generateNewRoom(() => {
                router_1.Router.go("/compartir"); ///init-share
            });
        });
        const buttonSecond = this.querySelector(".button-sala");
        buttonSecond?.addEventListener("click", () => {
            router_1.Router.go("/ingresarCodigo"); ///init-codigo
        });
    }
}
exports.Opciones = Opciones;
customElements.define("init-opciones", Opciones);
