const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = "/api/auth";
    this.UsuariosPath = "/api/Usuarios";
    this.ProductosPath = "/api/Productos";
    this.PedidosPath = "/api/Pedidos";
    //Midelewars
    this.middlewares();
    //Ruras aplicacion
    this.routes();
  }
  middlewares() {
    //cors
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL, // Cambia al dominio de tu frontend en producción
        credentials: true, // Habilitar el envío de cookies
      })
    );

    //parseo lectura body
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Cookies
    this.app.use(cookieParser());

    // Logger de solicitudes
    this.app.use(logger("dev"));

    //directorio publico por defecto
    this.app.use(express.static("public"));
  }
  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.UsuariosPath, require("../routes/Usuarios"));
    this.app.use(this.ProductosPath, require("../routes/Productos"));
    this.app.use(this.PedidosPath, require("../routes/Pedidos"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("\nServidor corriendo en puerto " + this.port);
    });
  }
}
module.exports = Server;
