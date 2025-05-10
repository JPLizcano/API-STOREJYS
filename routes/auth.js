const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { Login, verificar } = require("../controllers/auth");
const { validateJWT } = require("../middlewares/validate_jwt");

const router = Router();

router.post(
  "/login",
  [
    check("Usuario", "El usuario es obligatorio.").not().isEmpty(),
    check("Clave", "La clave es obligatoria.").not().isEmpty(),
    validarCampos,
  ],
  Login
);

router.post("/logout", (req, res) => {
  if (Object.keys(req.cookies).length == 0) {
    return res.json("No existe una sesión para cerrar");
  }
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Ajusta según tus necesidades
  });
  res.json("Logout exitoso");
});

router.get("/verificar", [validateJWT], verificar);

module.exports = router;
