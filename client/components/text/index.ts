export function initTextComponent() {
  customElements.define(
    "el-texto",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const link = document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Odibee+Sans&display=swap"
        );
        link.setAttribute("rel", "stylesheet");
        shadow.appendChild(link);
        //const atributo toma el valor de lo que contenga el atributo llamada tipoTexto = ""..."" o de bodyTexto="..."
        // que pueden ser title, subtitle, y body
        //por ej tipoTexto="title"
        const atributo = this.getAttribute("tipoTexto") || "";

        const divParaTexto = document.createElement("div");
        //divParaTexto le asignamos la clase de lo que contenga el atributo tipoTexto="..." o bodyTexto="..""
        divParaTexto.className = atributo;
        //Aca no creamos un innetHTLM sino que le asignamos lo que contenga el custom element <tipoTexto>Titulo<tipoTexto> a nuestro div
        divParaTexto.textContent = this.textContent;
        //y lo agregamos
        shadow.appendChild(divParaTexto);
        //
        //
        //
        //
        //Style de las clases
        const styleTexto = document.createElement("style");
        styleTexto.textContent = `
            .title{
                font-size:80px;
                color:#009048;
                text-align: center;
                font-family: 'Odibee Sans', cursive;
            }
            .body{
                font-size:40px;
                text-align: center;
                font-family: 'Odibee Sans', cursive;
            }
              .parrafo{
                font-size:20px;
                text-align: center;
                font-family: 'Odibee Sans', cursive;
              }
            
        `;
        shadow.appendChild(styleTexto);
      }
    }
  );
}
