const sql = require("mssql");

// Configuración para las bases de datos
const dbConfigBD = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    // integratedSecurity: true, // Agrega esta línea
  },
  requestTimeout: 60000, // 60 segundos
  connectionTimeout: 60000, // 60 segundos
};

// Pool de conexiones para cada base de datos
const poolBDPromise = new sql.ConnectionPool(dbConfigBD)
  .connect()
  .then((pool) => {
    console.log("Pool de conexiones para BD creado exitosamente");
    return pool;
  })
  .catch((err) => {
    console.error("Error al conectar el pool de la base de datos BD:", err);
    throw err;
  });

module.exports = {
  sql,
  poolBDPromise,
};
