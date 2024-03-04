"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const router = new router_1.Router(document.querySelector(".root"));
router.setRoutes([
    { path: "/", component: "init-welcome" },
    { path: "/registro", component: "init-register" },
    { path: "/login", component: "init-login" },
    { path: "/opciones", component: "init-opciones" },
    { path: "/instrucciones", component: "init-instrucciones" },
    { path: "/ingresarCodigo", component: "init-codigo" },
    { path: "/compartir", component: "init-share" },
    { path: "/esperando", component: "init-waiting" },
    { path: "/playing", component: "ppt-playing" },
    { path: "/loser", component: "el-loser" },
    { path: "/win", component: "ppt-win" },
    { path: "/empate", component: "ppt-empate" },
]);
