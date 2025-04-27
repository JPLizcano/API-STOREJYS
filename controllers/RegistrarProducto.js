const { poolBDPromise, sql } = require("../config/config");
const cloudinaryHelper = require("../helpers/cloudinary");

async function RegistrarProducto(req, res) {
  if (!req.file) return res.status(500).json({ message: "Error al subir la imagen" });

  try {
    // Subir imagen a Cloudinary
    const result = await cloudinaryHelper.uploadImage(req.file, req.body.nombre);
    const imageUrl = result.secure_url;

    const pool = await poolBDPromise;
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
      .execute("[storejys].[dbo].[SP_STOREJYS_RegisterProduct]");

    res.json(resultado.recordsets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno");
  }
}

module.exports = { RegistrarProducto };

// const { poolBDPromise, sql } = require("../config/config");

// async function RegistrarProducto(req, res) {
//   try {
//     // if (!req.cookies.modulos.includes("Desbloqueo de impresion")) {
//     //   return res.status(401).json(false);
//     // }

//     const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
//     const resultado = await pool
//       .request()
//       .input("idSolicitud", sql.Int, req.uid.id)
//       .input("Codigo", sql.Int, req.body.codigo)
//       .input("Nombre", sql.VarChar, req.body.nombre)
//       .input("Stock", sql.Int, req.body.stock)
//       .input("ValorCompra", sql.Int, req.body.valorCompra)
//       .input("ValorVenta", sql.Int, req.body.valorVenta)
//       .input("Img", sql.VarChar, req.body.img)
//       .execute("[storejys].[dbo].[SP_STOREJYS_RegisterProduct]");

//     if (!resultado.recordset || Object.keys(resultado.recordset).length == 0) {
//       resultado.recordset = "empty";
//     }

//     res.json(resultado.recordsets);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error interno");
//   }
// }
// module.exports = { RegistrarProducto };
