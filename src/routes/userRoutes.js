const {Router} = require ("express");
const ctrl = require("../controllers/userController")

const router = Router();

router.get("/", ctrl.getUsers)

router.put("/:id", ctrl.updateUser)

router.delete("/:id", ctrl.deleteUser)

module.exports = router