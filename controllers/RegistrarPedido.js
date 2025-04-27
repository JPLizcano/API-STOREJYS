const { poolBDPromise, sql } = require("../config/config");

async function RegistrarPedido(req, res) {
  try {
    // if (!req.cookies.modulos.includes("Desbloqueo de impresion")) {
    //   return res.status(401).json(false);
    // }
    
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool
      .request()
      .input("numeroPedido", sql.Int, req.body.numeroPedido)
      .input("idUsuario", sql.Int, req.uid.id)
      .input("direccionEnvio", sql.VarChar, req.body.direccionEnvio)
      .input("idsProductos", sql.VarChar, req.body.idsProductos)
      .input("cantidades", sql.VarChar, req.body.cantidades)
      .execute("[storejys].[dbo].[SP_STOREJYS_RegistrarPedido]");

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}
module.exports = { RegistrarPedido };
