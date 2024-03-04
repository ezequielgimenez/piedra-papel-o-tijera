import { initTextComponent } from "./components/text";
import { buttonComponent } from "./components/boton";
import { initComponentPPT } from "./components/piedra-papel-tijera";
import { inputComponent } from "./components/input";
import "./router";
import "./pages/inicio/index";
import "./pages/registro/index";
import "./pages/login/index";
import "./pages/opciones/index";
import "./pages/intrucciones/index";
import "./pages/ingresarCodigo/index";
import "./pages/share/index";
import "./pages/waitingRoom/index";
import "./pages/playing/index";
import "./pages/loser/index";
import "./pages/win/index";
import "./pages/empate/index";

(function () {
  initTextComponent();
  buttonComponent();
  initComponentPPT();
  inputComponent();
})();
