const { poolBDPromise, sql } = require("../config/config");

async function ListarProductos(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request().query(
      `select idProducto as id, idtipoproducto as tipo, Nombre as nombre, Img as imagen, ValorVenta as precio 
        from [storejys].[dbo].[productos] 
        order by nombre asc`
    );

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }
    res.json(resultado.recordsets);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function ListaTipos(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool.request().query(`select * from [storejys].[dbo].[TipoProducto]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "empty";
    }

    res.json(resultado.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function ListarPorProducto(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    const resultado = await pool
      .request()
      .input("Categoria", sql.VarChar, req.params.categoria)
      .execute(`[storejys].[dbo].[SP_STOREJYS_BuscarPorCategoria]`);

    if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
      resultado.recordset = "No se encontraron productos";
    }

    res.json(resultado.recordset);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

module.exports = { ListarProductos, ListaTipos, ListarPorProducto };
