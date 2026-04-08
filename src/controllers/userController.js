const sequelize = require("../config/database")
const User = require("../models/User")


//funcion para revisar los datos de los usuarios 
async function getUsers (req,res,next) {

    try{
        //Comandos normales de SQL, largos y necesitan ser parametrizados
        const resultados = await sequelize.query("SELECT id, nombre, email, telefono FROM users ORDER BY id")

        res.json({
            status: "ok",
            message:  `${resultados[0].length} Resultados encontrados`,
            data: resultados[0]
        })
    }
    catch(err){
        next(err)
    }
}

//Comandos de ORM, mas cortos y no requieren de saber del lenguaje de SQL
async function updateUser(req,res,next){
    try{

        const user = await User.findByPk(req.params.id);

        if(!user){
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
                data: null
            })
        }

        await user.update(req.body);

        res.json({
            status: "success",
            message: "Usuario actualizado con exito",
            data: user
        })
    }catch(err){
        next(err)
    }
}

async function deleteUser(req,res,next){
    try{
        const user = await User.findByPk(req.params.id);

        if(!user){
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe",
                data: null
            })
        }

        await user.destroy()

        res.json({
            status: "success",
            message: "Usuario borrado exitosamente",
            data: null
        })
    }catch(err){
        next(err)
    }
}

module.exports = {getUsers, updateUser,deleteUser}