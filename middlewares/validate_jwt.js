const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.json("Error con la petición");
    }

    const { uid, exp } = jwt.verify(token, process.env.SECRETKEY);
    req.uid = uid;

    const expiration = exp * 1000;

    if (Date.now() > expiration) {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "Strict", // Ajusta según tus necesidades
      });
      console.log("Sesión expirada, por favor vuelva a ingresar");
      return res.status(401).json("Sesión expirada, por favor vuelva a ingresar");
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "Strict", // Ajusta según tus necesidades
      });
      return res.status(401).json("Sesión expirada, por favor vuelva a ingresar");
    }
    console.log("Error con la petición");
    return res.status(401).json("Error con la petición");
  }
};

module.exports = { validateJWT };
