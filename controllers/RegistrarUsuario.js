const { poolBDPromise, sql } = require("../config/config");

async function RegistrarUsuario(req, res) {
  try {
    // if (!req.cookies.modulos.includes("Desbloqueo de impresion")) {
    //   return res.status(401).json(false);
    // }

    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool
      .request()
      .input("Nombre", sql.VarChar, req.body.Nombre)
      .input("Apellido", sql.VarChar, req.body.Apellido)
      .input("Celular", sql.VarChar, req.body.Celular)
      .input("Cedula", sql.VarChar, req.body.Cedula)
      .input("Correo", sql.VarChar, req.body.Correo)
      .input("Direccion", sql.VarChar, req.body.Direccion)
      .input("Barrio", sql.VarChar, req.body.Barrio)
      .input("Ciudad", sql.VarChar, req.body.Ciudad)
      .input("Departamento", sql.VarChar, req.body.Departamento)
      .input("Pass", sql.VarChar, req.body.Pass)
      .execute("[storejys].[dbo].[SP_STOREJYS_RegisterUser]");

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}
module.exports = { RegistrarUsuario };
