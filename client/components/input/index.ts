export function inputComponent() {
  customElements.define(
    "input-component",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const divContener = document.createElement("div");
        divContener.className = "contenedor-input";
        divContener.innerHTML = `
            <input type="text" class="my-input">
        `;
        shadow.appendChild(divContener);
        const style = document.createElement("style");
        style.textContent = `
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
        `;
        shadow.appendChild(style);
      }
    }
  );
}
