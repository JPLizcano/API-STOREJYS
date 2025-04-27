const { poolBDPromise, sql } = require("../config/config");

async function ListarUsuarios(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request()
    .input("idSolicitud", sql.Int, req.uid.id)
    .execute(`[storejys].[dbo].[SP_STOREJYS_FindAllUsers]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function BuscarUsuariosByID(req, res) {
  try {

    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request()
    .input("idSolicitud", sql.Int, req.uid.id)
    .input("idUsuario", sql.Int, req.body.idUsuario)
    .execute(`[storejys].[dbo].[SP_STOREJYS_FindUser]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}
module.exports = { ListarUsuarios, BuscarUsuariosByID };
