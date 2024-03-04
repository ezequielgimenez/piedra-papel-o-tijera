import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Login extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
         <el-texto tipoTexto="title">Piedra Papel ó Tijera</el-texto>
      <form class="form">

         <el-texto tipoTexto="body">Tu nombre</el-texto>
         <div class="contenedor-input">
            <input class="my-input" type="text" name="nombre">
          </div>

         <el-texto tipoTexto="body">Tu email</el-texto>
         <div class="contenedor-input">
             <input class="my-input" type="text" name="email">
         </div>

         <mi-button class="mi-button" atributoBoton="Login"></mi-button>

         <div class="contenedor-error">
            <h2>Por favor no dejes campos sin completar</h2>
         </div>
         <ppt-component></ppt-component>
    </form>

         <style>
             .contenedor-error{
                display:none;
                color:red;
             }
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

    const formEvent = this.querySelector(".form") as HTMLFormElement;
    const divError = this.querySelector(".contenedor-error") as HTMLDivElement;
    const miButtonEvent = this.querySelector(".mi-button");

    miButtonEvent.addEventListener("MiButtonClick", (e) => {
      e.preventDefault();
      const email = formEvent.email.value;
      const name = formEvent.nombre.value;

      if (email.trim() === "" || name.trim() === "") {
        divError.style.display = "block";
      } else {
        divError.remove();
        state.setEmailAndFullName(email, name);
        state.signIn();
        Router.go("/opciones");
      }
    });
  }
}

customElements.define("init-login", Login);
