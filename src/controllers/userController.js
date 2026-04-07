const sequelize = require("../config/database")
const User = require("../models/User")


//funcion para revisar los datos de los usuarios 
async function getUsers (req,res) {

    try{
        //Comandos normales de SQL, largos y necesitan ser parametrizados
        const resultados = await sequelize.query("SELECT id, nombre, email, telefono FROM users")

        res.json({
            status: "ok",
            message: "Resultados encontrados",
            data: resultados[0]
        })
    }
    catch(err){
        console.error("Se encontro el siguietne error: ", err.message)
    }
}

module.exports = {getUsers}