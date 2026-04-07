const {Router} = require("express");
const ctrl = require("../controllers/categoryController")

const router = Router();

//Rutas publicas que no requiern proteccion

router.get("/", ctrl.getAll)
router.get("/:id", ctrl.getById);

module.exports = router