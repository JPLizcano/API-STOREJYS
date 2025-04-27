const { poolBDPromise, sql } = require("../config/config");

async function ActualizarUsuario(req, res) {
  try {
    // if (!req.cookies.modulos.includes("Cambio de contraseñas")) {
    //   return res.status(401).json(false);
    // }
    console.log(req.uid.id)
    const pool = await poolBDPromise; // Se obtiene el pool de la base de datos BD
    const resultado = await pool
      .request()
      .input("idSolicitud", sql.Int, req.uid.id)
      .input("Cedula", sql.VarChar, req.body.Cedula)
      .input("Nombre", sql.VarChar, req.body.Nombre)
      .input("Apellido", sql.VarChar, req.body.Apellido)
      .input("Celular", sql.VarChar, req.body.Celular)
      .input("Correo", sql.VarChar, req.body.Correo)
      .input("Direccion", sql.VarChar, req.body.Direccion)
      .input("Barrio", sql.VarChar, req.body.Barrio)
      .input("Ciudad", sql.VarChar, req.body.Ciudad)
      .input("Departamento", sql.VarChar, req.body.Departamento)
      .input("Pass", sql.VarChar, req.body.Pass)
      .execute("[storejys].[dbo].[SP_STOREJYS_UpdateUser]");

    if (!resultado.recordset || Object.keys(resultado.recordset).length === 0) {
      resultado.recordset = "empty";
    }

    return res.json(resultado.recordsets);
  } catch (error) {
    res.status(500).send("Error interno");
    console.log(error);
  }
}

module.exports = { ActualizarUsuario };
