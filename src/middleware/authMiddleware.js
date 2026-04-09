//Verifica las tokens JWT  para las rutas protegidas,(Ordenes, uploads y gestion de datos), para evitar exponer informaicon sensible

const jwt = require("jsonwebtoken");

//Extraccion yvalidacion del token que viene en el header, si es valido se adjunta el payload y se envia al siguiente paso, si nose responde con error 401

//El token es almaccenado usando localStorage y se usa en cada pateicion de ruta protegida

function authMiddleware(req,res,next){
    const authHeader = req.headers["authorization"];
    
    //verificacion que el header exista y el fomrato sea correcto
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            status: "error",
            message: "Acceso denegado. Token de autenticacion necesario",
            data: null
        })
    }

    const token = authHeader.split(" ")[1];//Extraccion de la parte despues de Bearer

    try{
        //Revision si el token es invalido o esta expirado
        const decoded = jwt.verify(token,process.env.JWT_SECRETE);
        req.user = decoded; //fomrato {id, email, rol, iat, exp}
        next();
    }catch(err){
        const message = err.name === "TokenExpiredError"?"Token expirado. Por favor inicia sesion nuevamente.": "Token invalido.";
        return res.status(401).json({
            status: "error",
            message: message,
            data: null
        })
    }
}

//Middleware para autorizacion por rol
/**
 * @param{...string} roles- Roles permitidos {"admin", "cliente"}
 */

function requireRole(...roles){
    return (req,res,next) => {
        if(!req.user || !roles.includes(req.user.rol)){
            return res.status(401).json({
                status: "error",
                message: "No tienes permisos para realizar esta accion",
                data: null
            })
        }
        next();
    }
}
module.exports = {authMiddleware, requireRole}