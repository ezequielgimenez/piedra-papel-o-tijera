import { Router } from "@vaadin/router";

export class Inicio extends HTMLElement {
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
      Router.go("/registro");
    });
    const buttonSecond = this.querySelector(".button-sala");
    buttonSecond?.addEventListener("click", () => {
      Router.go("/login");
    });
  }
}

customElements.define("init-welcome", Inicio);
