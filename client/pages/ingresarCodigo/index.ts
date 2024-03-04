import { Router } from "@vaadin/router";
import { state } from "../../state";
export class Codigo extends HTMLElement {
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
    const formEvent = this.querySelector(".form") as HTMLFormElement;

    eventButton?.addEventListener("MiButtonClick", (e) => {
      e.preventDefault();
      const valorInput = formEvent.idSala.value;
      const currentState = state.getState();
      currentState.idSala = valorInput;
      state.setState(currentState);

      state.getRoom(() => {
        state.pushJugada();
        Router.go("/instrucciones");
      });
      const nuevoState = state.getState();
      console.log("rtdbRoomId", nuevoState.rtdbID);
    });
  }
}
customElements.define("init-codigo", Codigo);
