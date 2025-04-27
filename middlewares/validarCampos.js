const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  // Verificar si hay errores de validación
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(401).json({ errores: errores.array() });
  }
  // Si no hay errores, continuar con el siguiente middleware
  next();
};

module.exports = { validarCampos };
