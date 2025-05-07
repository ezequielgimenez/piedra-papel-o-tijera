import { Router } from "@vaadin/router";
import { state } from "../../state";
import { rtdb } from "../../rtdb";
import map from "lodash/map";

export class Instrucciones extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const currentState = state.getState();

    this.innerHTML = `
        <div class="contenedor-datos">
            <div class="dato">Nombre 1:${currentState.nombreOwner}</div>
            <div class="dato">Sala:${currentState.idSala}</div>
            <div class="dato">Nombre 2:${
              currentState.name !== currentState.nombreOwner
                ? currentState.name
                : ""
            }</div>
        </div>
        <el-texto tipoTexto="body">
            Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </el-texto>
    
        <mi-button class="mi-button" atributoBoton="¡Jugar!"></mi-button>
        <div class="clickeado">Esperando al otro jugador para que presione "Jugar"</div>
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
          .clickeado{
            display:none;
            color:red;
            padding-bottom:20px;
          }
      `;
    const myButtonEvent = this.querySelector(".mi-button");
    const divEsperando = this.querySelector(".clickeado") as HTMLDivElement;

    myButtonEvent?.addEventListener("MiButtonClick", (e) => {
      e.preventDefault();

      divEsperando.style.display = "flex";
      divEsperando.style.justifyContent = "center";

      const currentState = state.getState();
      currentState.online = true;
      currentState.start = true;

      state.setState(currentState);
      state.pushJugada();

      const salaRef = rtdb.ref("salas/" + currentState.rtdbID + "/currentGame");
      salaRef.on("value", (snapshot) => {
        const value = snapshot.val();
        currentState.rtdbData = value;
        state.setState(currentState);
        const datacompleta = map(value);
        if (datacompleta[0].start === true && datacompleta[1].start === true) {
          divEsperando.remove();
          Router.go("/playing");
        }
      });
    });
  }
}

customElements.define("init-instrucciones", Instrucciones);
