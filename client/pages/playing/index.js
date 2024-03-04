"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playing = void 0;
const state_1 = require("../../state");
const router_1 = require("@vaadin/router");
const map_1 = require("lodash/map");
class Playing extends HTMLElement {
    count = 10;
    arrayDeValores = [];
    connectedCallback() {
        this.render();
    }
    render() {
        const imgTijera = require("url:../../img/tijera.png");
        const imgPiedra = require("url:../../img/piedra.png");
        const imgPapel = require("url:../../img/papel.png");
        this.innerHTML = `
                    <div class="contenedor-img2">
                          
                        <div class="contenedor-random">
                            <img class="img-random" src="https://imgur.com/Mc7opyX.png" alt="tijera-rotado" valor="tijera" />
                            
                        </div>
                        <div class="contenedor-random">
                              <img class="img-random" src="https://imgur.com/WxZ1n4a.png" alt="piedra-rotado" valor="piedra"/>
                      
                        </div>
                        <div class="contenedor-random">
                            <img class="img-random" src="https://imgur.com/0KGjK2M.png" alt="papel-rotado" valor="papel" />
                  
                        </div>
                    </div>
    
                 <div class="counter">${this.count} </div>
                 <div class="maquina"> </div>
    
                   <div class="contenedor-img">
                        <div>
                              <img class="mi-img" src="${imgTijera}" alt="tijera" data-valor="tijera" />
                        </div>
    
                        <div>
                              <img class="mi-img" src="${imgPiedra}" alt="piedra" data-valor="piedra"/>
                       </div>
    
                        <div>
                            <img class="mi-img" src="${imgPapel}" alt="papel" data-valor="papel" />
                        </div>
                   </div>

            <style>
                   .contenedor-img{
                    display:flex;
                    justify-content: space-around;
                }

                .img-random{
                  display:none;
                  margin-top:70px;
                }
  
                .contenedor-img2{
                 }
                 
                 .contenedor-random{
                }

                .counter{
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size: 5rem; /* Ajusta el tamaño de fuente según lo necesario */
                  width: 200px;
                  height: 100px;
                  margin:50px auto;
                  padding:50px 0;
                  border: 10px solid black;
                  border-radius:200px;
  
                }
  
                .mi-img{
                  transition: transform 0.3s;
                  opacity 0.3s;
                  width:80px;
                  height:183px;
              }
  
              .mi-img:hover{
                  transform: scale(1.50); 
                  opacity: 0.8; 
                  width:80px;
                  height:183px;
                  padding-top:90px;
              }
             </style>
            `;
        const currentState = state_1.state.getState();
        ///Evento de la imagen al dar click
        const imgEvent = this.querySelectorAll(".mi-img");
        const contenedorImg = this.querySelector(".contenedor-img");
        let clickOcurred = false;
        imgEvent.forEach((imagenClickeada) => {
            imagenClickeada.addEventListener("click", () => {
                clickOcurred = true;
                const valor = imagenClickeada.getAttribute("data-valor");
                // Ocultar todas las imágenes excepto la clickeada
                //recorremos de nuevo el evento de la img, y comparamos con la imagen clickeada, si no son iguales entra al if y le damos style none
                imgEvent.forEach((img) => {
                    if (img !== imagenClickeada) {
                        img.style.display = "none";
                        contenedorImg.style.justifyContent = "center";
                    }
                });
                //El valor string del atributo de la imagen por ej "tijera" lo pusheo en mi array del state y en la base de datos con pushJugada()
                console.log("data-valor", valor);
                if (valor !== null) {
                    currentState.choice = valor;
                    state_1.state.setState(currentState);
                    state_1.state.pushJugada();
                    //
                }
            });
        });
        ///Evento del countdown
        const contadorElement = this.querySelector(".counter");
        const interval = setInterval(() => {
            if (contadorElement) {
                contadorElement.textContent = this.count.toString();
                this.count--;
                if (this.count < 0) {
                    clearInterval(interval);
                    //si clickOcurred es falso entonces entra al if y vuelve a las instrucciones y pushea el start como falso
                    if (!clickOcurred) {
                        console.log("No hiciste click en ninguna imagen y el contador llegó a cero.");
                        const currentState = state_1.state.getState();
                        currentState.online = false;
                        currentState.start = false;
                        state_1.state.setState(currentState);
                        state_1.state.pushJugada();
                        router_1.Router.go("/instrucciones");
                    }
                    contadorElement.remove();
                    this.showImagePlayer2();
                    this.showPlayerWinner();
                }
            }
        }, 1000);
    }
    showImagePlayer2() {
        const currentState = state_1.state.getState();
        const valores = []; //tijera,piedra,papel
        const imgAll = this.querySelectorAll(".img-random");
        const contenedorImg2 = this.querySelector(".contenedor-img2");
        const data = currentState.rtdbData;
        const datacompleta = (0, map_1.default)(data);
        const comparacionUserId = currentState.userId;
        if (comparacionUserId === datacompleta[0].userId) {
            const valorAtributo = datacompleta[1].choice;
            console.log("ValorAtributo", valorAtributo);
            imgAll.forEach((imgItem) => {
                const valor = imgItem.getAttribute("valor");
                if (valor == valorAtributo) {
                    console.log("Valor es:", valor);
                    console.log("Imagen es:", imgItem);
                    imgItem.style.display = "block";
                    contenedorImg2.style.display = "flex";
                    contenedorImg2.style.justifyContent = "center";
                }
            });
        }
        else {
            const valorAtributo = datacompleta[0].choice;
            imgAll.forEach((imgItem) => {
                const valor = imgItem.getAttribute("valor");
                if (valor == valorAtributo) {
                    console.log("Valor es:", valor);
                    console.log("Imagen es:", imgItem);
                    imgItem.style.display = "block";
                    contenedorImg2.style.display = "flex";
                    contenedorImg2.style.justifyContent = "center";
                }
            });
        }
    }
    showPlayerWinner() {
        const currentState = state_1.state.getState();
        const stateUserId = currentState.userId;
        const data = currentState.rtdbData;
        const datacompleta = (0, map_1.default)(data);
        if (datacompleta[0].userId === stateUserId) {
            const choice1 = datacompleta[0].choice;
            const choice2 = datacompleta[1].choice;
            if (datacompleta[0].choice === datacompleta[1].choice) {
                router_1.Router.go("/empate");
            }
            else if (["tijera", "papel", "piedra"].includes(choice1) &&
                ["tijera", "papel", "piedra"].includes(choice2)) {
                if ((choice1 === "tijera" && choice2 === "papel") ||
                    (choice1 === "papel" && choice2 === "piedra") ||
                    (choice1 === "piedra" && choice2 === "tijera")) {
                    router_1.Router.go("/win");
                    currentState.player1++;
                    state_1.state.setState(currentState);
                    state_1.state.updateRoom();
                }
                else {
                    router_1.Router.go("/loser");
                    currentState.player2++;
                    state_1.state.setState(currentState);
                    state_1.state.updateRoom();
                }
            }
        }
        if (datacompleta[1].userId === stateUserId) {
            const choice1 = datacompleta[0].choice;
            const choice2 = datacompleta[1].choice;
            if (datacompleta[1].choice === datacompleta[0].choice) {
                router_1.Router.go("/empate");
            }
            else if (["tijera", "papel", "piedra"].includes(choice1) &&
                ["tijera", "papel", "piedra"].includes(choice2)) {
                if ((choice2 === "tijera" && choice1 === "papel") ||
                    (choice2 === "papel" && choice1 === "piedra") ||
                    (choice2 === "piedra" && choice1 === "tijera")) {
                    router_1.Router.go("/win");
                    currentState.player2++;
                    state_1.state.setState(currentState);
                    state_1.state.updateRoom();
                }
                else {
                    router_1.Router.go("/loser");
                    currentState.player1++;
                    state_1.state.setState(currentState);
                    state_1.state.updateRoom();
                }
            }
        }
    }
}
exports.Playing = Playing;
customElements.define("ppt-playing", Playing);
