import { Router } from "@vaadin/router";

export class Waiting extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    const name = "undefined";
    this.innerHTML = `
            <div class="contenedor-datos">
                <div class="dato">Nombre 1:</div>
                <div class="dato">Sala:</div>
                <div class="dato">Nombre 2:</div>
            </div>

            <div class="contenedor-titulo">
                <el-texto tipoTexto="body">Esperando que el jugador ${name} presione "¡Jugar!"</el-texto>
            </div>
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
                padding: 50px 0;

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
    /// Si paula pulso jugar => entonces Router("/play")
  }
}
customElements.define("init-waiting", Waiting);
