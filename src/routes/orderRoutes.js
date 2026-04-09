const {Router} = require("express")
const ctrl = require("../controllers/orderController")
const {authMiddleware, requireRole} = require("../middleware/authMiddleware")

const router = Router();

//todas las rutas necesitan autentificacion
//router.use(authMiddleware);

router.get("/",ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create)

//rutas de acceso solo para admin
router.put("/:id/estado", /* requireRole("admin") */ ctrl.updateEstado);

module.exports = router