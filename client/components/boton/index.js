"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonComponent = void 0;
function buttonComponent() {
    customElements.define("mi-button", class extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            const shadow = this.attachShadow({ mode: "open" });
            const textoDelButton = this.getAttribute("atributoBoton");
            const divButton = document.createElement("div");
            divButton.className = "contenedor-button";
            divButton.innerHTML = `
            <button type="submit" class="mi-button">
                <el-texto tipoTexto="body">${textoDelButton}</el-texto>
            </button>
        `;
            divButton.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("MiButtonClick"));
            });
            shadow.appendChild(divButton);
            const styleButton = document.createElement("style");
            styleButton.textContent = `

          .contenedor-button{
             display:flex;
             align-items:center;
             justify-content:center;
          }
            .mi-button{
                background-color:#006CFC;
                border: 10px solid #001997;
                padding:19px 90px;
                margin:20px;
                color:white; 
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .mi-button:active {
                transform: scale(0.95);
              }
        `;
            shadow.appendChild(styleButton);
        }
    });
}
exports.buttonComponent = buttonComponent;
