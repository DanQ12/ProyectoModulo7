//app.js: punto de entrada del retail aseo, se usa ese nombre para centralizar la configuracion de Express antes que el servido escuche peticiones

require("dotenv").config(); //primer paso: cargar las variables del .env
//paquetes a usar
const express = require("express");
const path = require("path");


const {sequelize} = require("./src/models")
const routes = require("./src/routes");
const loggerMiddleware = require("./src/middleware/loggerMiddleware");
const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares globales --------------------------------------------------------------
app.use(express.json()); //Parseo de archivos JSON
app.use(express.urlencoded({extended: true})); //Parseo formularios urlencoded
app.use(loggerMiddleware); //Registro de cada request en un log.txt

//Archivos estaticos-----------------------------------------------------------------
//express.static conecta con todo lo que hay en la carpeta /public
app.use(express.static(path.join(__dirname,"public")));

//Carpeta para imagenes subidas
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

//Rutas publicas base----------------------------------------------------------------

//Ruta raiz que devuelve el HTML de la tienda
app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})


//Ruta /status: muestra el estado del servidor
app.get("/status", (req,res)=>{
    res.json({
        status: "ok",
        message: "Servidor RetailAseo en funcionamiento",
        timestamp: new Date().toISOString(),
        enviroment: process.env.NODE_ENV || "development",
        version: "1.0.0"
    })
})



//Rutas de la API-------------------------------------------------------------------
app.use("/api", routes)

//Middlewares de errores------------------------------------------------------------
app.use(errorMiddleware)

//Inicio del servidor con conexion a la base de datos
async function startServer(){
    try{
        //Verifica credenciales de la base de datos
    
        
        await sequelize.authenticate();
        console.log("✅ Conexion a PostgreSQL establecida.")

        //Sincronizar los modelos sin borrar los datos
        await sequelize.sync({alter: true});
        console.log("✅ Modelos sincronizados con la base de datos")

    


        app.listen(PORT, ()=>{
            console.log(`\n 🚀 Servidor iniciado: http://localhost:${PORT}`)
            console.log(`📋 Estado: http://localhost:${PORT}/status`)
            console.log(`Usuarios: http://localhost:${PORT}/api/users`)
            console.log(`🔌 API: http://localhost:${PORT}/api`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`)
        })

    }catch(err){
        console.error("❌ Error al iniciar el servidor: ", err.message);
        process.exit(1)
    }
}

startServer()
    


module.exports = app;