const { poolBDPromise, sql } = require("../config/config");
const crypto = require("crypto");
const { generarJWT } = require("../helpers/generar_jwt");
const jwt = require("jsonwebtoken");

async function Login(req, res) {
  try {
    const pool = await poolBDPromise; // Obtén el pool de la base de datos SS
    const resultado = await pool
      .request()
      .input("Usuario", sql.VarChar, req.body.Usuario)
      .input("Clave", sql.VarChar, req.body.Clave)
      .execute("[storejys].[dbo].[SP_STOREJYS_AuthUser]");

    const mensaje = resultado.recordset[0]?.Mensaje || "Usuario no encontrado";
    if (mensaje !== "Ingreso exitoso") {
      return res.status(401).json({ mensaje });
    }

    const usuario = resultado.recordset[0];
    const menu = usuario.Menu ? usuario.Menu.split(",").map(Number) : [];

    // Generar el token
    const tokenPayload = {
      id: usuario.ID,
      rol: usuario.Rol,
      estado: usuario.Estado,
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      menu,
    };

    const token = await generarJWT(tokenPayload);

    // Configurar la cookie
    res.cookie("authToken", token, {
      httpOnly: true, // La cookie no será accesible desde JavaScript del navegador
      secure: process.env.NODE_ENV === "production", // Usar solo HTTPS en producción
      sameSite: "Strict", // Prevenir ataques CSRF
      maxAge: 60 * 60 * 1000, // 60 minutos
      domain: "192.168.1.4",
    });

    res.json(transformarDatos({ resultado: resultado.recordset }));
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno");
  }
}

async function verificar(req, res) {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "Strict", // Ajusta según tus necesidades
      });
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    if (req.uid.id !== decoded.uid.id) {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "Strict", // Ajusta según tus necesidades
      });
      return res.status(401).json({ mensaje: "Usuario de token inválido" });
    }

    const pool = await poolBDPromise; // Obtén el pool de la base de datos BD
    // const resultado = await pool.request().query(`
    //     select idUsuario,Nombre,Apellido,Celular,Cedula,Correo,Direccion,Barrio,Ciudad,Departamento
    //     from [storejys].[dbo].[usuarios]
    //     where idUsuario = ${decoded.uid.id}`);
    const resultado = await pool.request().query(`
            select Nombre,Apellido 
            from [storejys].[dbo].[usuarios]
            where idUsuario = ${decoded.uid.id}`);
    // console.log(resultado.recordset[0])
    res.json({ usuario: resultado.recordset });
  } catch (error) {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "Strict", // Ajusta según tus necesidades
    });
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
}

// Función para transformar los datos recibidos
function transformarDatos(data) {
  const { resultado } = data;

  if (resultado.length === 0) return { resultado: {} };

  // Tomamos los primeros valores como base (los que no se repiten)
  const base = { ...resultado[0] };

  // Reemplazamos los valores que no son duplicados con arrays de `MenuId` y `Modulo`
  base.Menu = resultado.map((item) => item.Menu.split(",").map(Number)).flat();

  // Retornamos el objeto en el formato deseado
  return { resultado: base };
}

function calcularMD5Hash(input) {
  // Crear un objeto hash MD5
  const hash = crypto.createHash("md5");
  // Actualizar el hash con la entrada en formato UTF-8 y obtener el hash final en formato hexadecimal
  const hashBytes = hash.update(input, "utf8").digest("hex");
  // Convertir el hash a mayúsculas
  return hashBytes.toUpperCase();
}

module.exports = { Login, verificar };
