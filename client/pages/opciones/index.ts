import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Opciones extends HTMLElement {
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
      state.generateNewRoom(() => {
        Router.go("/compartir"); ///init-share
      });
    });

    const buttonSecond = this.querySelector(".button-sala");
    buttonSecond?.addEventListener("click", () => {
      Router.go("/ingresarCodigo"); ///init-codigo
    });
  }
}

customElements.define("init-opciones", Opciones);
