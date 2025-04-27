const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { validateJWT } = require("../middlewares/validate_jwt");
const { RegistrarProducto } = require("../controllers/RegistrarProducto");
const { ActualizarProducto } = require("../controllers/ActualizarProducto");
const { ListarProductos, ListaTipos } = require("../controllers/ListarProductos");
const multer = require("multer");
// const { validatePermission } = require("../middlewares/permissions");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/Listar", ListarProductos);
router.get("/ListarTipos", ListaTipos);

router.post(
  "/Registrar",
  [
    validateJWT, // Verifica el token primero
    // validatePermission("Desbloqueo de impresion"),
    check("codigo", "El codigo es obligatorio.").not().isEmpty(),
    check("nombre", "El nombre es obligatorio.").not().isEmpty(),
    check("stock", "El stock es obligatorio.").not().isEmpty(),
    check("valorCompra", "El valor de compra es obligatorio.").not().isEmpty(),
    check("valorVenta", "El valor de venta es obligatorio.").not().isEmpty(),
    check("img", "La imágen es obligatoria.").not().isEmpty(),
    upload.single("img"),
    check("idTipoProducto", "El tipo de producto es obligatorio.").not().isEmpty(),
    validarCampos, // Middleware para manejar errores de validación
  ],
  RegistrarProducto // Controlador que maneja la solicitud si pasa las validaciones
);

router.post(
  "/Actualizar",
  [
    validateJWT, // Verifica el token primero
    // validatePermission("Desbloqueo de impresion"),
    check("codigo", "El codigo es obligatorio.").not().isEmpty(),
    upload.single("img"),
    validarCampos, // Middleware para manejar errores de validación
  ],
  ActualizarProducto // Controlador que maneja la solicitud si pasa las validaciones
);

module.exports = router;
