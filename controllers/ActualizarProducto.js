const { poolBDPromise, sql } = require("../config/config");
const cloudinaryHelper = require("../helpers/cloudinary");

async function ActualizarProducto(req, res) {
  try {
    const pool = await poolBDPromise;

    const productoExistente = await pool
      .request()
      .query(`SELECT * FROM storejys..productos WHERE Codigo = ${req.body.codigo}`);

    if (!productoExistente.recordset.length) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    
    let imageUrl = productoExistente.recordset[0].Img; // URL de la imagen actual
    let nombre = productoExistente.recordset[0].Nombre;

    // Si el usuario subió una nueva imagen, la subimos a Cloudinary
    if (req.file) {
      // Subir imagen a Cloudinary
      const result = await cloudinaryHelper.uploadImage(req.file, req.body.nombre ? req.body.nombre : nombre);
      imageUrl = result.secure_url;
    }

    const resultado = await pool
      .request()
      .input("idSolicitud", sql.Int, req.uid.id)
      .input("Codigo", sql.Int, req.body.codigo)
      .input("Nombre", sql.VarChar, req.body.nombre)
      .input("Stock", sql.Int, req.body.stock)
      .input("ValorCompra", sql.Int, req.body.valorCompra)
      .input("ValorVenta", sql.Int, req.body.valorVenta)
      .input("Img", sql.VarChar, imageUrl)
      .input("idTipoProducto", sql.Int, req.body.idTipoProducto)
      .execute("[storejys].[dbo].[SP_STOREJYS_UpdateProduct]");

    if (!resultado.recordset.length) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(resultado.recordsets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno");
  }
}

module.exports = { ActualizarProducto };