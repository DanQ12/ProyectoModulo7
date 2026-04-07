const {Router} = require("express");
const ctrl = require("../controllers/ProductController")
const {authMiddleware, requireRole}  = require("../middleware/authMiddleware");

const router = Router();

//Rutas publicas, el catalogo es visible para todos

router.get("/", ctrl.getAll)
router.get("/:id", ctrl.getById)

//Rutas privadas, admin controla el invbentario
router.post("/", authMiddleware, requireRole("admin"), ctrl.create);
router.put("/:id", authMiddleware, requireRole("admin"), ctrl.update);
router.delete("/:id", authMiddleware, requireRole("admin"), ctrl.remove);

module.exports = router;