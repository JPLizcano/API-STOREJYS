require("dotenv").config();
const { poolBDPromise } = require("./config/config");
const Server = require("./models/server");

// Crear instancia del servidor
const server = new Server();

// Verificar conexión a las bases de datos
(async () => {
  try {

    const poolBD = await poolBDPromise;
    console.log("Conexión a la BD establecida correctamente");

    // Iniciar el servidor solo si las conexiones son exitosas
    server.listen();
  } catch (error) {
    console.error("Error al conectar con las bases de datos:", error);
    process.exit(1); // Finaliza la aplicación si falla la conexión
  }
})();