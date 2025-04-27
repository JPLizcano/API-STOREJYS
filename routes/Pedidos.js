const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { validateJWT } = require("../middlewares/validate_jwt");
const { RegistrarPedido } = require("../controllers/RegistrarPedido");
const { ActualizarPedido } = require("../controllers/ActualizarPedido");
const { ListarPedidos, BuscarPedido, BuscarPedidoByUser } = require("../controllers/ListarPedidos");
// const { validatePermission } = require("../middlewares/permissions");

const router = Router();

router.get("/Listar", [validateJWT], ListarPedidos);

router.get(
  "/Buscar",
  [validateJWT, check("numPedido", "El número del pedido es obligatorio.").not().isEmpty(), validarCampos],
  BuscarPedido
);

router.get(
  "/BuscarByUser",
  [validateJWT, check("idUsuario", "El número del pedido es obligatorio.").not().isEmpty(), validarCampos],
  BuscarPedidoByUser
);

router.post(
  "/Registrar",
  [
    validateJWT, // Verifica el token primero
    // validatePermission("Desbloqueo de impresion"),
    // check("idUsuario", "El nombre es obligatorio.").not().isEmpty(),
    check("direccionEnvio", "El stock es obligatorio.").not().isEmpty(),
    check("idsProductos", "El valor de compra es obligatorio.").not().isEmpty(),
    check("cantidades", "El valor de venta es obligatorio.").not().isEmpty(),
    validarCampos, // Middleware para manejar errores de validación
  ],
  RegistrarPedido // Controlador que maneja la solicitud si pasa las validaciones
);

router.post(
  "/Actualizar",
  [
    validateJWT, // Verifica el token primero
    // validatePermission("Desbloqueo de impresion"),
    // check("idSolicitud", "El id del usuario es obligatorio.").not().isEmpty(),
    check("numeroPedido", "El número de pedido es obligatorio.").not().isEmpty(),
    validarCampos, // Middleware para manejar errores de validación
  ],
  ActualizarPedido // Controlador que maneja la solicitud si pasa las validaciones
);

module.exports = router;
