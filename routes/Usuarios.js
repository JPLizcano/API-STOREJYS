const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { validateJWT } = require("../middlewares/validate_jwt");
const { RegistrarUsuario } = require("../controllers/RegistrarUsuario");
const { ActualizarUsuario } = require("../controllers/ActualizarUsuario");
const { ListarUsuarios, BuscarUsuariosByID } = require("../controllers/ListarUsuarios");
// const { validatePermission } = require("../middlewares/permissions");

const router = Router();

router.get("/Listar", [validateJWT], ListarUsuarios);

router.get(
  "/Buscar",
  [validateJWT, check("idUsuario", "El usuario es obligatorio.").not().isEmpty(), validarCampos],
  BuscarUsuariosByID
);

router.post(
  "/Registrar",
  [
    // validateJWT, // Verifica el token primero
    // validatePermission("Desbloqueo de impresion"),
    check("Nombre", "El nombre es obligatorio.").not().isEmpty(),
    check("Apellido", "El apellido es obligatorio.").not().isEmpty(),
    check("Celular", "El número de celular es obligatorio.").not().isEmpty(),
    check("Cedula", "La cédula es obligatoria.").not().isEmpty(),
    check("Correo", "El correo es obligatorio.").not().isEmpty(),
    check("Direccion", "La dirección es obligatoria.").not().isEmpty(),
    check("Barrio", "El barrio es obligatorio.").not().isEmpty(),
    check("Ciudad", "La ciudad es obligatoria.").not().isEmpty(),
    check("Departamento", "El departamento es obligatorio.").not().isEmpty(),
    check("Pass", "La contraseña es obligatoria.").not().isEmpty(),
    validarCampos, // Middleware para manejar errores de validación
  ],
  RegistrarUsuario // Controlador que maneja la solicitud si pasa las validaciones
);

router.post(
  "/Actualizar",
  [
    validateJWT, // Verifica el token primero
    // validatePermission("Cambio de contraseñas"),
    check("Cedula", "La cédula es obligatoria.").not().isEmpty(),
    validarCampos, // Middleware para manejar errores de validación
  ],
  ActualizarUsuario // Controlador que maneja la solicitud si pasa las validaciones
);

module.exports = router;
