import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Registro extends HTMLElement {
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

         <mi-button type="submit" class="mi-button" atributoBoton="Registrarse"></mi-button>
         <div class="error">
          <h2>Por favor introduzca email y nombre<h2>
         </div>
         <ppt-component></ppt-component>
      </form>

         <style>

         .error{
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
    const myButton = this.querySelector(".mi-button");
    const divError = this.querySelector(".error") as HTMLDivElement;

    myButton.addEventListener("MiButtonClick", (e) => {
      e.preventDefault();
      const email = formEvent.email.value;
      const name = formEvent.nombre.value;
      if (name.trim() === "" && email.trim() === "") {
        divError.style.display = "block";
      } else {
        divError.remove();
        console.log("name", name);
        console.log("email", email);
        state.setEmailAndFullName(email, name);
        state.signUp(() => {
          Router.go("/opciones");
        });
      }
    });
  }
}

customElements.define("init-register", Registro);
