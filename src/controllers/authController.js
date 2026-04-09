//control de registro e inicio de sesion
const {User} = require("../models")

//Crea un usuario nuevo, oculta la informacion de su contraseña y devuelve un JWT
async function register(req, res, next){
    try{
        const {nombre, email, password, telefono} = req.body;

        if(!nombre || !email || !password){
            return res.status(400).json({
                status: "Error",
                message: "Nombre, Email y Contraseña obligatorio",
                data: null
            })
        }

        //Verificar si el correo ya esta registrado
        const exists = await User.findOne({where: {email}})
        if(exists){
            return res.status(409).json({
                status: "error",
                message: "Esten email ya esta registrado",
                data: null
            })
        }

        const user = await User.create({
            nombre,
            email,
            password,
            telefono: telefono || null
        })

        res.status(201).json({
            status: "succes",
            message: "Usuario registrado exitosamente.",
            data: null
        })
    }catch(err){
        next(err); //Envia al errorMiddleware
    }
}
//Login de usuario, verifica las credenciales
async function login (req,res,next){
    try{
        const {email, password} = req.body

        //Validacion campos necesarios
        if(!email || !password){
        return res.status(400).json({
                status: "error",
                message: "Email y contraseña son obligatorios",
                data: null
            })
        }

        const user = await User.findOne({where: {email}})

        //Mensaje generico para no revelear informacion sensible
        if(!user){
            return res.status(401).json({
                status: "error",
                message: "Credenciales invalidas",
                data: null
            })
        }

        res.json({
            status: "success",
            message: "Inicio de sesion exitoso",
            data: null
        })
    }catch(err){
        next(err)
    }
}


module.exports = {register, login}