import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Shareroom extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    const currentState = state.getState();
    this.innerHTML = `
            <div class="contenedor-datos">
                <div class="dato">Nombre 1:${currentState.name}</div>
                <div class="dato">Sala:${currentState.idSala}</div>
                <div class="dato">Nombre 2:${currentState.nombre2}</div>
            </div>

            <div class="contenedor-titulo">
               <h1 class="titulo-code">Compartí el codigo:<h1>
            </div>

            <div class="contenedor-codigo">
              <el-texto class="texto" tipoTexto="body">${currentState.idSala}</el-texto>
            </div>

            <div class="contenedor-titulo segundo">
               <h1 class="titulo-code">con un contrincante<h1>
            </div>
            <mi-button class="button" atributoBoton="Ir a la sala"></mi-button>
            <ppt-component></ppt-component>
        
            <style>
              .contenedor-datos{
                display:grid;
                grid-template-columns:repeat(2,1fr);
                gap:10px;
                padding:50px 0;
              }
              .dato{
                text-align:center;
              }
              .contenedor-titulo{
                display:flex;
                justify-content:center;
                align-items:center;
              }
              .titulo-code{
                font-size:40px;
              }

              .segundo{
                padding-bottom:70px;
               } 
              .contenedor-codigo{
                padding-top:30px;
              }
            </style>
          `;
    const eventButton = this.querySelector(".button");
    eventButton?.addEventListener("click", () => {
      state.getRoom(() => {
        state.pushJugada();
        Router.go("/instrucciones");
      });
    });
  }
}
customElements.define("init-share", Shareroom);
