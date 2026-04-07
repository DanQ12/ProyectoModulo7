//errorMiddleware: manejo de errores de la API, intercepta todos los errores en los controladores, fomrato de respuestas: "{status, message, data}"

const {ValidationError, UniqueContraintError} = require("sequelize");

//Handler de error global - 4 parametros para que express lo reconozca, ultimo en registrarse en app.js
function errorMiddleware (err, req, res, next) {
    console.error("❌ Error capturado: ", err.message);

    //Error generico - usa el status del error si existe, o 500
    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        status: error,
        message: err.message,
        data: null
    })
}

module.exports = errorMiddleware;