"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inicio = void 0;
const router_1 = require("@vaadin/router");
class Inicio extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
      <el-texto tipoTexto="title">Piedra Papel ó Tijera</el-texto>
      <mi-button class="button-newgame" atributoBoton="Registrarse"></mi-button>
      <mi-button class="button-sala" atributoBoton="Iniciar Sesión"></mi-button>

      <ppt-component></ppt-component>  
    `;
        const buttonEvent = this.querySelector(".button-newgame");
        buttonEvent?.addEventListener("click", () => {
            router_1.Router.go("/registro");
        });
        const buttonSecond = this.querySelector(".button-sala");
        buttonSecond?.addEventListener("click", () => {
            router_1.Router.go("/login");
        });
    }
}
exports.Inicio = Inicio;
customElements.define("init-welcome", Inicio);
