const {Router} = require("express")
const {register, login, getMe} = require("../controllers/authController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = Router()

//Rutas publicas, estas no necesitan proteccion de JWT
router.post("/register", register);
router.post("/login", login);

module.exports = router;