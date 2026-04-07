//loggerMiddleware: registra las peticiones HTTP en logs/log.txt
//Persistencia de datos (M6 P5): se usa fs para agregar lineas sin sobreescribir 

const fs = require("fs");
const path = require("path");

//chequeo que la carpeta de logs exista cuando se inicia la aplicacion
const logsDir = path.join(__dirname,"../../logs");
const logsFile = path.join(logsDir, "logs.txt");

//creacion de la carpeta si esta no existe
if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir, {recursive:true});
}

//Middleware de login: escribe linea por request recibido con formato "[DD/MM/YYYY HH:MM:SS] Metodo /ruta"
function loggerMiddleware (req, res, next){
    const now = new Date();
    const fecha = now.toLocaleDateString("es-CL"); //fecha en formato DD/MM/YYYY
    const hora = now.toLocaleTimeString("es-CL"); //hora en formato HH/MM/SS
    const ip = req.ip || req.connection.remoteAdress || "desconocida"
    const linea = `[${fecha} ${hora}] ${req.method.padEnd(6)} ${req.originalUrl} - IP: ${ip}\n`;

    //escritura asincronica en el documento
    fs.appendFile(logsFile, linea, (err) =>{
        if(err) console.error("⚠️ Error escribiendo log:", err.message);
    });

    next(); //siguiente paso del middleware
}

module.exports = loggerMiddleware;