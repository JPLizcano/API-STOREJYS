const { poolBDPromise, sql } = require("../config/config");

async function ListarPedidos(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request()
    .input("idSolicitud", sql.Int, req.uid.id)
    .execute(`[storejys].[dbo].[SP_STOREJYS_FindAllPedidos]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function BuscarPedido(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request()
    .input("idSolicitud", sql.Int, req.uid.id)
    .input("numPedido", sql.Int, req.body.numPedido)
    .execute(`[storejys].[dbo].[SP_STOREJYS_FindPedido]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function BuscarPedidoByUser(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request()
    .input("idSolicitud", sql.Int, req.uid.id)
    .input("idUsuario", sql.Int, req.body.idUsuario)
    .execute(`[storejys].[dbo].[SP_STOREJYS_FindAllPedidosByUser]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}
module.exports = { ListarPedidos, BuscarPedido, BuscarPedidoByUser };
