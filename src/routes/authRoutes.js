const {Router} = require("express")
const {register, login} = require("../controllers/authController")
const {authMiddleware} = require("../middleware/authMiddleware")

//el uso de token y seguridad se aplicara en la parte 3 porque esta mas en linea con lo visto en el modulo 8 y para facilitar las pruebas en esta parte

const router = Router()

//Rutas publicas, estas no necesitan proteccion de JWT
router.post("/register", register);
router.post("/login", login);

module.exports = router;