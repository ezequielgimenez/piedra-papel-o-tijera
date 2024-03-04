"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instrucciones = void 0;
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
const map_1 = require("lodash/map");
class Instrucciones extends HTMLElement {
    connectedCallback() {
        this.render();
        this.playerEntry();
    }
    playerEntry() {
        state_1.state.traerDataArrays(() => {
            const currentState = state_1.state.getState();
            const data = currentState.rtdbData;
            const datacompleta = (0, map_1.default)(data);
            console.log("Data es:", datacompleta[0]);
            if (currentState.nombreOwner !== datacompleta[1].name) {
                currentState.nombre2 = datacompleta[1].name;
                currentState.nombre2 =
                    currentState.nombre2 !== undefined ? currentState.nombre2 : "";
            }
            else {
                currentState.nombre2 = datacompleta[0].name;
            }
            this.render();
        });
    }
    render() {
        const currentState = state_1.state.getState();
        this.innerHTML = `
        <div class="contenedor-datos">
            <div class="dato">Nombre 1:${currentState.nombreOwner}</div>
            <div class="dato">Sala:${currentState.idSala}</div>
            <div class="dato">Nombre 2:${currentState.nombre2 !== currentState.nombreOwner
            ? currentState.nombre2
            : ""}</div>
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
        const divEsperando = this.querySelector(".clickeado");
        myButtonEvent?.addEventListener("MiButtonClick", (e) => {
            e.preventDefault();
            divEsperando.style.display = "flex";
            divEsperando.style.justifyContent = "center";
            const currentState = state_1.state.getState();
            currentState.online = true;
            currentState.start = true;
            state_1.state.setState(currentState);
            state_1.state.pushJugada();
            state_1.state.traerDataArrays(() => {
                const currentState = state_1.state.getState();
                const data = currentState.rtdbData;
                const datacompleta = (0, map_1.default)(data);
                if (datacompleta[0].start === true && datacompleta[1].start === true) {
                    divEsperando.remove();
                    router_1.Router.go("/playing");
                }
            });
        });
    }
}
exports.Instrucciones = Instrucciones;
customElements.define("init-instrucciones", Instrucciones);
